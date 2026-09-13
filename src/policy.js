export const defaultPolicy = Object.freeze({
  maxOrderUsd: 500,
  maxPositionPct: 10,
  maxSectorPct: 25,
  maxDailyLossPct: 2,
  allowedSymbols: ["NVDA", "MSFT", "AAPL", "AMD", "GOOGL"],
  requireHumanApproval: true,
});

export const demoProposal = Object.freeze({
  symbol: "NVDA",
  proposedOrderUsd: 480,
  currentPositionUsd: 0,
  portfolioValueUsd: 24820.16,
  currentSectorUsd: 4410,
  dailyLossPct: 0.8,
  humanApproved: false,
});

function result(id, title, passed, detail) {
  return { id, title, passed, detail };
}

export function evaluateProposal(proposal, policy = defaultPolicy) {
  const newPositionPct = ((proposal.currentPositionUsd + proposal.proposedOrderUsd) / proposal.portfolioValueUsd) * 100;
  const newSectorPct = ((proposal.currentSectorUsd + proposal.proposedOrderUsd) / proposal.portfolioValueUsd) * 100;

  return [
    result("orderCap", "Order cap", proposal.proposedOrderUsd <= policy.maxOrderUsd, `$${proposal.proposedOrderUsd.toFixed(2)} of $${policy.maxOrderUsd.toFixed(2)} cap`),
    result("positionCap", "Position cap", newPositionPct <= policy.maxPositionPct, `${newPositionPct.toFixed(2)}% of ${policy.maxPositionPct}% cap`),
    result("sectorCap", "Sector cap", newSectorPct <= policy.maxSectorPct, `${newSectorPct.toFixed(2)}% of ${policy.maxSectorPct}% cap`),
    result("dailyLoss", "Daily loss oath", proposal.dailyLossPct < policy.maxDailyLossPct, `${proposal.dailyLossPct.toFixed(2)}% loss vs ${policy.maxDailyLossPct}% halt`),
    result("allowlist", "Allowed symbols", policy.allowedSymbols.includes(proposal.symbol), `${proposal.symbol} is in the vetted list`),
    result("humanApproval", "Human seal", policy.requireHumanApproval, policy.requireHumanApproval ? "A human seal is required before execution" : "Human seal not required"),
  ];
}

export function canCreateOrder(proposal, policy = defaultPolicy) {
  const checks = evaluateProposal(proposal, policy);
  return checks.every((check) => check.passed) && (!policy.requireHumanApproval || proposal.humanApproved === true);
}
