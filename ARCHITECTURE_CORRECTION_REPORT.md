# Architecture correction — 26 October 2026

Architecture PASS SOURCE. One HTML/CSS/vanilla JS website, one Node static build, one dist, one Render Static Site configuration, seven populated routes. No React/SPA/dependency migration.

| Route | Output |
| --- | --- |
| / | index.html |
| /desktop | desktop/index.html |
| /app-trainer | app-trainer/index.html |
| /app-client | app-client/index.html |
| /download | download/index.html |
| /privacy | privacy/index.html |
| /support | support/index.html |

Central registry and shared head/header/footer: scripts/site-layout.mjs. Assembly: scripts/site-pages.mjs. Native document navigation is intentional: existing stack was not an SPA. All pages share one host/server/build. Ten old addresses remain compatibility aliases to relevant routes, not separate websites. Existing source documents retained, original media untouched.

Hero preserved; Trainer screen/story/controller preserved, only route CTA added. Home no longer embeds complete Desktop chapters, installer form or legal documents. Eight existing Desktop chapters/legacy topics reused on /desktop. Client detail is honest preparatory structure. Privacy/Support are complete approved drafts with original IDs and noindex; official domain and legal approval remain missing.

Architecture checkpoint: 41 Node source/controller/media/regression tests PASS, validator PASS (7 pages + 10 aliases), build44 files. Real local HTTP direct bare/slash/index routes + legacy routes + asset ranges/private404 PASS. Browser directly opened all seven routes, correct H1/main/header/footer and product nav. Responsive28combinations (seven routes ×375/768/1024/1440) no overflow/visible broken images. Direct refresh and native Back tested. Phase2 adds Home assets/tests and its own report. No production validation claimed.

Render prep uses one build and directory pages. Explicit slash redirects only; no /* → /index.html SPA fallback. See https://render.com/docs/redirects-rewrites (official docs checked). Deployment remains NOT RUN.

Skills: Impeccable layout/craft-floor — ACCEPTED: reading order, grouping, preserve incumbent, accessible static fallbacks. Sites local-only workflow — ACCEPTED: one checkout/output/server, no registration/deployment. UI/UX Pro Max and interface-design NOT FOUND in installed/workspace roots, not claimed used. Read-only reviewer WEBSITE-ROUTE-REVIEW-20261026 ACCEPTED; no files changed by reviewer. No active locks.

Files: index.html; scripts/site-layout.mjs (new); scripts/site-pages.mjs; public-files resolver; validator; route/legal/Trainer/HTTP tests; desktop.css; render.yaml; AGENTS/PRODUCT/surface brief/handoffs. Previous single-index report is historical and superseded.

Next authorized task (new user prompt): Home Block 2 — Desktop scroll storytelling, then remaining Phase2 blocks in order. No commit/push/deploy/database actions.
