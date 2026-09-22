import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('public/gis-demo.csv');
const text = fs.readFileSync(file, 'utf8').trim();
const lines = text.split(/\r?\n/);
if (lines.length < 2) process.exit(0);

const headers = lines[0].split(',');
const latIndex = headers.indexOf('latitude');
const lngIndex = headers.indexOf('longitude');
const sourceIndex = headers.indexOf('geo_source');
const typeIndex = headers.indexOf('location_type');

if ([latIndex, lngIndex, sourceIndex, typeIndex].some(i => i < 0)) {
  throw new Error('gis-demo.csv is missing expected GIS columns');
}

const rows = lines.slice(1).map(line => line.split(','));

for (const row of rows) {
  const lat = Number(row[latIndex]);
  const lng = Number(row[lngIndex]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    row[latIndex] = '';
    row[lngIndex] = '';
    row[sourceIndex] = 'unmapped';
    row[typeIndex] = 'unmapped';
  }
}

fs.writeFileSync(file, `${headers.join(',')}\n${rows.map(row => row.join(',')).join('\n')}\n`);
console.log(`Validated ${rows.length} GIS rows without manufacturing coordinate offsets.`);
