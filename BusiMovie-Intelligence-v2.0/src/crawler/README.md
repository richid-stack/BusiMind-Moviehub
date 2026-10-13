# BusiMovie Intelligence V1.8 — Crawler Intelligence
Adds bot capability profiles, observation-driven updates, surface classification, safe action planning, navigation-loop detection, and per-mission budgets.

Strict routing:
- Movies: `@Apple_moviebot` → `@iPapkornDeltaBot` → `@iPapkornEzPzBot`
- Series: `@quinsonnbot` only
Capability scores never override media-type routing. Filenames and UI labels are evidence, not identity. Identity verification must precede ingestion.

This checkpoint provides the adapter contract and crawler logic, not a verified live Telegram crawler. Real Telegram button behavior still requires integration tests.