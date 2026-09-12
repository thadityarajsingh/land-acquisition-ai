import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Layers, Route, ShieldAlert, MousePointer2 } from 'lucide-react';

function hasValidCoordinates(project) {
  const lat = Number(project?.latitude);
  const lng = Number(project?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function fallbackCoordinates(project) {
  const centers = {
    'Uttar Pradesh': [26.85, 80.95], 'Maharashtra': [19.75, 75.7], 'Karnataka': [15.3, 75.7],
    'Tamil Nadu': [11.0, 78.3], 'Gujarat': [22.3, 71.8], 'Rajasthan': [27.0, 74.2],
    'Madhya Pradesh': [23.5, 78.0], 'Bihar': [25.8, 85.3], 'Odisha': [20.2, 84.4], 'West Bengal': [23.0, 87.8],
  };
  const center = centers[project?.state] || [22.5, 78.9];
  const text = `${project?.state ?? ''}:${project?.district ?? ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return [center[0] + ((hash % 80) - 40) / 100, center[1] + ((((hash / 80) | 0) % 80) - 40) / 100];
}

function riskLevel(score) {
  const value = Number(score);
  return value >= 70 ? 'High' : value >= 40 ? 'Medium' : 'Low';
}

function riskColor(score) {
  const value = Number(score);
  return value >= 70 ? '#dc2626' : value >= 40 ? '#d97706' : '#059669';
}

function getRisk(project, selectedRisk) {
  const raw = Number(project?.risk_score ?? project?.riskScore ?? 0);
  const base = raw <= 1 ? raw * 100 : raw;
  return Number.isFinite(Number(selectedRisk)) ? Number(selectedRisk) : (Number.isFinite(base) ? base : 50);
}

function getCenter(project) {
  return hasValidCoordinates(project) ? [Number(project.latitude), Number(project.longitude)] : fallbackCoordinates(project);
}

function buildParcelGeometry(center, count = 7) {
  const [lat, lng] = center;
  const cosLat = Math.max(0.35, Math.cos((lat * Math.PI) / 180));
  const totalWidth = 0.010 / cosLat;
  const height = 0.0042;
  const step = totalWidth / count;

  return Array.from({ length: count }, (_, index) => {
    const left = lng - totalWidth / 2 + index * step;
    const right = left + step;
    const topShift = ((index % 3) - 1) * 0.00032;
    const bottomShift = (((index + 1) % 3) - 1) * 0.00025;
    return {
      id: `Prototype-${String.fromCharCode(65 + index)}`,
      positions: [
        [lat - height / 2 + bottomShift, left],
        [lat - height / 2 + topShift, right],
        [lat + height / 2 + topShift, right + step * 0.08],
        [lat + height / 2 + bottomShift, left - step * 0.06],
      ],
    };
  });
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
  const loadCss = (href, id) => new Promise(resolve => {
    if (document.getElementById(id)) return resolve();
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve;
    document.head.appendChild(link);
  });
  const loadScript = (src, id) => new Promise((resolve, reject) => {
    if (window.L?.MarkerClusterGroup) return resolve();
    const existing = document.getElementById(id);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css', 'leaflet-markercluster-css');
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css', 'leaflet-markercluster-default-css');
  await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js', 'leaflet-markercluster-js');
}

export function GISMap({ projects = [], selectedProjectId, onSelectProject, selectedRisk, baselineRisk, parcels = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerLayerRef = useRef(null);
  const parcelLayerRef = useRef(null);
  const [showParcels, setShowParcels] = useState(true);
  const [showProjects, setShowProjects] = useState(true);

  const selectedProject = useMemo(
    () => projects.find(project => (project.project_id ?? project.id) === selectedProjectId),
    [projects, selectedProjectId],
  );
  const selectedCenter = selectedProject ? getCenter(selectedProject) : [22.5, 78.9];
  const selectedScore = selectedProject ? getRisk(selectedProject, selectedRisk) : 0;
  const selectedCategory = riskLevel(selectedScore);
  const selectedHasOfficialCoordinates = selectedProject ? hasValidCoordinates(selectedProject) : false;
  const parcelGeometry = useMemo(() => buildParcelGeometry(selectedCenter, Math.max(5, Math.min(8, parcels.length || 7))), [selectedCenter, parcels.length]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureLeaflet();
        await ensureClusterAssets();
        if (cancelled || !mapRef.current || mapInstance.current) return;
        const L = window.L;
        const map = L.map(mapRef.current, { zoomControl: true, preferCanvas: true }).setView([22.5, 78.9], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);
        mapInstance.current = map;
      } catch (_) {
        // Keep the dashboard usable if the external map provider is unavailable.
      }
    })();
    return () => {
      cancelled = true;
      markerLayerRef.current = null;
      parcelLayerRef.current = null;
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

    if (markerLayerRef.current) {
      markerLayerRef.current.clearLayers();
      map.removeLayer(markerLayerRef.current);
      markerLayerRef.current = null;
    }
    if (!showProjects) return;

    const layer = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      maxClusterRadius: 55,
      disableClusteringAtZoom: 9,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
    });

    const counts = new Map();
    projects.forEach(project => {
      const id = project.project_id ?? project.id;
      const key = hasValidCoordinates(project)
        ? `${Number(project.latitude).toFixed(6)},${Number(project.longitude).toFixed(6)}`
        : `fallback:${project.state ?? ''}:${project.district ?? ''}`;
      const duplicateIndex = counts.get(key) ?? 0;
      counts.set(key, duplicateIndex + 1);
      const [lat, lng] = getCenter(project);
      const offset = duplicateIndex === 0 ? [lat, lng] : [lat + Math.cos(duplicateIndex * 2.4) * 0.003, lng + Math.sin(duplicateIndex * 2.4) * 0.003];
      const risk = getRisk(project, id === selectedProjectId ? selectedRisk : undefined);
      const category = riskLevel(risk);
      const color = riskColor(risk);
      const marker = L.circleMarker(offset, {
        radius: id === selectedProjectId ? 10 : 6,
        color,
        fillColor: color,
        fillOpacity: 0.82,
        weight: id === selectedProjectId ? 3 : 2,
      });
      marker.bindPopup(`
        <div style="min-width:190px">
          <strong>${id ?? 'Project'}</strong><br/>
          ${project.district ?? ''}, ${project.state ?? ''}<br/>
          <strong>Risk:</strong> ${risk.toFixed(0)}/100 (${category})<br/>
          <strong>Stage:</strong> ${project.acquisition_stage ?? '—'}<br/>
          <strong>Land:</strong> ${project.land_area_acres ?? '—'} acres<br/>
          <strong>Legal disputes:</strong> ${project.legal_disputes ?? '—'}<br/>
          <strong>Compensation:</strong> ${project.compensation_status ?? '—'}
        </div>`);
      marker.on('click', () => onSelectProject?.(id));
      layer.addLayer(marker);
    });

    markerLayerRef.current = layer;
    map.addLayer(layer);
    return () => {
      layer.clearLayers();
      if (map.hasLayer(layer)) map.removeLayer(layer);
      if (markerLayerRef.current === layer) markerLayerRef.current = null;
    };
  }, [projects, selectedProjectId, selectedRisk, showProjects, onSelectProject]);

  useEffect(() => {
    const map = mapInstance.current;
    const L = window.L;
    if (!map || !L || !selectedProject) return;

    if (parcelLayerRef.current) {
      parcelLayerRef.current.forEach(layer => map.removeLayer(layer));
      parcelLayerRef.current = null;
    }
    if (!showParcels) return;

    const layers = [];
    const base = Number.isFinite(Number(baselineRisk)) ? Number(baselineRisk) : selectedScore;
    const simulated = Number.isFinite(Number(selectedRisk)) ? Number(selectedRisk) : base;
    const geometry = parcelGeometry;

    geometry.forEach((shape, index) => {
      const parcel = parcels[index] || {};
      const risk = Math.max(0, Math.min(100, selectedScore));
      const color = riskColor(risk);
      const polygon = L.polygon(shape.positions, {
        color,
        weight: index === 0 ? 3 : 2,
        fillColor: color,
        fillOpacity: 0.20,
        dashArray: '6 5',
      });
      const status = parcel.status || selectedProject.compensation_status || 'Project-level status';
      const legal = parcel.legalDispute ?? selectedProject.legal_disputes ?? 0;
      polygon.bindTooltip(shape.id, { permanent: true, direction: 'center', className: 'cadastral-label' });
      polygon.bindPopup(`
        <div style="min-width:210px">
          <strong>${shape.id}</strong><br/>
          <span>Prototype parcel • ${selectedProject.project_id ?? selectedProject.id}</span><hr/>
          <strong>Project risk:</strong> ${risk.toFixed(0)}/100 (${riskLevel(risk)})<br/>
          <strong>Compensation:</strong> ${status}<br/>
          <strong>Legal disputes:</strong> ${legal}<br/>
          <strong>What-If:</strong> ${simulated.toFixed(0)}/100<br/>
          <em>Illustrative geometry aligned to the project's dataset coordinate; not an official cadastral boundary.</em>
        </div>`);
      polygon.on('click', () => onSelectProject?.(selectedProject.project_id ?? selectedProject.id));
      polygon.addTo(map);
      layers.push(polygon);
    });

    const anchor = L.circleMarker(selectedCenter, {
      radius: 7,
      color: '#2563eb',
      fillColor: '#2563eb',
      fillOpacity: 0.95,
      weight: 3,
    });
    anchor.bindTooltip('Selected project', { direction: 'top', offset: [0, -8] });
    anchor.bindPopup(`<strong>${selectedProject.project_id ?? selectedProject.id}</strong><br/>GIS ↔ cadastral alignment anchor`);
    anchor.addTo(map);
    layers.push(anchor);

    // A short project corridor gives the parcels a meaningful acquisition context without claiming an official alignment.
    const corridor = L.polyline([
      [selectedCenter[0] - 0.0024, selectedCenter[1] - 0.006],
      [selectedCenter[0] - 0.001, selectedCenter[1] - 0.002],
      [selectedCenter[0] + 0.0005, selectedCenter[1] + 0.002],
      [selectedCenter[0] + 0.0024, selectedCenter[1] + 0.006],
    ], { color: '#2563eb', weight: 5, opacity: 0.55, dashArray: '10 8' });
    corridor.bindTooltip('Prototype acquisition corridor', { sticky: true });
    corridor.bindPopup('<strong>Prototype acquisition corridor</strong><br/><em>Illustrative project footprint; replace with official alignment geometry when available.</em>');
    corridor.addTo(map);
    layers.push(corridor);

    parcelLayerRef.current = layers;
    map.setView(selectedCenter, 13, { animate: true });
    return () => {
      layers.forEach(layer => map.removeLayer(layer));
      if (parcelLayerRef.current === layers) parcelLayerRef.current = null;
    };
  }, [selectedProject, selectedCenter, selectedScore, selectedRisk, baselineRisk, parcels, parcelGeometry, showParcels, onSelectProject]);

  const stats = {
    projects: projects.length,
    high: projects.filter(project => getRisk(project) >= 70).length,
    medium: projects.filter(project => getRisk(project) >= 40 && getRisk(project) < 70).length,
    low: projects.filter(project => getRisk(project) < 40).length,
  };
  const hasSimulation = Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk));

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <MapPin className="h-4 w-4 text-blue-600" />
              Land Acquisition Intelligence Map
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">Project locations • acquisition corridor • prototype parcel overlay • risk intelligence</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setShowProjects(value => !value)} className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${showProjects ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <Layers className="mr-1 inline h-3 w-3" /> Projects
            </button>
            <button type="button" onClick={() => setShowParcels(value => !value)} className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${showParcels ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <Route className="mr-1 inline h-3 w-3" /> Parcels + corridor
            </button>
            {hasSimulation && <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700">What-If active</span>}
          </div>
        </div>
      </div>

      <div className="relative">
        <div ref={mapRef} className="h-[500px] w-full" />

        <div className="absolute left-4 top-4 z-[500] w-[220px] rounded-xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Network overview</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div><div className="text-lg font-black text-slate-900">{stats.projects}</div><div className="text-[9px] text-slate-500">Projects mapped</div></div>
            <div><div className="text-lg font-black text-rose-600">{stats.high}</div><div className="text-[9px] text-slate-500">High risk</div></div>
            <div><div className="text-lg font-black text-amber-600">{stats.medium}</div><div className="text-[9px] text-slate-500">Medium risk</div></div>
            <div><div className="text-lg font-black text-emerald-600">{stats.low}</div><div className="text-[9px] text-slate-500">Low risk</div></div>
          </div>
        </div>

        {selectedProject && (
          <div className="absolute bottom-4 left-4 z-[500] w-[280px] rounded-xl border border-slate-200 bg-slate-950/95 p-3 text-white shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Selected project</div>
                <div className="mt-0.5 font-mono text-sm font-black">{selectedProject.project_id ?? selectedProject.id}</div>
                <div className="text-[10px] text-slate-300">{selectedProject.district}, {selectedProject.state}</div>
              </div>
              <div className="rounded-lg px-2 py-1 text-right" style={{ background: `${riskColor(selectedScore)}22`, color: riskColor(selectedScore) }}>
                <div className="text-lg font-black leading-none">{selectedScore.toFixed(0)}</div>
                <div className="text-[8px] font-bold uppercase">{selectedCategory}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-2 text-[9px]">
              <div><span className="text-slate-500">Area</span><br/><b>{selectedProject.land_area_acres ?? '—'} ac</b></div>
              <div><span className="text-slate-500">Legal</span><br/><b>{selectedProject.legal_disputes ?? '—'}</b></div>
              <div><span className="text-slate-500">Stage</span><br/><b>{selectedProject.acquisition_stage ?? '—'}</b></div>
            </div>
          </div>
        )}

        <div className="absolute right-4 top-4 z-[500] rounded-xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Risk layers</div>
          <div className="mt-2 space-y-1.5 text-[9px] text-slate-600">
            <div><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-rose-600" />High ≥ 70</div>
            <div><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-amber-600" />Medium 40–69</div>
            <div><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" />Low &lt; 40</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-2 text-[10px] text-slate-500">
        <span><MousePointer2 className="mr-1 inline h-3 w-3" />Click a project or parcel to inspect acquisition risk.</span>
        <span>{selectedHasOfficialCoordinates ? 'Dataset coordinate' : 'Fallback coordinate'} • Prototype cadastral geometry</span>
      </div>
    </section>
  );
}
