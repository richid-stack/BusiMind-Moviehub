# BusiMovie Intelligence V1.6 — Vault + Ingestion

V1.6 extends V1.5 with explicit asset lifecycle states, strict vault partitioning, idempotent asset registration, and a PostgreSQL-backed repository.

## Safety rules
- Only `VERIFIED` assets can be ingested.
- Movies route to `MOVIE_VAULT`; series and episode assets route to `SERIES_VAULT`.
- Missing episode numbers remain unknown; the system never invents `S01E01`.
- Telegram chat/message identity is used for source idempotency. A second message with the same canonical work is not automatically a duplicate; distinct releases may be valid assets.
- A database transaction enforces uniqueness on source chat/message identity.

## Run
`npm install`, `npm run typecheck`, `npm test`.
Set `DATABASE_URL` for PostgreSQL use and apply `database/001_vault.sql`.

This milestone includes a PostgreSQL repository implementation, but live DB and Telegram integration still require configuration and execution against your real environment. No test pass is claimed by packaging alone.
