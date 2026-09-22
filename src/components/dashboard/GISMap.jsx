import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Layers, Route, LocateFixed } from 'lucide-react';

const INDIA_BOUNDS = { minLat: 6, maxLat: 37.5, minLng: 68, maxLng: 97.5 };
const STATE_CENTERS = {
  'Andhra Pradesh': [15.91, 79.74], 'Arunachal Pradesh': [28.22, 94.73],
  Assam: [26.20, 92.94], Bihar: [25.96, 85.33], Chhattisgarh: [21.28, 81.87],
  Goa: [15.30, 74.12], Gujarat: [22.26, 71.19], Haryana: [29.06, 76.09],
  'Himachal Pradesh': [31.10, 77.17], Jharkhand: [23.61, 85.28],
  Karnataka: [15.32, 75.71], Kerala: [10.85, 76.27], 'Madhya Pradesh': [23.47, 77.95],
  Maharashtra: [19.75, 75.71], Manipur: [24.66, 93.91], Meghalaya: [25.47, 91.37],
  Mizoram: [23.16, 92.94], Nagaland: [26.16, 94.56], Odisha: [20.94, 84.80],
  Punjab: [31.15, 75.34], Rajasthan: [27.02, 74.22], Sikkim: [27.53, 88.51],
  'Tamil Nadu': [11.13, 78.66], Telangana: [17.85, 79.12], Tripura: [23.94, 91.99],
  'Uttar Pradesh': [26.85, 80.95], Uttarakhand: [30.07, 79.02],
  'West Bengal': [23.68, 87.74],
};

function validCoordinate(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= INDIA_BOUNDS.minLat && lat <= INDIA_BOUNDS.maxLat
    && lng >= INDIA_BOUNDS.minLng && lng <= INDIA_BOUNDS.maxLng;
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '');
}

function districtKey(value) {
  return normalize(value).replace(/(urban|rural)$/i, '');
}

function projectKey(project) {
  return `${normalize(project?.state)}|${districtKey(project?.district)}|${normalize(project?.project_type)}`;
}

function districtProjectKey(project) {
  return `${normalize(project?.state)}|${districtKey(project?.district)}`;
}

function fallbackCoordinates(project) {
  return STATE_CENTERS[project?.state] || [22.97, 78.66];
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(value => value.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? '']));
  });
}

function buildGisIndex(rows) {
  const exact = new Map();
  const district = new Map();

  rows.forEach(row => {
    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    if (!validCoordinate(lat, lng)) return;
    const exactKey = projectKey(row);
    const districtKeyValue = districtProjectKey(row);
    if (!exact.has(exactKey)) exact.set(exactKey, [lat, lng]);
    if (!district.has(districtKeyValue)) district.set(districtKeyValue, [lat, lng]);
  });

  return { exact, district };
}

function resolveCoordinate(project, gisIndex) {
  const exact = gisIndex.exact.get(projectKey(project));
  if (exact) return { coordinate: exact, source: 'GIS district + project type' };

  const district = gisIndex.district.get(districtProjectKey(project));
  if (district) return { coordinate: district, source: 'GIS district representative' };

  const lat = Number(project?.latitude);
  const lng = Number(project?.longitude);
  const synthetic = String(project?.geo_source ?? '').toLowerCase().includes('synthetic');
  if (!synthetic && validCoordinate(lat, lng)) {
    return { coordinate: [lat, lng], source: 'Backend coordinate' };
  }

  return { coordinate: fallbackCoordinates(project), source: 'State reference center' };
}

function riskScore(project, selectedProjectId, selectedRisk) {
  const id = project?.project_id ?? project?.id;
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

export function GISMap({ projects = [], selectedProjectId, onSelectProject, selectedRisk, baselineRisk, parcels = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const projectLayerRef = useRef(null);
  const [gisIndex, setGisIndex] = useState({ exact: new Map(), district: new Map() });
  const [gisLoaded, setGisLoaded] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [showParcels, setShowParcels] = useState(true);

  const selectedProject = useMemo(
    () => projects.find(project => (project.project_id ?? project.id) === selectedProjectId),
    [projects, selectedProjectId],
  );

  const selectedResolved = useMemo(
    () => selectedProject ? resolveCoordinate(selectedProject, gisIndex) : null,
    [selectedProject, gisIndex],
  );
  const selectedCenter = selectedResolved?.coordinate || [22.97, 78.66];
  const selectedScore = selectedProject ? riskScore(selectedProject, selectedProjectId, selectedRisk) : 0;

  useEffect(() => {
    let cancelled = false;
    fetch('/gis-demo.csv')
      .then(response => {
        if (!response.ok) throw new Error(`GIS dataset request failed: ${response.status}`);
        return response.text();
      })
      .then(text => {
        if (!cancelled) {
          setGisIndex(buildGisIndex(parseCsv(text)));
          setGisLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setGisLoaded(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureLeaflet();
        await ensureClusterAssets();
        if (cancelled || !mapRef.current || mapInstance.current) return;
        const L = window.L;
        const map = L.map(mapRef.current, {
          zoomControl: true,
          preferCanvas: true,
          attributionControl: true,
          minZoom: 4,
          maxBounds: [[5, 66], [38.5, 99]],
          maxBoundsViscosity: 0.9,
        });
        map.setView([22.97, 78.66], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);
        mapInstance.current = map;
        setTimeout(() => map.invalidateSize(), 100);
      } catch (_) {}
    })();

    return () => {
      cancelled = true;
      projectLayerRef.current = null;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const L = window.L;
    if (!map || !L || !L.MarkerClusterGroup || !gisLoaded) return;

    if (projectLayerRef.current) {
      projectLayerRef.current.clearLayers();
      map.removeLayer(projectLayerRef.current);
      projectLayerRef.current = null;
    }
    if (!showProjects || !projects.length) return;

    const layer = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      maxClusterRadius: 42,
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
    });

    projects.forEach(project => {
      const id = project.project_id ?? project.id;
      const resolved = resolveCoordinate(project, gisIndex);
      const [lat, lng] = resolved.coordinate;
      const score = riskScore(project, selectedProjectId, selectedRisk);
      const color = riskColor(score);
      const selected = id === selectedProjectId;

      const marker = L.circleMarker([lat, lng], {
        radius: selected ? 9 : 6,
        color: '#ffffff',
        fillColor: color,
        fillOpacity: 0.95,
        weight: selected ? 3 : 2,
      });

      marker.bindPopup(`
        <div style="min-width:220px;font-family:Arial,sans-serif;font-size:13px;line-height:1.55">
          <div style="font-size:15px;font-weight:700;margin-bottom:8px">${id ?? 'Project'}</div>
          <div><b>Location:</b> ${project.district ?? '—'}, ${project.state ?? '—'}</div>
          <div><b>Risk:</b> <span style="color:${color};font-weight:700">${score.toFixed(0)}/100 • ${riskLevel(score)}</span></div>
          <div><b>Area:</b> ${project.land_area_acres ?? '—'} acres</div>
          <div><b>Coordinate source:</b> ${resolved.source}</div>
          <div><b>Coordinates:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
        </div>
      `);
      marker.on('click', () => onSelectProject?.(id));
      layer.addLayer(marker);
    });

    projectLayerRef.current = layer;
    map.addLayer(layer);

    if (!selectedProject) {
      const bounds = L.latLngBounds(projects.map(project => resolveCoordinate(project, gisIndex).coordinate));
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.12), { maxZoom: 8, animate: false });
    }
  }, [projects, selectedProject, selectedProjectId, selectedRisk, gisIndex, gisLoaded, showProjects, onSelectProject]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selectedProject || !selectedResolved) return;
    map.setView(selectedResolved.coordinate, 13, { animate: true });
  }, [selectedProject, selectedResolved]);

  const stats = useMemo(() => {
    let high = 0; let medium = 0; let low = 0;
    projects.forEach(project => {
      const score = riskScore(project, selectedProjectId, undefined);
      if (score >= 70) high += 1;
      else if (score >= 40) medium += 1;
      else low += 1;
    });
    return { high, medium, low };
  }, [projects, selectedProjectId]);

  const hasSimulation = Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk));
  const parcelCount = parcels.length;
  const parcelGeometryAvailable = parcels.some(parcel => parcel?.geometry || parcel?.coordinates || parcel?.polygon);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <MapPin className="h-4 w-4 text-[#F97316]" />
              Land acquisition GIS
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500">
              {gisLoaded ? 'GIS reference coordinates loaded • district-aware placement' : 'Loading GIS reference coordinates…'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowProjects(value => !value)} className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${showProjects ? 'border-orange-200 bg-orange-50 text-[#C2410C]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <Layers className="mr-1 inline h-3 w-3" /> Projects
            </button>
            <button type="button" onClick={() => setShowParcels(value => !value)} className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${showParcels ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <Route className="mr-1 inline h-3 w-3" /> Cadastral
            </button>
            <button type="button" onClick={() => mapInstance.current?.setView(selectedCenter, selectedProject ? 13 : 5)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-600">
              <LocateFixed className="mr-1 inline h-3 w-3" /> Locate
            </button>
            {hasSimulation && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-semibold text-amber-700">What-If active</span>}
          </div>
        </div>
      </div>

      <div className="relative">
        <div ref={mapRef} className="h-[430px] w-full" />
        <div className="absolute right-4 top-4 z-[500] rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur">
          <div className="text-[12px] font-bold text-slate-900">Risk Level</div>
          <div className="mt-1.5 space-y-1.5 text-[11px] text-slate-700">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#19b979' }} />Low Risk</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#e8a923' }} />Medium Risk</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#ef3340' }} />High Risk</div>
          </div>
        </div>
        <div className="absolute bottom-2 left-3 z-[500] rounded-xl bg-white/90 px-2 py-1 text-[9px] text-slate-500 shadow-sm">
          {projects.length} projects • <span className="text-rose-600">{stats.high} high</span> • <span className="text-amber-600">{stats.medium} medium</span> • <span className="text-emerald-600">{stats.low} low</span>
        </div>
      </div>

      {showParcels && parcelCount > 0 && !parcelGeometryAvailable && (
        <div className="border-t border-amber-100 bg-amber-50/70 px-4 py-2 text-[10px] text-amber-800">
          {parcelCount} cadastral records are available, but no parcel boundary geometry was supplied. The GIS intentionally does not invent polygon boundaries.
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-1.5 text-[9px] text-slate-500">
        <span>Markers use the GIS district reference first, so synthetic backend coordinates cannot move a project to another part of India.</span>
        <span>{selectedResolved?.source || 'GIS reference pending'}</span>
      </div>
    </section>
  );
}
