import React from 'react';
import clusters from '../data/clusters.json';
import { money } from '../engine/pricingEngine';

export default function FreightClusters() {
  return <section className="card"><h2>Freight Clusters</h2><p className="muted">ZIP/city clustering concept. Main clusters inherit anchor pricing, outer/hard clusters add friction.</p><div className="tableWrap"><table><thead><tr><th>Cluster</th><th>Examples</th><th>Access</th><th>Friction</th><th>Parent</th><th>Note</th></tr></thead><tbody>{clusters.map(c => <tr key={c.id}><td><strong>{c.id}</strong><br/><span className="muted">{c.name}</span></td><td>{c.examples}</td><td><span className={c.accessTier === 'main' ? 'pill green' : c.accessTier === 'outer' ? 'pill orange' : 'pill red'}>{c.accessTier}</span></td><td><strong>{money(c.friction)}</strong></td><td>{c.parent}</td><td>{c.note}</td></tr>)}</tbody></table></div></section>;
}
