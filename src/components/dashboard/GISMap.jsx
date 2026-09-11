import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

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
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
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

    const validProjects = projects.filter(
      project => Number.isFinite(Number(project.latitude)) && Number.isFinite(Number(project.longitude))
    );

    validProjects.forEach(project => {
      const risk = Number(project.risk_score ?? project.riskScore ?? 0) * (Number(project.risk_score ?? project.riskScore ?? 0) <= 1 ? 100 : 1);
      const category = risk >= 70 ? 'High' : risk >= 40 ? 'Medium' : 'Low';
      const color = category === 'High' ? '#dc2626' : category === 'Medium' ? '#d97706' : '#059669';

      const marker = window.L.circleMarker(
        [Number(project.latitude), Number(project.longitude)],
        { radius: project.project_id === selectedProjectId ? 10 : 7, color, fillColor: color, fillOpacity: 0.8, weight: 2 }
      ).addTo(map);

      marker.bindPopup(`
        <strong>${project.project_id ?? project.id ?? 'Project'}</strong><br/>
        ${project.district ?? ''}, ${project.state ?? ''}<br/>
        Risk: ${risk.toFixed(1)}/100 (${category})<br/>
        Stage: ${project.acquisition_stage ?? '—'}
      `);

      marker.on('click', () => onSelectProject?.(project.project_id ?? project.id));
      markersRef.current.push(marker);
    });

    const selected = validProjects.find(project => (project.project_id ?? project.id) === selectedProjectId);
    if (selected) {
      map.setView([Number(selected.latitude), Number(selected.longitude)], Math.max(map.getZoom(), 10));
    }
  }, [projects, selectedProjectId, onSelectProject]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <MapPin className="h-4 w-4 text-blue-600" />
            Project GIS Map
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">OpenStreetMap base layer • synthetic project coordinates</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          {projects.filter(p => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude))).length} mapped
        </span>
      </div>
      <div ref={mapRef} className="h-[460px] w-full" />
    </section>
  );
}
