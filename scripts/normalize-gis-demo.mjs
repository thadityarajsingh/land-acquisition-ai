import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('public/gis-demo.csv');
const text = fs.readFileSync(file, 'utf8').trim();
const lines = text.split(/\r?\n/);
if (lines.length < 2) process.exit(0);

const headers = lines[0].split(',');
const latIndex = headers.indexOf('latitude');
const lngIndex = headers.indexOf('longitude');
const stateIndex = headers.indexOf('state');
const districtIndex = headers.indexOf('district');
const typeIndex = headers.indexOf('project_type');

if ([latIndex, lngIndex, stateIndex, districtIndex, typeIndex].some(i => i < 0)) {
  throw new Error('gis-demo.csv is missing expected GIS columns');
}

const rows = lines.slice(1).map(line => line.split(','));
const groups = new Map();

for (const row of rows) {
  const key = `${row[stateIndex]}|${row[districtIndex]}|${row[typeIndex]}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}

// The prototype GIS file intentionally contains three synthetic points around
// each district representative point. Those offsets can place coastal points
// in the sea. Collapse each synthetic triplet back to its representative
// centroid so the dashboard never renders obviously invalid ocean markers.
for (const group of groups.values()) {
  const coords = group
    .map(row => [Number(row[latIndex]), Number(row[lngIndex])])
    .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
  if (!coords.length) continue;

  const lat = coords.reduce((sum, pair) => sum + pair[0], 0) / coords.length;
  const lng = coords.reduce((sum, pair) => sum + pair[1], 0) / coords.length;

  for (const row of group) {
    row[latIndex] = lat.toFixed(6);
    row[lngIndex] = lng.toFixed(6);
  }
}

fs.writeFileSync(file, `${headers.join(',')}\n${rows.map(row => row.join(',')).join('\n')}\n`);
console.log(`Normalized ${rows.length} GIS rows across ${groups.size} representative locations.`);
