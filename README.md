# The Black Ledger

> Let the oracle find the signal. Let the warden decide if it survives.

**The Black Ledger** is a dark-fantasy visual safety console for agentic trading workflows. It is a simulation-first reference interface, not a broker integration and not investment advice.

![An original pixel-art citadel created for The Black Ledger](./assets/black-ledger-citadel.png)

## Why it exists

Agentic trading is becoming easy to connect and difficult to trust. A useful system needs more than a model that can suggest an order. It needs an inspectable trail from evidence to thesis to policy checks to a human decision.

The Black Ledger makes that trail visible:

- **The Oracle** collects a signal and its evidence packet.
- **The Scribe** records the thesis, invalidation, and context.
- **The Warden** applies deterministic risk rules that prose cannot bypass.
- **The Black Ledger** records proposals, approvals, rejections, and blocks.

## Safety posture

This repository deliberately ships without credentials, broker calls, order APIs, or live execution. The UI cannot place an order. The policy engine defaults to a human seal requirement.

The included policy checks are intentionally small and legible:

1. Per-order dollar cap.
2. Position concentration cap.
3. Sector concentration cap.
4. Daily-loss halt.
5. Symbol allowlist.
6. Explicit human approval.

## Run locally

No dependencies are required.

```bash
npm test
python -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Project structure

```text
index.html                  Interface shell
styles.css                  Dark-fantasy visual system
assets/                     Original project art
src/policy.js               Deterministic policy engine
src/policy.test.js          Safety behavior tests
src/app.js                  Demo interaction and ledger events
prompts/runtime.md          Agent role and output contract
policies/default.json       Human-readable guardrail policy
docs/architecture.md        Trust boundaries and extension path
```

The repository stays deliberately thin. Like [Godogen](https://github.com/htdt/godogen), it treats runtime guidance and proof from a working result as first-class parts of the project.

## Product direction

The public demo is intentionally simulation-only. A future integration should preserve the same boundary:

1. An external adapter prepares a proposal.
2. The policy engine evaluates it independently.
3. A human reviews and seals it.
4. A broker adapter may receive a request only after all checks pass.

Never use this project as a recommendation to buy or sell a security. All investing involves risk, including loss of principal.

## License

[MIT](./LICENSE)
