import React from 'react';
import vehicleTiers from '../data/vehicleTiers.json';
import rules from '../data/rules.json';
import { money } from '../engine/pricingEngine';
export default function AdminSettings() {
  return <div className="settingsStack">
    <section className="card"><h2>Vehicle Settings</h2><Table headers={['Tier','Class','Burden','Adjustment','Model','Note']} rows={vehicleTiers.map(v => [v.id, v.label, v.burden, money(v.adjustment), v.model, v.note])} /></section>
    <section className="card"><h2>Running / Non-Running Rules</h2><Table headers={['ID','Name','Mode','Minimum','Confidence Hit','Note']} rows={rules.conditionRules.map(r => [r.id, r.name, r.mode, money(r.minimum), r.confidenceHit, r.note])} /></section>
    <section className="card"><h2>Open / Enclosed Rules</h2><Table headers={['ID','Name','Miles / Burden','Add-On','Note']} rows={rules.enclosedRules.map(r => [r.id, r.name, r.maxMiles ? `≤ ${r.maxMiles} miles` : `Burden > ${r.burdenOver}`, money(r.baseAdd), r.note])} /></section>
    <section className="card"><h2>Margin Rules</h2><Table headers={['ID','Carrier Range / Trigger','Margin / Add-On']} rows={rules.marginRules.map(r => [r.id, r.trigger || `${money(r.minCarrier)} - ${money(r.maxCarrier)}`, money(r.margin ?? r.marginAdd)])} /></section>
    <section className="card"><h2>Confidence Rules</h2><Table headers={['ID','Name','Confidence Hit']} rows={rules.confidenceRules.map(r => [r.id, r.name, r.confidenceHit])} /></section>
    <section className="card"><h2>Outlier Rules</h2><Table headers={['ID','Name','Action','Weight','Note']} rows={rules.outlierRules.map(r => [r.id, r.name, r.action, r.weight, r.note])} /></section>
  </div>;
}
function Table({ headers, rows }) { return <div className="tableWrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>; }
