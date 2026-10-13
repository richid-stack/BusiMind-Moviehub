# BusiMovie Intelligence V1.7 — Durable jobs, events, recovery

V1.7 adds PostgreSQL-backed acquisition jobs and append-only event history, Redis distributed locks, retry scheduling, stale-lease recovery, and Docker Compose infrastructure.

## Start services
1. Copy `.env.example` to `.env` and change local credentials.
2. Run `docker compose up -d`.
3. Apply SQL migrations from `database/` (Compose initializes them on a fresh volume).

## Guarantees and boundaries
- PostgreSQL is the durable source of truth; Redis locks are coordination aids, not the database.
- Job claiming uses `FOR UPDATE SKIP LOCKED`.
- Idempotency keys prevent duplicate job creation for the same submitted request key.
- Workers lease jobs; expired RUNNING leases can be reclaimed.
- Retries are bounded by `max_attempts`.
- Events are append-only through the repository API.
- Live Telegram processing and real DB/Redis execution require credentials/configuration and integration testing. Packaging is not a test-pass claim.
