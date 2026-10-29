# GymManager Website policy

This project inherits the AGENT-IA master policy when checked out in its workspace. Codex owns integration, security, tests, Git and final acceptance.

## Scope
Public Italian product website: ONE project, build, route tree and deployment; six public pages /, /desktop, /app-trainer, /download, /privacy, /support. Client presentation retained in source behind siteFeatures.clientMarketing=false; /app-client returns404 until approved re-enable. HTML/CSS/vanilla JS with Node build-time generation; no framework migration or runtime backend. No app-source changes. No pricing, tracking, ecommerce, fabricated media or product claims.

## Source and build
scripts/site-layout.mjs owns the central route registry and shared header/footer/head. scripts/site-pages.mjs assembles real route documents from existing content. Source legacy HTML is retained as content input/history, not a separately deployed site. Only allowlisted dist is public. Build: node scripts/validate-site.mjs && node scripts/prepare-public.mjs. Preview: node scripts/serve-site.mjs --public (one server, always serves dist). Test: node --test scripts/site.test.mjs scripts/legal.test.mjs scripts/trainer-showcase.test.mjs scripts/desktop-showcase.test.mjs scripts/home-story.test.mjs; node scripts/test-http.mjs with preview active. Stable directory routes are normalized to trailing slash; no SPA catch-all. Keep real Hero and existing Trainer scroll component intact. User now authorizes Phase2 Home experience, not a redesign of detailed routes. Home is preview/story only. Native scroll, reduced-motion/mobile/no-JS fallbacks; no wheel hijack/dependencies. Preserve source media and protected user video.

## Protected content
Never commit .env*, credentials, tokens, original uploads/recordings, QA captures, machine state, logs, build output or local CODEX_HANDOFF.md. Public GitHub release endpoint/repository is browser configuration, not authentication. Never add a GitHub token to frontend JavaScript.

## UX and privacy
Preserve the established warm neutral/charcoal/red identity, responsive layouts, accessible native controls, keyboard focus, text alternatives and reduced motion. Real media only; review privacy before publication. Owner authorized normal public Privacy/Support presentation on2026-10-29; no draft badges. Preserve approved contacts and explicit gaps in legal information without fabricating legal bases, retention or guarantees. Existing HTTPS Workers destination is verified; no invented custom domain or claim of AppStore/legal acceptance.

## Hosting and boundaries
Existing production destination: Cloudflare Worker gym-manager, GitHub Pauz121/Sito_Web_GymManager branch main; npx wrangler deploy invokes wrangler.jsonc build and publishes onlydist. render.yaml is historical preparation, not active hosting. Follow current official docs. No database, Supabase, application release or App Store action in website work. No destructive Git, force push or history rewrite. Commit/push/deploy need explicit user authority; task2026-10-29 explicitly authorizes website main commit/push and automatic existingCloudflarepublication only.

## Delegation and continuity
Codex defines narrow advisory/implementation scope and reviews every result; no delegated Git/deploy/secret operations. Gemini analysis is optional if unavailable; record actual failures, never pretend success. Update ignored local CODEX_HANDOFF.md after meaningful phases, preserving previous task state and explicit database NONE.
