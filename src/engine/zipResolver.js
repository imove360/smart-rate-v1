export function resolveZip(zip, zipMap, prefixRules, clusters) {
  const clean = String(zip || "").trim().slice(0, 5);
  if (!/^\d{5}$/.test(clean)) {
    return { ok: false, zip: clean, error: "Enter a 5-digit ZIP code." };
  }

  const exact = zipMap.find(z => z.zip === clean);
  if (exact) {
    const cluster = clusters.find(c => c.id === exact.cluster);
    return {
      ok: true,
      zip: clean,
      city: exact.city,
      state: exact.state,
      cluster,
      confidence: exact.confidence,
      method: "Exact ZIP mapping",
      source: "zipMap.json"
    };
  }

  const prefix = clean.slice(0, 3);
  const rule = prefixRules.find(r => r.prefix === prefix);
  if (rule) {
    const cluster = clusters.find(c => c.id === rule.cluster);
    return {
      ok: true,
      zip: clean,
      city: "Unknown city",
      state: rule.state,
      cluster,
      confidence: rule.confidence,
      method: "ZIP prefix fallback",
      source: "zipPrefixRules.json"
    };
  }

  return {
    ok: true,
    zip: clean,
    city: "Unknown city",
    state: "Unknown",
    cluster: clusters.find(c => c.id === "MOUNTAIN_HARD") || clusters[0],
    confidence: 35,
    method: "National fallback",
    source: "fallback",
    warning: "ZIP not mapped yet. Production version should use full USPS ZIP table."
  };
}
