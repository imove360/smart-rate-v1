import React, { useMemo, useState } from 'react';
import anchors from '../data/anchors.json';
import clusters from '../data/clusters.json';
import vehicleTiers from '../data/vehicleTiers.json';
import overrides from '../data/overrides.json';
import rules from '../data/rules.json';
import { calculateSmartRate, money } from '../engine/pricingEngine';

export default function PricingEngine() {
  const [originCluster, setOriginCluster] = useState('SOCAL_MAIN');
  const [destCluster, setDestCluster] = useState('TX_TRIANGLE');
  const [vehicleTierId, setVehicleTierId] = useState('P2');
  const [transport, setTransport] = useState('open');
  const [running, setRunning] = useState('running');

  const calc = useMemo(() => calculateSmartRate({
    originCluster, destCluster, vehicleTierId, transport, running, anchors, clusters, vehicleTiers, overrides, rules
  }), [originCluster, destCluster, vehicleTierId, transport, running]);

  return (
    <div className="grid2">
      <section className="card">
        <h2>Admin Test Output</h2>
        <p className="muted">This panel produces the output that will feed the employee Smart Rate popup.</p>
        <div className="formGrid">
          <Field label="Origin Cluster"><select value={originCluster} onChange={e => setOriginCluster(e.target.value)}>{clusters.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Destination Cluster"><select value={destCluster} onChange={e => setDestCluster(e.target.value)}>{clusters.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Vehicle Tier"><select value={vehicleTierId} onChange={e => setVehicleTierId(e.target.value)}>{vehicleTiers.map(v => <option value={v.id} key={v.id}>{v.id} — {v.label}</option>)}</select></Field>
          <Field label="Transport"><select value={transport} onChange={e => setTransport(e.target.value)}><option value="open">Open</option><option value="enclosed">Enclosed</option></select></Field>
          <Field label="Running?"><select value={running} onChange={e => setRunning(e.target.value)}><option value="running">Running</option><option value="inop">Non-running</option></select></Field>
        </div>
      </section>
      <section>
        <div className="resultGrid">
          <div className="resultCard"><div className="label">Estimated Carrier Pay</div><div className="price">{money(calc.carrierPay)}</div></div>
          <div className="resultCard main"><div className="label">Suggested Customer Price</div><div className="price">{money(calc.customerPrice)}</div></div>
        </div>
        <Pipeline calc={calc} />
      </section>
    </div>
  );
}

export function Pipeline({ calc }) {
  return <div className="card"><div className="between"><h2>Visual Pricing Pipeline</h2><span className={calc.confidence >= 75 ? 'pill green' : calc.confidence >= 55 ? 'pill orange' : 'pill red'}>{calc.confidence}% Confidence</span></div>
    <p className="muted">{calc.anchor.source}: {calc.anchor.note}</p>
    <div className="pipeline">{calc.pipeline.map((p, i) => <div className={`pipelineStep ${p.status}`} key={p.step}><div className="stepNo">{i + 1}</div><div className="stepBody"><div className="between"><strong>{p.step}</strong><span className="stepValue">{p.value}</span></div><div className="muted">{p.impact}</div><div className="detail">{p.detail}</div></div></div>)}</div>
    {calc.warnings.length > 0 && <div className="warnings">{calc.warnings.map((w, i) => <div key={i} className="warning">{w}</div>)}</div>}
  </div>
}

function Field({ label, children }) { return <label><span>{label}</span>{children}</label>; }
