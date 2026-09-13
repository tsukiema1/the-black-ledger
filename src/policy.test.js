import test from "node:test";
import assert from "node:assert/strict";
import { canCreateOrder, defaultPolicy, demoProposal, evaluateProposal } from "./policy.js";

test("the demo proposal passes all pre-approval policy checks", () => {
  const checks = evaluateProposal(demoProposal, defaultPolicy);
  assert.equal(checks.length, 6);
  assert.ok(checks.every((check) => check.passed));
});

test("the order cap blocks an oversized order", () => {
  const checks = evaluateProposal({ ...demoProposal, proposedOrderUsd: 501 });
  assert.equal(checks.find((check) => check.id === "orderCap").passed, false);
});

test("a live order is impossible without an explicit human seal", () => {
  assert.equal(canCreateOrder(demoProposal), false);
  assert.equal(canCreateOrder({ ...demoProposal, humanApproved: true }), true);
});
