import React, { useMemo, useState } from 'react';
import clusters from '../data/clusters.json';
import zipMap from '../data/zipMap.json';
import prefixRules from '../data/zipPrefixRules.json';
import { resolveZip } from '../engine/zipResolver';
import { money } from '../engine/pricingEngine';

export default function ZipResolver() {
  const [pickupZip, setPickupZip] = useState('92704');
  const [deliveryZip, setDeliveryZip] = useState('75220');

  const pickup = useMemo(() => resolveZip(pickupZip, zipMap, prefixRules, clusters), [pickupZip]);
  const delivery = useMemo(() => resolveZip(deliveryZip, zipMap, prefixRules, clusters), [deliveryZip]);

  return (
    <div className="grid2">
      <section className="card">
        <h2>ZIP → Freight Cluster Resolver</h2>
        <p className="muted">Every US ZIP should eventually resolve to a freight cluster. V1 uses exact ZIP mappings, prefix fallback, then national fallback.</p>

        <div className="formGrid">
          <label><span>Pickup ZIP</span><input value={pickupZip} onChange={e => setPickupZip(e.target.value.replace(/[^0-9]/g,'').slice(0,5))} /></label>
          <label><span>Delivery ZIP</span><input value={deliveryZip} onChange={e => setDeliveryZip(e.target.value.replace(/[^0-9]/g,'').slice(0,5))} /></label>
        </div>

        <div className="zipExamples">
          <button onClick={() => {setPickupZip('92704'); setDeliveryZip('75220')}}>Santa Ana → Dallas</button>
          <button onClick={() => {setPickupZip('92563'); setDeliveryZip('77041')}}>Murrieta → Houston</button>
          <button onClick={() => {setPickupZip('93101'); setDeliveryZip('78744')}}>Santa Barbara → Austin</button>
          <button onClick={() => {setPickupZip('92262'); setDeliveryZip('33166')}}>Palm Springs → Miami</button>
          <button onClick={() => {setPickupZip('92314'); setDeliveryZip('79901')}}>Big Bear → El Paso</button>
        </div>
      </section>

      <section>
        <ResolverCard title="Pickup" result={pickup} />
        <ResolverCard title="Delivery" result={delivery} />

        {pickup.ok && delivery.ok && (
          <section className="card">
            <h2>Resolved Cluster Route</h2>
            <div className="routeBig">{pickup.cluster.id} → {delivery.cluster.id}</div>
            <div className="breakdown">
              <div className="row"><strong>Pickup friction</strong><span>{money(pickup.cluster.friction)}</span></div>
              <div className="row"><strong>Delivery friction</strong><span>{money(delivery.cluster.friction)}</span></div>
              <div className="row"><strong>Total cluster friction</strong><span>{money(pickup.cluster.friction + delivery.cluster.friction)}</span></div>
              <div className="row"><strong>Resolver confidence</strong><span>{Math.min(pickup.confidence, delivery.confidence)}%</span></div>
            </div>
            <p className="muted">Production goal: load every US ZIP into zipMap with cluster, access tier, confidence, and parent anchor.</p>
          </section>
        )}
      </section>
    </div>
  );
}

function ResolverCard({ title, result }) {
  if (!result.ok) return <section className="card"><h2>{title}</h2><div className="warning">{result.error}</div></section>;
  return (
    <section className="card">
      <div className="between"><h2>{title}</h2><span className={result.confidence >= 85 ? 'pill green' : result.confidence >= 70 ? 'pill orange' : 'pill red'}>{result.confidence}%</span></div>
      <div className="routeBig">{result.zip} → {result.cluster?.id}</div>
      <p className="muted">{result.city}, {result.state} • {result.method} • {result.source}</p>
      <div className="breakdown">
        <div className="row"><strong>Cluster</strong><span>{result.cluster?.name}</span></div>
        <div className="row"><strong>Access tier</strong><span>{result.cluster?.accessTier}</span></div>
        <div className="row"><strong>Friction</strong><span>{money(result.cluster?.friction)}</span></div>
        <div className="row"><strong>Parent anchor</strong><span>{result.cluster?.parent}</span></div>
      </div>
      {result.warning && <div className="warning">{result.warning}</div>}
    </section>
  );
}
