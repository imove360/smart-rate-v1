import clusters from '../data/clusters.json';
import zipClusterMap from '../data/zipClusterMap.json';
import zipPrefixRules from '../data/zipPrefixRules.json';

export function getClusterById(id) {
  return clusters.find(c => c.id === id) || null;
}

export function resolveZipToCluster(zipInput) {
  const zip = String(zipInput || '').replace(/[^0-9]/g, '').slice(0, 5);

  if (zip.length !== 5) {
    return {
      ok: false,
      zip,
      error: 'Enter a valid 5-digit ZIP code.'
    };
  }

  const exact = zipClusterMap.find(z => z.zip === zip);
  if (exact) {
    const cluster = getClusterById(exact.clusterId);
    return {
      ok: true,
      zip,
      city: exact.city,
      state: exact.state,
      cluster,
      method: 'Exact ZIP mapping',
      resolverConfidence: cluster?.confidenceBase || 80
    };
  }

  const prefix = zip.slice(0, 3);
  const rule = zipPrefixRules.find(r => r.prefix === prefix);
  if (rule) {
    const cluster = getClusterById(rule.clusterId);
    return {
      ok: true,
      zip,
      city: 'Unknown city',
      state: 'Unknown',
      cluster,
      method: 'ZIP prefix fallback',
      resolverConfidence: rule.confidence
    };
  }

  return {
    ok: true,
    zip,
    city: 'Unknown city',
    state: 'Unknown',
    cluster: getClusterById('MOUNTAIN_REMOTE'),
    method: 'National fallback',
    resolverConfidence: 35,
    warning: 'ZIP is not mapped yet. Production should use full ZIP database with fallback topology rules.'
  };
}

export function calculateRouteTopology(originZip, destinationZip) {
  const origin = resolveZipToCluster(originZip);
  const destination = resolveZipToCluster(destinationZip);

  if (!origin.ok || !destination.ok) {
    return { ok: false, origin, destination };
  }

  const totalFriction = (origin.cluster?.friction || 0) + (destination.cluster?.friction || 0);
  const resolverConfidence = Math.min(origin.resolverConfidence || 0, destination.resolverConfidence || 0);

  const tags = [
    ...(origin.cluster?.topology || []),
    ...(destination.cluster?.topology || [])
  ];

  const uniqueTags = [...new Set(tags)];

  let riskTier = 'normal';
  if (totalFriction >= 500) riskTier = 'extreme';
  else if (totalFriction >= 300) riskTier = 'hard';
  else if (totalFriction >= 150) riskTier = 'outer';
  else if (totalFriction >= 75) riskTier = 'secondary';

  return {
    ok: true,
    origin,
    destination,
    route: `${origin.cluster?.id} → ${destination.cluster?.id}`,
    totalFriction,
    resolverConfidence,
    riskTier,
    topologyTags: uniqueTags
  };
}
