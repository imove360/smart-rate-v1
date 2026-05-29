import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const inputPath = path.resolve('src/data/uszips.csv');
const outputPath = path.resolve('src/data/zipDatabase.json');

const rows = [];

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (row) => {
    if (!row.zip || !row.city || !row.state_id) return;

    rows.push({
      zip: String(row.zip).padStart(5, '0'),
      city: row.city,
      state: row.state_id,
      stateName: row.state_name,
      lat: Number(row.lat),
      lng: Number(row.lng),
      county: row.county_name || '',
      timezone: row.timezone || '',
      population: row.population ? Number(row.population) : null,
      density: row.density ? Number(row.density) : null
    });
  })
  .on('end', () => {
    fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2));
    console.log(`Created ${outputPath}`);
    console.log(`ZIP records: ${rows.length}`);
  });
