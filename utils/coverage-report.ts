import fs from 'fs';
import path from 'path';

function loadSummary(file: string) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as any;
  } catch (err) {
    return null;
  }
}

const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json');
const baselinePath = path.join(__dirname, '../coverage-baseline.json');

const current = loadSummary(coveragePath);
if (!current) {
  console.log(`No coverage summary found at ${coveragePath}`);
  process.exit(0);
}

const baseline = loadSummary(baselinePath);
if (!baseline) {
  fs.writeFileSync(baselinePath, JSON.stringify(current, null, 2));
  console.log(`Baseline coverage stored at ${baselinePath}`);
  process.exit(0);
}

const metrics = Object.keys(current.total);
let drop = false;

console.log('Coverage changes:');
for (const metric of metrics) {
  const basePct = baseline.total[metric].pct;
  const currPct = current.total[metric].pct;
  const diff = currPct - basePct;
  const sign = diff >= 0 ? '+' : '';
  console.log(
    `${metric}: ${basePct}% -> ${currPct}% (${sign}${diff.toFixed(2)}%)`
  );
  if (diff < 0) drop = true;
}

if (drop) {
  console.log('Coverage dropped in this change.');
}
