export const money = (n) => `$${Math.round(Number(n) || 0).toLocaleString()}`;

export function findAnchor(originCluster, destCluster, anchors) {
  const exact = anchors.find(a => a.originCluster === originCluster && a.destCluster === destCluster);
  if (exact) return { ...exact, source: "Exact cluster anchor", directionModifier: 0 };

  const reverse = anchors.find(a => a.originCluster === destCluster && a.destCluster === originCluster);
  if (reverse) {
    return {
      ...reverse,
      originCluster,
      destCluster,
      lane: `${originCluster} → ${destCluster}`,
      carrierPay: Math.max(350, reverse.carrierPay - 100),
      confidence: Math.max(42, reverse.confidence - 14),
      source: "Reverse cluster inference",
      directionModifier: -100,
      note: `Reverse-inferred from ${destCluster} → ${originCluster}`
    };
  }

  return {
    id: "FALLBACK",
    originCluster,
    destCluster,
    lane: `${originCluster} → ${destCluster}`,
    carrierPay: 1100,
    miles: 1500,
    confidence: 45,
    source: "Fallback estimate",
    directionModifier: 0,
    note: "No exact anchor found"
  };
}

export function enclosedAddOn(miles, burden, rules) {
  const enclosedRules = rules?.enclosedRules || [];
  const distanceRule = enclosedRules.find(r => r.maxMiles && miles <= r.maxMiles);
  let base = distanceRule?.baseAdd ?? 550;
  enclosedRules.filter(r => r.burdenOver && burden > r.burdenOver).forEach(r => { base += r.baseAdd; });
  return Math.round(base);
}

export function inopAddOn(baseCarrier, vehicleAdj, burden, rules) {
  const rule = rules?.conditionRules?.find(r => r.id === "INOP_STD");
  const percent = burden > 2.3 ? (rule?.percentHeavy ?? 0.14) : (rule?.percentSedan ?? 0.09);
  return Math.max(rule?.minimum ?? 125, Math.round((baseCarrier + vehicleAdj) * percent));
}

export function marginFor(carrierPay, confidence, risk, rules) {
  const marginRules = rules?.marginRules || [];
  const baseRule = marginRules.find(r => r.minCarrier !== undefined && carrierPay >= r.minCarrier && carrierPay <= r.maxCarrier);
  let margin = baseRule?.margin ?? 250;
  if (confidence < 55) margin += marginRules.find(r => r.id === "LOW_CONF")?.marginAdd ?? 75;
  if (risk >= 2) margin += marginRules.find(r => r.id === "HIGH_RISK")?.marginAdd ?? 100;
  return margin;
}

export function buildPipeline(calc) {
  return [
    { step: "Input Route", value: `${calc.origin.name} → ${calc.dest.name}`, impact: "Cluster mapping", status: "input", detail: `${calc.origin.id || ""} → ${calc.dest.id || ""}` },
    { step: "Anchor Lane Selected", value: money(calc.baseCarrier), impact: calc.anchor.source, status: calc.anchor.source === "Exact cluster anchor" ? "good" : "review", detail: calc.anchor.note },
    { step: "Direction Modifier", value: money(calc.anchor.directionModifier || 0), impact: calc.anchor.source === "Reverse cluster inference" ? "Reverse lane inferred" : "Exact direction", status: calc.anchor.source === "Reverse cluster inference" ? "review" : "good", detail: "Directionality is part of the anchor behavior" },
    { step: "Cluster Friction", value: money(calc.clusterFriction), impact: calc.clusterFriction ? "Access burden added" : "Main-market route", status: calc.clusterFriction >= 150 ? "review" : "good", detail: `${calc.origin.name}: ${money(calc.origin.friction)} + ${calc.dest.name}: ${money(calc.dest.friction)}` },
    { step: "Vehicle Burden", value: money(calc.vehicleAdj), impact: calc.tier.label, status: calc.tier.burden > 3 ? "review" : "good", detail: calc.tier.note },
    { step: "Transport Type", value: money(calc.enclosedAdj), impact: calc.enclosedAdj ? "Enclosed add-on applied" : "Open transport", status: calc.enclosedAdj ? "review" : "good", detail: "Enclosed uses additive scarcity logic" },
    { step: "Condition", value: money(calc.inopAdj), impact: calc.inopAdj ? "Non-running add-on applied" : "Running vehicle", status: calc.inopAdj ? "review" : "good", detail: "Inop pricing scales by burden" },
    { step: "Market Override", value: money(calc.overrideAdj), impact: calc.override ? calc.override.reason : "No active override", status: calc.override ? "review" : "good", detail: calc.override ? `Expires ${calc.override.expires}` : "No temporary market pressure" },
    { step: "Estimated Carrier Pay", value: money(calc.carrierPay), impact: "Carrier-facing target", status: "output", detail: "Primary Smart Rate carrier-pay output" },
    { step: "Margin Logic", value: money(calc.margin), impact: `Risk ${calc.risk}, confidence ${calc.confidence}%`, status: "output", detail: "Margin changes with risk and confidence" },
    { step: "Final Customer Price", value: money(calc.customerPrice), impact: "Employee popup output", status: "output", detail: "Suggested quote price" }
  ];
}

export function calculateSmartRate({ originCluster, destCluster, vehicleTierId, transport, running, anchors, clusters, vehicleTiers, overrides, rules }) {
  const anchor = findAnchor(originCluster, destCluster, anchors);
  const origin = clusters.find(c => c.id === originCluster) || clusters[0];
  const dest = clusters.find(c => c.id === destCluster) || clusters[0];
  const tier = vehicleTiers.find(t => t.id === vehicleTierId) || vehicleTiers[0];
  const override = overrides.find(o => o.originCluster === originCluster && o.destCluster === destCluster);

  const baseCarrier = anchor.carrierPay;
  const clusterFriction = (origin?.friction || 0) + (dest?.friction || 0);
  const overrideAdj = override?.amount || 0;
  const vehicleAdj = tier.adjustment || 0;
  const enclosedAdj = transport === "enclosed" ? enclosedAddOn(anchor.miles || 1500, tier.burden || 1, rules) : 0;
  const inopAdj = running === "inop" ? inopAddOn(baseCarrier, vehicleAdj, tier.burden || 1, rules) : 0;

  const carrierPay = Math.max(250, baseCarrier + clusterFriction + overrideAdj + vehicleAdj + enclosedAdj + inopAdj);
  const risk = (clusterFriction >= 150 ? 1 : 0) + (transport === "enclosed" ? 1 : 0) + (running === "inop" ? 1 : 0) + ((tier.burden || 1) > 3.2 ? 1 : 0);
  const confidence = Math.max(22, Math.min(96, anchor.confidence - (clusterFriction >= 150 ? 6 : 0) - (transport === "enclosed" ? 7 : 0) - (running === "inop" ? 8 : 0) - ((tier.burden || 1) > 3 ? 8 : 0)));
  const margin = marginFor(carrierPay, confidence, risk, rules);
  const customerPrice = carrierPay + margin;

  const warnings = [];
  if (anchor.source !== "Exact cluster anchor") warnings.push("No exact anchor. Estimate is inferred.");
  if (clusterFriction >= 150) warnings.push("Outer/hard cluster friction applied.");
  if (confidence < 55) warnings.push("Low confidence. Manual review recommended.");
  if (override) warnings.push(`Active override: ${override.reason}`);

  const calc = {
    anchor, origin, dest, tier, override, baseCarrier, clusterFriction, overrideAdj, vehicleAdj,
    enclosedAdj, inopAdj, carrierPay, margin, customerPrice, confidence, risk, warnings
  };
  calc.pipeline = buildPipeline(calc);
  return calc;
}
