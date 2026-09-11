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
  const text = `${project.state ?? ''}:${project.district ?? ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  const offsetLat = ((hash % 80) - 40) / 100;
  const offsetLng = ((((hash / 80) | 0) % 80) - 40) / 100;
  return [center[0] + offsetLat, center[1] + offsetLng];
}

export function GISMap({ projects = [], selectedProjectId, onSelectProject }) {
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
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = instanceRef.current;
    if (!map || !window.L) return;
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    projects.forEach(project => {
      const [lat, lng] = syntheticCoordinates(project);
      const rawRisk = Number(project.risk_score ?? project.riskScore ?? 0);
      const risk = rawRisk <= 1 ? rawRisk * 100 : rawRisk;
      const category = risk >= 70 ? 'High' : risk >= 40 ? 'Medium' : 'Low';
      const color = category === 'High' ? '#dc2626' : category === 'Medium' ? '#d97706' : '#059669';
      const id = project.project_id ?? project.id;
      const marker = window.L.circleMarker([lat, lng], {
        radius: id === selectedProjectId ? 10 : 7, color, fillColor: color, fillOpacity: 0.8, weight: 2,
      }).addTo(map);
      marker.bindPopup(`<strong>${id ?? 'Project'}</strong><br/>${project.district ?? ''}, ${project.state ?? ''}<br/>Risk: ${risk.toFixed(1)}/100 (${category})<br/>Stage: ${project.acquisition_stage ?? '—'}`);
      marker.on('click', () => onSelectProject?.(id));
      markersRef.current.push(marker);
    });

    const selected = projects.find(project => (project.project_id ?? project.id) === selectedProjectId);
    if (selected) {
      const [lat, lng] = syntheticCoordinates(selected);
      map.setView([lat, lng], Math.max(map.getZoom(), 9));
    }
  }, [projects, selectedProjectId, onSelectProject]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-blue-600" />Project GIS Map</div>
          <p className="mt-0.5 text-[11px] text-slate-500">OpenStreetMap • coordinates are synthetic/demo until official GIS data is available</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{projects.length} projects</span>
      </div>
      <div ref={mapRef} className="h-[460px] w-full" />
    </section>
  );
}
