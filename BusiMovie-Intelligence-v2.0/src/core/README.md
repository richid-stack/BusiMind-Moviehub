# BusiMovie Intelligence V1.5 — Acquisition Integration

Connects typed requests, canonical identity verification, media-specific bot policy, candidate validation, asset fingerprinting, vault ingestion, and mission event tracing.

Movie order: `@Apple_moviebot` → `@iPapkornDeltaBot` → `@iPapkornEzPzBot`
Series only: `@quinsonnbot`

A Telegram result is evidence, not truth. The candidate must pass identity verification before vault ingestion.

Run: `npm install`, `npm run typecheck`, `npm test`, `npm run dev`.

The included gateway is a deterministic mock. The live Telegram adapter remains an integration seam; this ZIP does not claim a tested live Telegram session.
