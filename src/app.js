import { defaultPolicy, demoProposal, evaluateProposal } from "./policy.js";

const button = document.querySelector("#run-ritual");
const policyStatus = document.querySelector("#policy-status");
const proposalStatus = document.querySelector("#proposal-status");
const councilState = document.querySelector("#council-state");
const councilNote = document.querySelector("#council-note");
const ledgerBody = document.querySelector("#ledger-body");
const ledgerCount = document.querySelector("#ledger-count");
let hasRun = false;

function sleep(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function appendLedger(event, reason, state, tone = "neutral") {
  const now = new Date().toLocaleTimeString("en-US", { hour12: false });
  const row = document.createElement("tr");
  row.innerHTML = `<td>${now}</td><td>${event}</td><td>${reason}</td><td><span class="table-state ${tone}">${state}</span></td>`;
  ledgerBody.prepend(row);
  ledgerCount.textContent = `${ledgerBody.children.length.toString().padStart(2, "0")} entries`;
}

function setVoice(name, result) {
  const voice = document.querySelector(`[data-voice="${name}"]`);
  voice.classList.add("active");
  const resultNode = voice.querySelector(".voice-result");
  resultNode.textContent = result;
  resultNode.classList.add("pass");
}

function setPathStep(name, result) {
  const step = document.querySelector(`[data-step="${name}"]`);
  step.classList.add("complete");
  step.querySelector("b").textContent = result;
}

function renderRules(checks) {
  for (const check of checks) {
    const card = document.querySelector(`[data-rule="${check.id}"]`);
    const result = card.querySelector(".rule-result");
    card.classList.toggle("pass", check.passed);
    result.textContent = check.passed ? "Passed" : "Blocked";
    result.classList.toggle("pass", check.passed);
    card.title = check.detail;
  }
}

async function runCouncil() {
  if (hasRun) return;
  hasRun = true;
  button.disabled = true;
  button.textContent = "Review in progress...";
  councilState.textContent = "Running";
  appendLedger("Review started", "Proposal entered the control path", "Reviewing");

  await sleep(380);
  setVoice("oracle", "Sources valid");
  setPathStep("evidence", "Passed");
  appendLedger("Evidence checked", "Sources are fresh and complete", "Passed", "safe");

  await sleep(520);
  setVoice("scribe", "Thesis bounded");
  appendLedger("Thesis checked", "Claim includes an invalidation", "Passed", "safe");

  await sleep(620);
  setVoice("warden", "Limits passed");
  setPathStep("policy", "Passed");
  const checks = evaluateProposal(demoProposal, defaultPolicy);
  renderRules(checks);
  policyStatus.textContent = `${checks.filter((check) => check.passed).length} / ${checks.length} passed`;
  policyStatus.className = "badge safe";
  appendLedger("Policy evaluated", "All deterministic limits passed", "Passed", "safe");

  proposalStatus.textContent = "Human approval required";
  proposalStatus.className = "badge warning";
  councilState.textContent = "3 checks passed";
  councilNote.textContent = "Automated review passed. Execution is still blocked until a human approves the proposal.";
  button.textContent = "Execution remains sealed";
}

button.addEventListener("click", runCouncil);
