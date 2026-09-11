import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const STATE_CENTERS = {
  'Uttar Pradesh': [26.85, 80.95], 'Maharashtra': [19.75, 75.7], 'Karnataka': [15.3, 75.7],
  'Tamil Nadu': [11.0, 78.3], 'Gujarat': [22.3, 71.8], 'Rajasthan': [27.0, 74.2],
  'Madhya Pradesh': [23.5, 78.0], 'Bihar': [25.8, 85.3], 'Odisha': [20.2, 84.4],
  'West Bengal': [23.0, 87.8],
};

function fallbackCoordinates(project) {
  const center = STATE_CENTERS[project.state] || [22.5, 78.9];
  const text = `${project.state ?? ''}:${project.district ?? ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return [center[0] + ((hash % 80) - 40) / 100, center[1] + ((((hash / 80) | 0) % 80) - 40) / 100];
}

function hasValidCoordinates(project) {
  const lat = Number(project.latitude);
  const lng = Number(project.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function projectCoordinates(project, duplicateIndex = 0) {
  const [lat, lng] = hasValidCoordinates(project)
    ? [Number(project.latitude), Number(project.longitude)]
    : fallbackCoordinates(project);

  if (duplicateIndex === 0) return [lat, lng];

  // Small deterministic visual offset prevents exact duplicate coordinates from hiding each other.
  const angle = duplicateIndex * 2.399963229728653;
  const radius = 0.0035 * Math.sqrt(duplicateIndex);
  return [lat + Math.cos(angle) * radius, lng + Math.sin(angle) * radius];
}

function riskColor(risk) {
  return risk >= 70 ? '#dc2626' : risk >= 40 ? '#d97706' : '#059669';
}

function ensureClusterAssets() {
  const loadCss = (href, id) => new Promise((resolve) => {
    if (document.getElementById(id)) { resolve(); return; }
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve;
    document.head.appendChild(link);
  });

  const loadScript = (src, id) => new Promise((resolve, reject) => {
    if (window.L?.MarkerClusterGroup) { resolve(); return; }
    const existing = document.getElementById(id);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', () => reject(new Error('Leaflet MarkerCluster failed to load')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Leaflet MarkerCluster failed to load'));
    document.head.appendChild(script);
  });

  return Promise.all([
    loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css', 'leaflet-markercluster-css'),
    loadCss('https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css', 'leaflet-markercluster-default-css'),
    loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js', 'leaflet-markercluster-js'),
  ]);
}

export function GISMap({ projects = [], selectedProjectId, onSelectProject, selectedRisk, baselineRisk }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const clusterRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = async () => {
      if (!window.L) {
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

      if (cancelled || !mapRef.current || instanceRef.current) return;

      await ensureClusterAssets();
      if (cancelled || !mapRef.current || instanceRef.current) return;

      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([22.5, 78.9], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors', maxZoom: 19,
      }).addTo(map);
      instanceRef.current = map;
    };

    loadLeaflet().catch(() => {});

    return () => {
      cancelled = true;
      clusterRef.current = null;
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = instanceRef.current;
    const L = window.L;
    if (!map || !L) return;

    if (clusterRef.current) {
      clusterRef.current.clearLayers();
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }

    const markerLayer = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      maxClusterRadius: 55,
      disableClusteringAtZoom: 9,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
    });

    const coordinateCounts = new Map();
    const getCoordinateKey = (project) => hasValidCoordinates(project)
      ? `${Number(project.latitude).toFixed(6)},${Number(project.longitude).toFixed(6)}`
      : `fallback:${project.state ?? ''}:${project.district ?? ''}`;

    projects.forEach((project) => {
      const id = project.project_id ?? project.id;
      const key = getCoordinateKey(project);
      const duplicateIndex = coordinateCounts.get(key) ?? 0;
      coordinateCounts.set(key, duplicateIndex + 1);

      const [lat, lng] = projectCoordinates(project, duplicateIndex);
      const isSelected = id === selectedProjectId;
      const hasRisk = isSelected && Number.isFinite(Number(selectedRisk));
      const risk = hasRisk ? Number(selectedRisk) : null;
      const color = hasRisk ? riskColor(risk) : '#64748b';
      const source = hasValidCoordinates(project) ? (project.geo_source || 'Dataset coordinate') : 'Fallback district/state coordinate';
      const offsetNote = duplicateIndex > 0 ? '<br/><em>Visual offset applied for overlapping coordinates</em>' : '';
      const simulationNote = hasRisk && Number.isFinite(Number(baselineRisk))
        ? `<br/>Baseline: ${Number(baselineRisk).toFixed(1)}/100<br/><strong>What-If: ${risk.toFixed(1)}/100</strong>` : '';

      const marker = L.circleMarker([lat, lng], {
        radius: isSelected ? 10 : 7,
        color,
        fillColor: color,
        fillOpacity: 0.8,
        weight: 2,
      });

      marker.bindPopup(
        `<strong>${id ?? 'Project'}</strong>` +
        `<br/>${project.district ?? ''}, ${project.state ?? ''}` +
        (hasRisk ? `<br/>Risk: ${risk.toFixed(1)}/100` : '<br/>Risk: Select project to calculate') +
        `<br/>Stage: ${project.acquisition_stage ?? '—'}` +
        `<br/>Lat/Lng: ${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}` +
        `<br/>Source: ${source}${offsetNote}${simulationNote}`
      );
      marker.on('click', () => onSelectProject?.(id));
      markerLayer.addLayer(marker);
    });

    clusterRef.current = markerLayer;
    map.addLayer(markerLayer);

    const selected = projects.find(project => (project.project_id ?? project.id) === selectedProjectId);
    if (selected) {
      const [lat, lng] = projectCoordinates(selected, 0);
      map.setView([lat, lng], Math.max(map.getZoom(), 9));
    }

    return () => {
      markerLayer.clearLayers();
      if (map.hasLayer(markerLayer)) map.removeLayer(markerLayer);
      if (clusterRef.current === markerLayer) clusterRef.current = null;
    };
  }, [projects, selectedProjectId, selectedRisk, baselineRisk, onSelectProject]);

  const hasSimulation = Number.isFinite(Number(selectedRisk)) && Number.isFinite(Number(baselineRisk));

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-blue-600" />Project GIS Map</div>
          <p className="mt-0.5 text-[11px] text-slate-500">OpenStreetMap • dataset coordinates • clustered project view</p>
        </div>
        {hasSimulation && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">What-If active</span>}
      </div>
      <div ref={mapRef} className="h-[460px] w-full" />
    </section>
  );
}
