import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const STATE_CENTERS = {
  'Uttar Pradesh': [26.85, 80.95], 'Maharashtra': [19.75, 75.7], 'Karnataka': [15.3, 75.7],
  'Tamil Nadu': [11.0, 78.3], 'Gujarat': [22.3, 71.8], 'Rajasthan': [27.0, 74.2],
  'Madhya Pradesh': [23.5, 78.0], 'Bihar': [25.8, 85.3], 'Odisha': [20.2, 84.4],
  'West Bengal': [23.0, 87.8],
};

function syntheticCoordinates(project) {
  if (Number.isFinite(Number(project.latitude)) && Number.isFinite(Number(project.longitude))) {
    return [Number(project.latitude), Number(project.longitude)];
  }
  const center = STATE_CENTERS[project.state] || [22.5, 78.9];
  const text = `${project.project_id ?? project.id ?? ''}:${project.state ?? ''}:${project.district ?? ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return [center[0] + ((hash % 80) - 40) / 100, center[1] + ((((hash / 80) | 0) % 80) - 40) / 100];
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
      setTimeout(() => map.invalidateSize(), 100);
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

    projects.forEach(project => {
      const [lat, lng] = syntheticCoordinates(project);
      const id = project.project_id ?? project.id;
      const isSelected = id === selectedProjectId;
      const hasSelectedRisk = isSelected && Number.isFinite(Number(baselineRisk));
      const risk = hasSelectedRisk
        ? Number(selectedRisk ?? baselineRisk)
        : null;
      const color = hasSelectedRisk ? riskColor(risk) : '#64748b';

      const marker = window.L.circleMarker([lat, lng], {
        radius: isSelected ? 10 : 6,
        color,
        fillColor: color,
        fillOpacity: isSelected ? 0.9 : 0.55,
        weight: isSelected ? 3 : 1.5,
      }).addTo(map);

      const historicalStatus = project.is_delayed === 1 ? 'Historically delayed' : 'No historical delay flag';
      const simulationNote = isSelected && Number.isFinite(Number(selectedRisk))
        ? `<br/>Baseline: ${Number(baselineRisk).toFixed(1)}/100<br/><strong>What-If: ${Number(selectedRisk).toFixed(1)}/100</strong>`
        : '';
      const riskNote = hasSelectedRisk
        ? `Risk: ${risk.toFixed(1)}/100 (${risk >= 70 ? 'High' : risk >= 40 ? 'Medium' : 'Low'})`
        : 'Risk: select project to calculate';

      marker.bindPopup(
        `<strong>${id ?? 'Project'}</strong><br/>${project.district ?? ''}, ${project.state ?? ''}<br/>${riskNote}<br/>Stage: ${project.acquisition_stage ?? '—'}<br/>${historicalStatus}${simulationNote}`
      );
      marker.on('click', () => onSelectProject?.(id));
      markersRef.current.push(marker);
    });

    const selected = projects.find(project => (project.project_id ?? project.id) === selectedProjectId);
    if (selected) {
      const [lat, lng] = syntheticCoordinates(selected);
      map.setView([lat, lng], Math.max(map.getZoom(), 9));
    }
  }, [projects, selectedProjectId, selectedRisk, baselineRisk, onSelectProject]);

  const hasSimulation = Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk));

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-blue-600" />Project GIS Map</div>
          <p className="mt-0.5 text-[11px] text-slate-500">OpenStreetMap • synthetic/demo coordinates until official GIS data is available</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">● Unselected projects</span>
          {hasSimulation && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">What-If active</span>}
        </div>
      </div>
      <div ref={mapRef} className="h-[460px] w-full" />
    </section>
  );
}
