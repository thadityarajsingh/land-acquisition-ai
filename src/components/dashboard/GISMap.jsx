import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

function hasValidCoordinates(project) {
  const lat = Number(project.latitude);
  const lng = Number(project.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function getCoordinates(project, duplicateIndex = 0) {
  const lat = Number(project.latitude);
  const lng = Number(project.longitude);

  if (!hasValidCoordinates(project)) return null;
  if (duplicateIndex === 0) return [lat, lng];

  // Several demo projects can intentionally share a district-center coordinate.
  // Apply a small deterministic visual offset so every project remains clickable.
  const angle = (duplicateIndex * 137.508) * (Math.PI / 180);
  const radius = 0.0035 * Math.ceil(duplicateIndex / 6);
  return [lat + Math.sin(angle) * radius, lng + Math.cos(angle) * radius];
}

function riskColor(risk) {
  return risk >= 70 ? '#dc2626' : risk >= 40 ? '#d97706' : '#059669';
}

export function GISMap({ projects = [], selectedProjectId, onSelectProject, selectedRisk, baselineRisk }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      if (!mapRef.current || instanceRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([22.5, 78.9], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors', maxZoom: 19,
      }).addTo(map);
      instanceRef.current = map;
    };
    loadLeaflet().catch(() => {});
    return () => {
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, []);

  useEffect(() => {
    const map = instanceRef.current;
    if (!map || !window.L) return;
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const coordinateCounts = new Map();

    projects.forEach(project => {
      if (!hasValidCoordinates(project)) return;
      const key = `${Number(project.latitude).toFixed(6)},${Number(project.longitude).toFixed(6)}`;
      const duplicateIndex = coordinateCounts.get(key) ?? 0;
      coordinateCounts.set(key, duplicateIndex + 1);

      const coords = getCoordinates(project, duplicateIndex);
      const id = project.project_id ?? project.id;
      const rawRisk = Number(project.risk_score ?? project.riskScore ?? 0);
      let risk = rawRisk <= 1 ? rawRisk * 100 : rawRisk;
      const isSelected = id === selectedProjectId;
      if (isSelected && Number.isFinite(Number(selectedRisk))) risk = Number(selectedRisk);
      const category = risk >= 70 ? 'High' : risk >= 40 ? 'Medium' : 'Low';
      const color = riskColor(risk);

      const marker = window.L.circleMarker(coords, {
        radius: isSelected ? 10 : 7, color, fillColor: color, fillOpacity: 0.8, weight: 2,
      }).addTo(map);

      const source = project.geo_source ?? 'dataset coordinate';
      const offsetNote = duplicateIndex > 0
        ? '<br/><span style="font-size:11px">Visual offset applied because multiple projects share the same source coordinate.</span>'
        : '';
      const simulationNote = isSelected && Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk))
        ? `<br/>Baseline: ${Number(baselineRisk).toFixed(1)}/100<br/><strong>What-If: ${Number(selectedRisk).toFixed(1)}/100</strong>`
        : '';

      marker.bindPopup(
        `<strong>${id ?? 'Project'}</strong>` +
        `<br/>${project.district ?? ''}, ${project.state ?? ''}` +
        `<br/>Risk: ${risk.toFixed(1)}/100 (${category})` +
        `<br/>Stage: ${project.acquisition_stage ?? '—'}` +
        `<br/>Lat: ${Number(project.latitude).toFixed(6)} | Lng: ${Number(project.longitude).toFixed(6)}` +
        `<br/>Source: ${source}${offsetNote}${simulationNote}`
      );
      marker.on('click', () => onSelectProject?.(id));
      markersRef.current.push(marker);
    });

    const selected = projects.find(project => (project.project_id ?? project.id) === selectedProjectId);
    if (selected && hasValidCoordinates(selected)) {
      const [lat, lng] = getCoordinates(selected, 0);
      map.setView([lat, lng], Math.max(map.getZoom(), 9));
    }
  }, [projects, selectedProjectId, selectedRisk, baselineRisk, onSelectProject]);

  const hasSimulation = Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk));

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-blue-600" />Project GIS Map</div>
          <p className="mt-0.5 text-[11px] text-slate-500">OpenStreetMap • project coordinates from the dataset</p>
        </div>
        {hasSimulation && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">What-If active</span>}
      </div>
      <div ref={mapRef} className="h-[460px] w-full" />
    </section>
  );
}
