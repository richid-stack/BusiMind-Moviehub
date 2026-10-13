# BusiMovie Intelligence V2.0

One consolidated workspace for the BusiMovie Intelligence milestone codebase.

## Modules
- `src/core/` — acquisition and canonical identity foundations (V1.5)
- `src/vault/` — media vault, ingestion and deduplication (V1.6)
- `src/jobs/` — durable jobs, events and recovery foundations (V1.7)
- `src/crawler/` — crawler intelligence and bot capability learning (V1.8)
- `src/security/` — validation, redaction, logging, rate limiting and health (V1.9)
- `src/index.ts` — namespace-based consolidated entry point
- `history/archives/` — milestone ZIP snapshots V1.0–V1.9

## Routing invariants
- Movies: `@Apple_moviebot` → `@iPapkornDeltaBot` → `@iPapkornEzPzBot`
- Series: `@quinsonnbot` only
- Movie and series routes remain separate.
- Filenames and labels are clues, not proof of canonical identity.
- Never invent episodes or mark acquisition complete without verified evidence.

## Setup
Requires Node.js and npm:
```bash
npm install
npm run check
```
Review module `.env.example` files. Keep Telegram sessions, API keys and credentials out of source control.

## Verification
This archive consolidates the milestone snapshots into one workspace. It has not been verified against live Telegram bots, PostgreSQL or Redis during archive creation. Run the build and tests in a configured environment before deployment.
