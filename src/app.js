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
  button.textContent = "Council is speaking...";
  councilState.textContent = "In session";
  appendLedger("Council summoned", "The proposal entered review", "Reviewing");

  await sleep(380);
  setVoice("oracle", "Signal found");
  appendLedger("Oracle reviewed", "Evidence is fresh and complete", "Passed", "safe");

  await sleep(520);
  setVoice("scribe", "Memory sealed");
  appendLedger("Scribe reviewed", "Thesis includes an invalidation", "Passed", "safe");

  await sleep(620);
  setVoice("warden", "Rules passed");
  const checks = evaluateProposal(demoProposal, defaultPolicy);
  renderRules(checks);
  policyStatus.textContent = `${checks.filter((check) => check.passed).length} / ${checks.length} passed`;
  policyStatus.className = "badge safe";
  appendLedger("Warden evaluated", "All deterministic policies passed", "Passed", "safe");

  proposalStatus.textContent = "Human seal required";
  proposalStatus.className = "badge amber";
  councilState.textContent = "Unanimous";
  councilNote.textContent = "The council permits a human review. The demo remains sealed: no broker is connected and no order can be sent.";
  button.textContent = "The realm remains sealed";
}

button.addEventListener("click", runCouncil);
