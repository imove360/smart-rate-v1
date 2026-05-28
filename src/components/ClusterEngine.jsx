import React, { useMemo, useState } from 'react';
import clusters from '../data/clusters.json';
import { calculateRouteTopology } from '../engine/clusterEngine';

const dollars = n => `$${Number(n || 0).toLocaleString()}`;

export default function ClusterEngine() {
  const [originZip, setOriginZip] = useState('92704');
  const [destZip, setDestZip] = useState('75220');

  const result = useMemo(() => calculateRouteTopology(originZip, destZip), [originZip, destZip]);

  return (
    <div className="grid2">
      <section className="card">
        <h2>ZIP Cluster Engine</h2>
        <p className="muted">This is the real foundation. Every ZIP resolves into a freight cluster, and every cluster carries friction, confidence, anchor, and topology behavior.</p>

        <label><span>Origin ZIP</span><input value={originZip} onChange={e => setOriginZip(e.target.value.replace(/[^0-9]/g, '').slice(0,5))} /></label>
        <label><span>Destination ZIP</span><input value={destZip} onChange={e => setDestZip(e.target.value.replace(/[^0-9]/g, '').slice(0,5))} /></label>

        <div className="quickButtons">
          <button onClick={() => {setOriginZip('92704'); setDestZip('75220')}}>Santa Ana → Dallas</button>
          <button onClick={() => {setOriginZip('95501'); setDestZip('75220')}}>Eureka → Dallas</button>
          <button onClick={() => {setOriginZip('11954'); setDestZip('75220')}}>Montauk → Dallas</button>
          <button onClick={() => {setOriginZip('49855'); setDestZip('75220')}}>Marquette → Dallas</button>
          <button onClick={() => {setOriginZip('33040'); setDestZip('75220')}}>Key West → Dallas</button>
        </div>
      </section>

      <section>
        {result.ok ? (
          <>
            <section className="card">
              <div className="between">
                <h2>{result.route}</h2>
                <span className={`pill ${result.riskTier}`}>{result.riskTier.toUpperCase()}</span>
              </div>
              <div className="metricGrid">
                <Metric label="Total Friction" value={dollars(result.totalFriction)} />
                <Metric label="Resolver Confidence" value={`${result.resolverConfidence}%`} />
                <Metric label="Origin Anchor" value={result.origin.cluster.anchor} />
                <Metric label="Destination Anchor" value={result.destination.cluster.anchor} />
              </div>
              <div className="tags">
                {result.topologyTags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
              </div>
              {result.origin.warning && <div className="warning">{result.origin.warning}</div>}
              {result.destination.warning && <div className="warning">{result.destination.warning}</div>}
            </section>

            <section className="card">
              <h2>Resolved Endpoints</h2>
              <Endpoint title="Origin" item={result.origin} />
              <Endpoint title="Destination" item={result.destination} />
            </section>
          </>
        ) : (
          <section className="card"><div className="warning">Enter valid ZIP codes.</div></section>
        )}
      </section>

      <section className="card wide">
        <h2>Cluster Dictionary</h2>
        <p className="muted">This is the first standardized V1 cluster schema. It is intentionally editable and explainable.</p>
        <div className="tableWrap">
          <table>
            <thead><tr><th>Cluster</th><th>Tier</th><th>Friction</th><th>Confidence</th><th>Anchor</th><th>Examples</th><th>Topology</th></tr></thead>
            <tbody>{clusters.map(c => (
              <tr key={c.id}>
                <td><strong>{c.id}</strong><br/><span className="muted">{c.label}</span></td>
                <td><span className={`pill ${c.tier}`}>{c.tier}</span></td>
                <td><strong>{dollars(c.friction)}</strong></td>
                <td>{c.confidenceBase}%</td>
                <td>{c.anchor}</td>
                <td>{c.examples.join(', ')}</td>
                <td>{c.topology.join(', ')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return <div className="metric"><div className="muted">{label}</div><strong>{value}</strong></div>
}

function Endpoint({ title, item }) {
  return (
    <div className="endpoint">
      <h3>{title}</h3>
      <div className="row"><strong>ZIP</strong><span>{item.zip}</span></div>
      <div className="row"><strong>Location</strong><span>{item.city}, {item.state}</span></div>
      <div className="row"><strong>Cluster</strong><span>{item.cluster.id}</span></div>
      <div className="row"><strong>Method</strong><span>{item.method}</span></div>
      <div className="row"><strong>Friction</strong><span>${item.cluster.friction}</span></div>
      <p className="muted">{item.cluster.notes}</p>
    </div>
  );
}
