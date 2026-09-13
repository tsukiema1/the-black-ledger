# Architecture

The Black Ledger separates reasoning from authority.

```text
market evidence
      |
      v
   Oracle  ->  proposal + sources
      |
      v
   Scribe  ->  thesis + invalidation + memory
      |
      v
   Warden  ->  deterministic policy checks
      |
      +------ failed ------> Black Ledger: BLOCKED
      |
      +------ passed ------> Human seal: AWAITING_HUMAN
```

## Trust boundary

Language-model output is treated as untrusted input. Policy evaluation lives in regular code and returns explicit results. The current project ends at human review and contains no order placement function.

## Adapter contract

A future read-only data adapter may prepare this input:

```json
{
  "symbol": "NVDA",
  "proposedOrderUsd": 480,
  "currentPositionUsd": 0,
  "portfolioValueUsd": 24820.16,
  "currentSectorUsd": 4410,
  "dailyLossPct": 0.8,
  "humanApproved": false
}
```

Any future broker adapter must remain outside the reasoning process and fail closed when configuration, policy, or approval is missing.
