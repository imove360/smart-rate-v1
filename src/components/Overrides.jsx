import React from 'react';
import overrides from '../data/overrides.json';
import { money } from '../engine/pricingEngine';
export default function Overrides() {
  return <section className="card"><h2>Market Overrides</h2><p className="muted">Temporary market-pressure adjustments. These should expire or decay in production.</p><div className="tableWrap"><table><thead><tr><th>ID</th><th>Lane</th><th>Scope</th><th>Adjustment</th><th>Expires</th><th>Reason</th></tr></thead><tbody>{overrides.map(o => <tr key={o.id}><td><strong>{o.id}</strong></td><td>{o.originCluster} → {o.destCluster}</td><td>{o.scope}</td><td><strong>{o.amount >= 0 ? '+' : ''}{money(o.amount)}</strong></td><td>{o.expires}</td><td>{o.reason}</td></tr>)}</tbody></table></div></section>;
}
