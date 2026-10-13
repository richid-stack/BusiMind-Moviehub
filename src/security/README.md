# BusiMovie Intelligence V1.9 — Production hardening

Adds runtime input validation, safe structured logging, redaction of session/credential material, rate-limiting primitives, typed error categories, health checks, safer environment handling, operational guidance, and security-focused tests.

## Security baseline
- Never commit `.env`, Telegram session files, API keys, or logs with message payloads.
- Use a dedicated Telegram account and store its session outside the repository with restrictive filesystem permissions.
- Keep PostgreSQL and Redis private; do not expose them publicly.
- Use least-privilege database credentials, rotate secrets after accidental exposure, and back up PostgreSQL.
- Do not log full Telegram message bodies, callback payloads, phone numbers, or session strings.
- Rate limits are in-process and per key; production multi-instance enforcement should use Redis.
- Before production: run `npm ci`, `npm run typecheck`, `npm test`, `npm audit`, then integration tests against a disposable PostgreSQL/Redis stack and a Telegram test session.

This is hardening scaffolding, not a security certification. Live integration, dependency audit, and tests are not claimed as passing here.
