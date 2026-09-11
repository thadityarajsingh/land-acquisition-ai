import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

function hasValidCoordinates(project) {
  const lat = Number(project.latitude);
  const lng = Number(project.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function fallbackCoordinates(project) {
  const centers = {
    'Uttar Pradesh': [26.85, 80.95], 'Maharashtra': [19.75, 75.7], 'Karnataka': [15.3, 75.7],
    'Tamil Nadu': [11.0, 78.3], 'Gujarat': [22.3, 71.8], 'Rajasthan': [27.0, 74.2],
    'Madhya Pradesh': [23.5, 78.0], 'Bihar': [25.8, 85.3], 'Odisha': [20.2, 84.4], 'West Bengal': [23.0, 87.8],
  };
  const center = centers[project.state] || [22.5, 78.9];
  const text = `${project.state ?? ''}:${project.district ?? ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return [center[0] + ((hash % 80) - 40) / 100, center[1] + ((((hash / 80) | 0) % 80) - 40) / 100];
}

function getCoordinates(project, duplicateIndex = 0) {
  const [lat, lng] = hasValidCoordinates(project) ? [Number(project.latitude), Number(project.longitude)] : fallbackCoordinates(project);
  if (duplicateIndex === 0) return [lat, lng];
  const angle = duplicateIndex * 2.399963229728653;
  const radius = 0.0035 * Math.sqrt(duplicateIndex);
  return [lat + Math.cos(angle) * radius, lng + Math.sin(angle) * radius];
}

function riskColor(risk) {
  return risk >= 70 ? '#dc2626' : risk >= 40 ? '#d97706' : '#059669';
}

async function ensureClusterAssets() {
  const loadCss = (href, id) => new Promise(resolve => {
    if (document.getElementById(id)) return resolve();
    const link = document.createElement('link'); link.id = id; link.rel = 'stylesheet'; link.href = href;
    link.onload = resolve; link.onerror = resolve; document.head.appendChild(link);
  });
  const loadScript = (src, id) => new Promise((resolve, reject) => {
    if (window.L?.MarkerClusterGroup) return resolve();
    const existing = document.getElementById(id);
    if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', reject, { once: true }); return; }
    const script = document.createElement('script'); script.id = id; script.src = src; script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
  });
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css', 'leaflet-markercluster-css');
  await loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css', 'leaflet-markercluster-default-css');
  await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js', 'leaflet-markercluster-js');
}

function cadastralGeometry(center, parcels = []) {
  const [lat, lng] = center;
  // Small parcel footprint so the vector surface is visibly tied to the selected point.
  const width = 0.0048;
  const height = 0.0032;
  const columns = 5;
  return Array.from({ length: columns }, (_, index) => {
    const left = lng - width / 2 + (width / columns) * index;
    const right = lng - width / 2 + (width / columns) * (index + 1);
    const skew = (index - 2) * 0.00018;
    const parcel = parcels[index] || {};
    return {
      parcel,
      positions: [[lat - height / 2, left], [lat - height / 2 + skew, right], [lat + height / 2, right + 0.00005], [lat + height / 2 - skew, left - 0.00005]],
    };
  });
}

export function GISMap({ projects = [], selectedProjectId, onSelectProject, selectedRisk, baselineRisk, parcels = [] }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const clusterRef = useRef(null);
  const cadastralRef = useRef(null);
  const [showCadastral, setShowCadastral] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadLeaflet = async () => {
      if (!window.L) await new Promise((resolve, reject) => {
        const existing = document.getElementById('leaflet-js');
        if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', reject, { once: true }); return; }
        const script = document.createElement('script'); script.id = 'leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
      });
      if (cancelled || !mapRef.current || instanceRef.current) return;
      await ensureClusterAssets();
      if (cancelled || !mapRef.current || instanceRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([22.5, 78.9], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
      instanceRef.current = map;
    };
    loadLeaflet().catch(() => {});
    return () => { cancelled = true; clusterRef.current = null; cadastralRef.current = null; if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, []);

  useEffect(() => {
    const map = instanceRef.current;
    const L = window.L;
    if (!map || !L || !L.MarkerClusterGroup) return;
    if (clusterRef.current) { clusterRef.current.clearLayers(); map.removeLayer(clusterRef.current); clusterRef.current = null; }
    const markerLayer = L.markerClusterGroup({ chunkedLoading: true, showCoverageOnHover: false, maxClusterRadius: 55, disableClusteringAtZoom: 9, spiderfyOnMaxZoom: true, zoomToBoundsOnClick: true });
    const coordinateCounts = new Map();
    projects.forEach(project => {
      const id = project.project_id ?? project.id;
      const key = hasValidCoordinates(project) ? `${Number(project.latitude).toFixed(6)},${Number(project.longitude).toFixed(6)}` : `fallback:${project.state ?? ''}:${project.district ?? ''}`;
      const duplicateIndex = coordinateCounts.get(key) ?? 0; coordinateCounts.set(key, duplicateIndex + 1);
      const [lat, lng] = getCoordinates(project, duplicateIndex);
      const isSelected = id === selectedProjectId;
      const rawRisk = Number(project.risk_score ?? project.riskScore ?? 0);
      let risk = rawRisk <= 1 ? rawRisk * 100 : rawRisk;
      if (isSelected && Number.isFinite(Number(selectedRisk))) risk = Number(selectedRisk);
      const category = risk >= 70 ? 'High' : risk >= 40 ? 'Medium' : 'Low';
      const color = riskColor(risk);
      const source = hasValidCoordinates(project) ? (project.geo_source || 'Dataset coordinate') : 'Fallback district/state coordinate';
      const simulationNote = isSelected && Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk)) ? `<br/>Baseline: ${Number(baselineRisk).toFixed(1)}/100<br/><strong>What-If: ${Number(selectedRisk).toFixed(1)}/100</strong>` : '';
      const marker = L.circleMarker([lat, lng], { radius: isSelected ? 10 : 7, color, fillColor: color, fillOpacity: 0.8, weight: 2 });
      marker.bindPopup(`<strong>${id ?? 'Project'}</strong><br/>${project.district ?? ''}, ${project.state ?? ''}<br/>Risk: ${risk.toFixed(1)}/100 (${category})<br/>Stage: ${project.acquisition_stage ?? '—'}<br/>Lat/Lng: ${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}<br/>Source: ${source}${duplicateIndex > 0 ? '<br/><em>Visual offset applied for overlapping coordinates</em>' : ''}${simulationNote}`);
      marker.on('click', () => onSelectProject?.(id));
      markerLayer.addLayer(marker);
    });
    clusterRef.current = markerLayer; map.addLayer(markerLayer);
    const selected = projects.find(project => (project.project_id ?? project.id) === selectedProjectId);
    if (selected) {
      const [lat, lng] = getCoordinates(selected, 0);
      map.setView([lat, lng], 12);
    }
    return () => { markerLayer.clearLayers(); if (map.hasLayer(markerLayer)) map.removeLayer(markerLayer); if (clusterRef.current === markerLayer) clusterRef.current = null; };
  }, [projects, selectedProjectId, selectedRisk, baselineRisk, onSelectProject]);

  useEffect(() => {
    const map = instanceRef.current;
    const L = window.L;
    if (!map || !L || !selectedProjectId) return;
    if (cadastralRef.current) { cadastralRef.current.forEach(layer => map.removeLayer(layer)); cadastralRef.current = null; }
    if (!showCadastral) return;
    const selected = projects.find(project => (project.project_id ?? project.id) === selectedProjectId);
    if (!selected || !hasValidCoordinates(selected)) return;
    const center = [Number(selected.latitude), Number(selected.longitude)];
    const layers = [];
    const geometry = cadastralGeometry(center, parcels);
    geometry.forEach(({ parcel, positions }, index) => {
      const baseRisk = Number(parcel.riskScore ?? selected.risk_score ?? selected.riskScore ?? 50);
      const baseline = Number.isFinite(Number(baselineRisk)) ? Number(baselineRisk) : baseRisk;
      const simulated = Number.isFinite(Number(selectedRisk)) ? Number(selectedRisk) : baseline;
      const risk = Math.max(0, Math.min(100, baseRisk + (simulated - baseline) * 0.35));
      const polygon = L.polygon(positions, { color: riskColor(risk), weight: index === 0 ? 3 : 2, fillColor: riskColor(risk), fillOpacity: 0.22, dashArray: '5 4' });
      const gut = parcel.gutNo || `Parcel ${String.fromCharCode(65 + index)}`;
      polygon.bindTooltip(gut, { permanent: true, direction: 'center', className: 'cadastral-label' });
      polygon.bindPopup(`<strong>${gut}</strong><br/>Prototype cadastral vector overlay<br/>Risk: ${risk.toFixed(1)}/100<br/>Project: ${selected.project_id ?? selected.id}<br/><em>Geometry is illustrative; not an official cadastral boundary.</em>`);
      polygon.on('click', () => onSelectProject?.(selected.project_id ?? selected.id));
      polygon.addTo(map); layers.push(polygon);
    });
    const centerMarker = L.circleMarker(center, { radius: 5, color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.9, weight: 2 });
    centerMarker.bindPopup(`<strong>${selected.project_id ?? selected.id}</strong><br/>GIS ↔ Cadastral alignment anchor<br/>${selected.district ?? ''}, ${selected.state ?? ''}`);
    centerMarker.addTo(map); layers.push(centerMarker);
    cadastralRef.current = layers;
    return () => { layers.forEach(layer => map.removeLayer(layer)); if (cadastralRef.current === layers) cadastralRef.current = null; };
  }, [projects, selectedProjectId, parcels, selectedRisk, baselineRisk, showCadastral, onSelectProject]);

  const hasSimulation = Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk));
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div><div className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-blue-600" />Project GIS + Cadastral Overlay</div><p className="mt-0.5 text-[11px] text-slate-500">OpenStreetMap • dataset coordinates • clustered projects • cadastral vector alignment</p></div>
        <div className="flex items-center gap-2"><button type="button" onClick={() => setShowCadastral(value => !value)} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${showCadastral ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{showCadastral ? 'Cadastral ON' : 'Cadastral OFF'}</button>{hasSimulation && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">What-If active</span>}</div>
      </div>
      <div ref={mapRef} className="h-[460px] w-full" />
      <div className="border-t border-slate-200 px-4 py-2 text-[10px] text-slate-500">Blue anchor = selected project • colored dashed polygons = prototype cadastral vector surface • click a parcel for details</div>
    </section>
  );
}
