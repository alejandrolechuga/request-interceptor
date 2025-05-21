#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

function loadSummary(file: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json');
const baselinePath = path.join(__dirname, '../coverage-baseline.json');

const current = loadSummary(coveragePath);
if (!current) {
  console.error(`No coverage summary found at ${coveragePath}`);
  process.exit(1);
}

const baseline = loadSummary(baselinePath);
if (!baseline) {
  fs.writeFileSync(baselinePath, JSON.stringify(current, null, 2));
  console.log(`Baseline coverage stored at ${baselinePath}`);
  process.exit(0);
}

const metrics = Object.keys(current.total);
let drop = false;

let report = 'Coverage changes:\n';
metrics.forEach((metric) => {
  const basePct = baseline.total[metric].pct;
  const currPct = current.total[metric].pct;
  const diff = currPct - basePct;
  const sign = diff >= 0 ? '+' : '';
  report += `${metric}: ${basePct}% -> ${currPct}% (${sign}${diff.toFixed(2)}%)\n`;
  if (diff < 0) drop = true;
});

if (drop) {
  report += 'Coverage dropped in this change.\n';
}

console.log(report);
