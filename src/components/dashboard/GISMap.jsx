import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Layers, Route } from 'lucide-react';

function hasValidCoordinates(project) {
  const lat = Number(project?.latitude);
  const lng = Number(project?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function isWithinIndia(project) {
  const lat = Number(project?.latitude);
  const lng = Number(project?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= 6.4 && lat <= 37.2 && lng >= 68.0 && lng <= 97.5;
}

function fallbackCoordinates(project) {
  const centers = {
    'Uttar Pradesh': [26.85, 80.95],
    Maharashtra: [19.75, 75.70],
    Karnataka: [15.30, 75.70],
    'Tamil Nadu': [11.00, 78.30],
    Gujarat: [22.30, 71.80],
    Rajasthan: [27.00, 74.20],
    'Madhya Pradesh': [23.50, 78.00],
    Bihar: [25.80, 85.30],
    Odisha: [20.20, 84.40],
    'West Bengal': [23.00, 87.80],
  };
  return centers[project?.state] || [22.50, 78.90];
}

function getCenter(project) {
  return hasValidCoordinates(project)
    ? [Number(project.latitude), Number(project.longitude)]
    : fallbackCoordinates(project);
}

function normalizeSearchValue(value) {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeDistrict(value) {
  return normalizeSearchValue(value).replace(/urban$|rural$/, '');
}

function parseCsv(csvText) {
  const [headerLine, ...rows] = csvText.trim().split(/\r?\n/);
  if (!headerLine) return [];
  const headers = headerLine.split(',');
  return rows.filter(Boolean).map(row => {
    const values = row.split(',');
    return headers.reduce((record, header, index) => {
      record[header] = values[index] ?? '';
      return record;
    }, {});
  });
}

function riskScore(project, selectedProjectId, selectedRisk) {
  const id = project?.backendProjectId ?? project?.project_id ?? project?.id;
  if (id === selectedProjectId && Number.isFinite(Number(selectedRisk))) {
    return Math.max(0, Math.min(100, Number(selectedRisk)));
  }
  const raw = Number(project?.risk_score ?? project?.riskScore ?? 0);
  return Math.max(0, Math.min(100, raw <= 1 ? raw * 100 : raw));
}

function riskLevel(score) {
  return score >= 70 ? 'High Risk' : score >= 40 ? 'Medium Risk' : 'Low Risk';
}

function riskColor(score) {
  return score >= 70 ? '#ef3340' : score >= 40 ? '#e8a923' : '#19b979';
}

function buildParcelGeometry(center, count = 6) {
  const [lat, lng] = center;
  const templates = [
    [[-0.0029, -0.0042], [-0.0024, -0.0012], [0.0001, -0.0014], [0.0005, -0.0040]],
    [[-0.0024, -0.0011], [-0.0025, 0.0012], [0.0004, 0.0014], [0.0001, -0.0014]],
    [[-0.0025, 0.0013], [-0.0020, 0.0040], [0.0007, 0.0036], [0.0004, 0.0014]],
    [[0.0006, -0.0040], [0.0001, -0.0014], [0.0030, -0.0010], [0.0034, -0.0037]],
    [[0.0002, -0.0013], [0.0004, 0.0014], [0.0032, 0.0015], [0.0030, -0.0010]],
    [[0.0007, 0.0037], [0.0030, 0.0015], [0.0037, 0.0040], [0.0032, 0.0047]],
  ];
  return templates.slice(0, count).map((points, index) => ({
    id: `Plot ${index + 1}`,
    positions: points.map(([dy, dx]) => [lat + dy, lng + dx]),
  }));
}

async function ensureLeaflet() {
  if (window.L) return;
  await new Promise((resolve, reject) => {
    const existing = document.getElementById('leaflet-js');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function ensureClusterAssets() {
  const addCss = (href, id) => {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  addCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css', 'leaflet-markercluster-css');
  addCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css', 'leaflet-markercluster-default-css');
  if (window.L?.MarkerClusterGroup) return;
  await new Promise((resolve, reject) => {
    const existing = document.getElementById('leaflet-markercluster-js');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'leaflet-markercluster-js';
    script.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function GISMap({ projects = [], selectedProjectId, onSelectProject, selectedRisk, baselineRisk, parcels = [], searchQuery = '' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const projectLayerRef = useRef(null);
  const parcelLayerRef = useRef([]);
  const anchorLayerRef = useRef(null);
  const [showProjects, setShowProjects] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [gisProjects, setGisProjects] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/gis-demo.csv')
      .then(response => {
        if (!response.ok) throw new Error('GIS dataset unavailable');
        return response.text();
      })
      .then(csvText => {
        if (!cancelled) setGisProjects(parseCsv(csvText));
      })
      .catch(() => {
        if (!cancelled) setGisProjects([]);
      });
    return () => { cancelled = true; };
  }, []);

  const selectedProject = useMemo(
    () => projects.find(project => (project.project_id ?? project.id) === selectedProjectId),
    [projects, selectedProjectId],
  );
  const mapProjects = useMemo(() => {
    if (!gisProjects.length) return projects;
    const projectByLocation = new Map(
      projects.map(project => [`${project.state}|${normalizeDistrict(project.district)}`, project]),
    );
    return gisProjects.filter(isWithinIndia).map(project => {
      const matchingProject = projectByLocation.get(`${project.state}|${normalizeDistrict(project.district)}`)
        || projects.find(item => item.state === project.state && item.project_type === project.project_type);
      return {
        ...project,
        risk_score: matchingProject?.risk_score,
        riskScore: matchingProject?.riskScore,
        backendProjectId: matchingProject?.id,
      };
    });
  }, [gisProjects, projects]);
  const selectedMapProject = useMemo(() => {
    if (!selectedProject || !gisProjects.length) return selectedProject;
    const district = String(selectedProject.district).split(',')[0];
    return gisProjects.find(project => project.state === selectedProject.state
      && normalizeDistrict(project.district) === normalizeDistrict(district))
      || gisProjects.find(project => project.state === selectedProject.state
        && project.project_type === selectedProject.project_type)
      || selectedProject;
  }, [gisProjects, selectedProject]);
  const visibleMapProjects = useMemo(() => {
    const query = normalizeSearchValue(searchQuery);
    if (!query) return mapProjects;
    return mapProjects.filter(project => [
      project.project_id,
      project.backendProjectId,
      project.district,
      project.state,
      project.project_type,
    ].some(value => normalizeSearchValue(value).includes(query)));
  }, [mapProjects, searchQuery]);
  const selectedCenter = selectedMapProject ? getCenter(selectedMapProject) : [22.5, 78.9];
  const selectedScore = selectedProject ? riskScore(selectedProject, selectedProjectId, selectedRisk) : 0;
  const parcelGeometry = useMemo(
    () => buildParcelGeometry(selectedCenter, Math.max(5, Math.min(6, parcels.length || 6))),
    [selectedCenter, parcels.length],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureLeaflet();
        await ensureClusterAssets();
        if (cancelled || !mapRef.current || mapInstance.current) return;
        const L = window.L;
        const indiaBounds = [[6.4, 68.0], [37.2, 97.5]];
        const map = L.map(mapRef.current, {
          zoomControl: true,
          preferCanvas: true,
          attributionControl: true,
          maxBounds: indiaBounds,
          maxBoundsViscosity: 1.0,
          minZoom: 4.5,
        });
        map.fitBounds(indiaBounds, { padding: [12, 12] });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);
        mapInstance.current = map;
        setTimeout(() => map.invalidateSize(), 100);
      } catch (_) {
        // Keep the dashboard usable if external map assets are unavailable.
      }
    })();
    return () => {
      cancelled = true;
      projectLayerRef.current = null;
      parcelLayerRef.current = [];
      anchorLayerRef.current = null;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const L = window.L;
    if (!map || !L || !L.MarkerClusterGroup) return;
    if (projectLayerRef.current) {
      projectLayerRef.current.clearLayers();
      if (map.hasLayer(projectLayerRef.current)) map.removeLayer(projectLayerRef.current);
      projectLayerRef.current = null;
    }
    if (!showProjects) return;

    const layer = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      maxClusterRadius: 42,
      disableClusteringAtZoom: 9,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
    });

    const coordinateCounts = new Map();
    visibleMapProjects.forEach(project => {
      const id = project.backendProjectId || project.project_id || project.id;
      const [lat, lng] = getCenter(project);
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const duplicateIndex = coordinateCounts.get(key) ?? 0;
      coordinateCounts.set(key, duplicateIndex + 1);
      const offset = duplicateIndex === 0
        ? [lat, lng]
        : [lat + Math.cos(duplicateIndex * 2.4) * 0.0025, lng + Math.sin(duplicateIndex * 2.4) * 0.0025];
      const score = riskScore(project, selectedProjectId, selectedRisk);
      const color = riskColor(score);
      const selected = id === selectedProjectId;
      const marker = L.circleMarker(offset, {
        radius: selected ? 9 : 6,
        color: '#ffffff',
        fillColor: color,
        fillOpacity: 0.95,
        weight: selected ? 3 : 2,
      });
      marker.bindPopup(`
        <div style="min-width:205px;font-family:Arial,sans-serif;font-size:13px;line-height:1.55">
          <div style="font-size:15px;font-weight:700;margin-bottom:8px">${id ?? 'Project'}</div>
          <div><b>Land area:</b> ${project.land_area_acres ?? '—'} Acres</div>
          <div><b>Risk:</b> <span style="color:${color};font-weight:700">${score.toFixed(0)}/100 • ${riskLevel(score)}</span></div>
          <div><b>Latitude:</b> ${Number(lat).toFixed(4)}</div>
          <div><b>Longitude:</b> ${Number(lng).toFixed(4)}</div>
          <div><b>Stage:</b> ${project.acquisition_stage ?? '—'}</div>
          <div><b>District:</b> ${project.district ?? '—'}</div>
          <div><b>GIS plot:</b> ${project.project_id ?? '—'}</div>
        </div>
      `);
      marker.on('click', () => onSelectProject?.(project.backendProjectId || id));
      layer.addLayer(marker);
    });
    projectLayerRef.current = layer;
    map.addLayer(layer);
  }, [visibleMapProjects, selectedMapProject, selectedProjectId, selectedRisk, showProjects, onSelectProject]);

  useEffect(() => {
    const map = mapInstance.current;
    const L = window.L;
    if (!map || !L || !selectedProject) return;

    parcelLayerRef.current.forEach(layer => map.removeLayer(layer));
    parcelLayerRef.current = [];
    if (anchorLayerRef.current) {
      map.removeLayer(anchorLayerRef.current);
      anchorLayerRef.current = null;
    }
    if (!showParcels) return;

    const baseline = Number.isFinite(Number(baselineRisk)) ? Number(baselineRisk) : selectedScore;
    const simulated = Number.isFinite(Number(selectedRisk)) ? Number(selectedRisk) : baseline;
    const projectColor = riskColor(simulated);
    const layers = [];

    parcelGeometry.forEach((shape, index) => {
      const parcel = parcels[index] || {};
      const polygon = L.polygon(shape.positions, {
        color: projectColor,
        weight: index === 0 ? 2.5 : 1.6,
        fillColor: projectColor,
        fillOpacity: index === 0 ? 0.20 : 0.12,
        dashArray: index === 0 ? '7 4' : '4 4',
      });
      // Intentionally no permanent parcel labels: the map stays clean at project scale.
      polygon.bindPopup(`
        <div style="min-width:215px;font-family:Arial,sans-serif;font-size:12px;line-height:1.55">
          <div style="font-size:15px;font-weight:700;margin-bottom:6px">${shape.id}</div>
          <div><b>Project:</b> ${selectedProject.project_id ?? selectedProject.id}</div>
          <div><b>Project risk:</b> <span style="color:${projectColor};font-weight:700">${simulated.toFixed(0)}/100 • ${riskLevel(simulated)}</span></div>
          <div><b>Compensation:</b> ${parcel.status || selectedProject.compensation_status || '—'}</div>
          <div><b>Acquisition stage:</b> ${selectedProject.acquisition_stage || '—'}</div>
          <div style="margin-top:6px;color:#64748b"><em>Prototype parcel geometry spatially aligned to the selected project coordinate.</em></div>
        </div>
      `);
      polygon.on('click', () => onSelectProject?.(selectedProject.project_id ?? selectedProject.id));
      polygon.addTo(map);
      layers.push(polygon);
    });

    const anchor = L.circleMarker(selectedCenter, {
      radius: 8,
      color: '#ffffff',
      weight: 3,
      fillColor: projectColor,
      fillOpacity: 1,
    });
    anchor.bindTooltip(`Selected project • ${selectedProject.project_id ?? selectedProject.id}`, { direction: 'top', offset: [0, -8] });
    anchor.bindPopup(`
      <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.5">
        <b>${selectedProject.project_id ?? selectedProject.id}</b><br/>
        ${selectedProject.district ?? '—'}, ${selectedProject.state ?? '—'}<br/>
        Risk: ${simulated.toFixed(0)}/100 • ${riskLevel(simulated)}<br/>
        <span style="color:#64748b">GIS-cadastral alignment anchor</span>
      </div>
    `);
    anchor.on('click', () => onSelectProject?.(selectedProject.project_id ?? selectedProject.id));
    anchor.addTo(map);
    anchorLayerRef.current = anchor;
    parcelLayerRef.current = layers;
    map.setView(selectedCenter, 14, { animate: true });
  }, [selectedProject, selectedCenter, selectedScore, selectedRisk, baselineRisk, parcels, parcelGeometry, showParcels, onSelectProject]);

  const stats = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;
    visibleMapProjects.forEach(project => {
      const score = riskScore(project, selectedProjectId, undefined);
      if (score >= 70) high += 1;
      else if (score >= 40) medium += 1;
      else low += 1;
    });
    return { high, medium, low };
  }, [visibleMapProjects, selectedProjectId]);

  const hasSimulation = Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk));

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <MapPin className="h-4 w-4 text-blue-600" />
              Land parcels and their acquisition risk
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500">OpenStreetMap • dataset coordinates • spatial risk visualization</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowProjects(v => !v)} className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${showProjects ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <Layers className="mr-1 inline h-3 w-3" /> Projects
            </button>
            <button type="button" onClick={() => setShowParcels(v => !v)} className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${showParcels ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <Route className="mr-1 inline h-3 w-3" /> Cadastral
            </button>
            {hasSimulation && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-semibold text-amber-700">What-If active</span>}
          </div>
        </div>
      </div>

      <div className="relative z-0 isolate">
        <div ref={mapRef} className="h-[360px] w-full" />
        <div className="absolute right-4 top-4 z-[500] rounded-lg border border-slate-200 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur">
          <div className="text-[12px] font-bold text-slate-900">Risk Level</div>
          <div className="mt-1.5 space-y-1.5 text-[11px] text-slate-700">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#19b979' }} />Low Risk</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#e8a923' }} />Medium Risk</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#ef3340' }} />High Risk</div>
          </div>
        </div>
        <div className="absolute bottom-2 left-3 z-[500] rounded-md bg-white/90 px-2 py-1 text-[9px] text-slate-500 shadow-sm">
          {visibleMapProjects.length} projects • <span className="text-rose-600">{stats.high} high</span> • <span className="text-amber-600">{stats.medium} medium</span> • <span className="text-emerald-600">{stats.low} low</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-1.5 text-[9px] text-slate-500">
        <span>Click a project marker or parcel to inspect acquisition risk.</span>
        <span>{selectedProject && hasValidCoordinates(selectedProject) ? 'Dataset coordinate' : 'Fallback coordinate'} • Demo parcel geometry</span>
      </div>
    </section>
  );
}
