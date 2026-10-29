# GymManager — Home Experience Phase 2

Date: 2026-10-27. Authoritative checkout: `projects/Sito_Web_GymManager`.

PHASE: Home real UI implementation

STATUS: PASS LOCAL — source, controller tests and observed local browser behaviour. Not a production, Safari/device, WCAG or performance certification.

No commit, push, tag, deploy, application-source change or database action performed. The final documentation checkpoint was completed after an account-usage-limit interruption; the implementation was not restarted.

## Hero

HERO: PRESERVED.

WHY: approved composition, message, buttons and actual product image retained. Source comparison confirms the Hero is unchanged except for the Download link pointing to the dedicated route. No new visual identity.

## Desktop story

DESKTOP STORY: PASS LOCAL.

DESKTOP SCREENS USED: Dashboard → Clienti → Schede allenamento → Alimentazione → Progressi → Agenda personale. All six are real product screenshots; no fabricated interface.

DESKTOP SCROLL: normal vertical page scrolling drives a horizontal track toward the left. A cached-geometry controller updates transforms through one requestAnimationFrame per scroll burst. No wheel interception, scroll-lock, timer, autoplay or motion dependency. Small optional step controls are keyboard accessible and do not replace scrolling. Counter, short copy and Approfondisci Desktop link accompany the screen.

Sticky enhancement requires sufficient width, height and measured space. Narrow/short screens, reduced motion and image failure fall back to the complete sequential story. Without JavaScript, the default layout remains sequential.

Independent finish review found one P2: at laptop height, the outer frame was much wider than the constrained image. Fixed only the Home frame width using each real screenshot aspect ratio; no cropping, larger sticky height or Hero/Trainer change. Recaptured evidence:

- 1366×768 Agenda: frame ≈635px, raster ≈618px, combined inset ≈18px; sticky bottom ≈745px, inside viewport.
- 1440×900 Workout: frame ≈896px, raster ≈878px, combined inset ≈18px; sticky bottom ≈811px, inside viewport.

Reviewer reopened the corrected captures: P2 RESOLVED, ship disposition for this narrow fix. Codex ACCEPTED after source/geometry and viewport review.

## Trainer and Client

TRAINER BLOCK: PRESERVED. Existing DOM/controller, five real screens and approved phone scroll interaction remain intact; only the route CTA was added. Source comparison confirms preservation. Shared navbar current-route state is no longer altered by the legacy section-observer attributes.

CLIENT BLOCK: coherent preparatory composition using the actual original FitManager Client AppIcon. The phone explicitly states that the screen is in preparation. This is identity artwork, NOT a product screenshot or public app-release promise. No complete real Client screenshots were found. CTA opens /app-client.

## Ecosystem and close

ECOSYSTEM: PASS LOCAL.

WORKFLOW IMPLEMENTED: create client → collect questionnaire → create/assign programme → follow client → monitor progress. Four scroll-story steps explain Desktop preparation/assignment, Trainer consultation in mobility, the connected Client's own published content, and the final connected-role view.

The moving “Scheda assegnata” token represents a real programme, not decorative particles. Read-only inspection of the existing Client repository informed the copy: client/trainer ownership, active/published contents and applicable dates matter. The animation does NOT claim literal phone-to-phone forwarding or immediate synchronisation of every data type. No backend changes or production queries were needed.

FINAL CTA: PASS LOCAL. Scarica GymManager opens /download; only the common footer follows. Privacy and Supporto remain footer links, not primary product navigation.

ROUTES: PASS LOCAL. One website, one static build, seven real pages: /, /desktop, /app-trainer, /app-client, /download, /privacy, /support. Shared layout/navigation; ten legacy compatibility aliases. Dedicated detailed content and legal pages are not embedded in Home. No detailed-page redesign in this phase.

## Responsive, motion and accessibility

DESKTOP RESPONSIVE: PASS for observed 1024×900, 1366×768 and 1440×900 local viewports. Desktop and ecosystem fit their sticky region; endpoint and reverse scrolling were checked.

TABLET RESPONSIVE: PASS for observed 768×1024. All story steps are sequential and available.

MOBILE RESPONSIVE: PASS for observed 375×812. No forced wide track, clipped content or inactive-slide inert state in the sequential fallback.

The architecture review additionally opened all seven routes at widths 375/768/1024/1440: 28 route-width combinations without horizontal overflow or visibly broken images. These are observations, not 28 independent functional tests.

REDUCED MOTION: PASS SOURCE/CONTROLLER. Preference switches off the large scroll-linked movement and restores sequential content. OS-level reduced-motion browser run: NOT RUN. JavaScript-disabled browser run: NOT RUN; default no-JS structure is covered by source tests.

Keyboard checks: Enter opens the active Desktop image dialog; Escape closes it and restores focus. Mobile menu, route navigation, direct refresh and native Back checked. Focus, native button/link semantics, alt text, 44px step targets and motion-independent content reviewed at source. Real VoiceOver: NOT RUN. No WCAG certification claimed.

## Performance and media

PERFORMANCE RISKS: no new framework, package or motion library. Passive scroll listeners; cached geometry and resize configuration; transforms instead of per-pixel layout calculations; image prefetch near entry; will-change scoped to visible enhanced stories. Large-scale frame timing and GPU behaviour remain device-dependent.

- Six Home Desktop WebPs: 308,496 bytes total.
- Five Trainer WebPs: 135,362 bytes total, 400×816, recording timestamps 1/36/44/52/75 seconds.
- Four browser JavaScript files: 21,885 bytes total at this checkpoint.
- Client icon derivative: 256×256 WebP, 8,160 bytes, matched to original AppIcon and provenance sidecar.
- Agenda: actual supplied 1416×881 image, lossless WebP, 67,340 bytes. Decoded RGB MD5 matches original: `281725bbc5a1b9afde479d1ec3172590`.

User-modified original video preserved: 13,004,770 bytes; SHA256 `C82A059B28CB2FEACE44B5ED0CD7416255C08D3F1E83AD84FCF866D7B6253896`. Source uploads, historical videos, manifests/sidecars and QA are not served in public dist. Real demo screens inspected; no new customer data introduced.

Lighthouse, real FPS/GPU profiling, physical iPhone/iPad and Safari: NOT RUN. Wide IAB captures soften fine text; viewport geometry/source media and the original assets are the evidence, not fine-detail certification from a compressed preview. A full-page sticky/lazy capture contained offscreen/spacer artefacts and was excluded from visual review, retained under ignored .qa for traceability.

## Skills and independent reviews

UI/UX Pro Max: NOT FOUND in the inspected installed/workspace skill roots; not claimed used. interface-design: NOT FOUND; not claimed used or installed.

| Skill used | Principle / finding | Application and Codex decision |
| --- | --- | --- |
| Impeccable — layout, craft floor, new-work / persuade | Preserve approved incumbent authority; product-first reading order; screenshots dominate short copy; one story rather than unrelated cards. | ACCEPTED: six-block Home; Hero/Trainer preserved; detail content stays on dedicated routes. No identity tournament or redesign. |
| Impeccable — animate | Motion must explain a state/story; progressive enhancement, native scroll and reduced-motion alternatives. | ACCEPTED: tiny shared Desktop/ecosystem controller; no wheel hijack or autoplay; complete vertical fallback. |
| Impeccable — finish | Independent review must produce an actual disposition, not an unchecked “looks good”. | ACCEPTED: one P2 frame-width finding fixed and recaptured; second reviewer verdict accepted at that scope. |
| Impeccable — document comparison | Do not silently replace an existing normative design document. | MODIFIED to read-only comparison: DESIGN.md/design.json remain the prior snapshot. Their old crossfade/two-column Desktop, static ecosystem and pending Agenda descriptions are documented drift; current surface brief records Phase2 accurately. No normative palette/token replacement. |
| Sites — presentation-led and local preview | Use existing project/stack, inspect rendered media and keep local implementation separate from publishing. | ACCEPTED: one allowlisted dist/server, actual viewport captures, no Sites registration/hosting/deployment or new project. |

Delegations were read-only. Route review ACCEPTED; finish review ACCEPTED after P2 correction. Design-comparison attempt 1 ended at the usage limit after usable partial findings; a smaller retry returned the final comparison on 2026-10-27, ACCEPTED after Codex inspection. No agent edited files. Earlier Antigravity provider/auth failures remain failures; these reviews were Codex agents, not a successful Gemini run. Audit records are in the master .orchestrator/delegations directory.

## Files

FILES MODIFIED / maintained through architecture + Home integration:

- index.html — approved opening/Trainer retained, current Home composition and dedicated-route CTAs.
- scripts/site-pages.mjs, scripts/public-files.mjs, scripts/prepare-public.mjs, scripts/serve-site.mjs, scripts/validate-site.mjs — one static output, central layout integration and safe public routing.
- scripts/site.test.mjs, scripts/legal.test.mjs, scripts/desktop-showcase.test.mjs, scripts/trainer-showcase.test.mjs, scripts/test-http.mjs — current architecture/content/behaviour regression checks.
- assets/css/styles.css, assets/css/desktop.css — shared route state and scoped layout consistency; no blanket visual reset.
- render.yaml — one Static Site preparation, explicit directory redirects, no SPA catch-all; not deployed.
- AGENTS.md, README.md, PRODUCT.md, .impeccable/surfaces/index-html.md and historical-report status note — actual scope/commands/current direction.
- Master and local CODEX_HANDOFF.md — final continuity, previous history retained.

FILES CREATED in architecture / Phase2, including files already present as untracked work at this checkpoint:

- scripts/site-layout.mjs — central route registry and shared head/header/footer.
- scripts/home-render.mjs — Home Desktop/Client/ecosystem renderers using existing product data.
- assets/js/home-story.js and assets/css/home-story.css — scoped scroll storytelling and fallbacks.
- scripts/home-story.test.mjs — deterministic source/controller/media/interaction tests.
- assets/brand/client-logo.webp and provenance sidecar — derivative of existing real AppIcon only.
- ARCHITECTURE_CORRECTION_REPORT.md and this report; ignored local viewport evidence.

Existing dirty work from prior website tasks remains intact, including older Desktop/Trainer media, renderers and the user-modified video. Deleted legacy favicon/video-test files in the cumulative Git diff belong to earlier work; no additional cleanup performed now. DESIGN.md and .impeccable/design.json deliberately not overwritten.

## Tests

TESTS PASSED:

- 48/48 Node source/controller/media/regression tests, rerun 2026-10-27. Command: `node --test scripts/site.test.mjs scripts/legal.test.mjs scripts/trainer-showcase.test.mjs scripts/desktop-showcase.test.mjs scripts/home-story.test.mjs`.
- Validator: seven real routes + ten aliases.
- Build: 47 allowlisted public files.
- Real local HTTP: direct bare/slash/index URLs and refreshable route documents; aliases; WebP content types; HEAD; valid/invalid byte ranges; private/unknown 404; unsupported method 405. Rerun 2026-10-27.
- 20 JavaScript syntax checks and git diff whitespace PASS. Final 46 changed/new text files: zero high-confidence credential-pattern or personal-machine-path flags; bounded scan, not a comprehensive security certification. Protected video size/SHA unchanged.
- Local browser: widths above, active slides/endpoints/reverse scroll, menu/current-route state, route refresh/Back, image zoom and keyboard focus return. Real API version resolution observed; no installer downloaded or release published.

Counts are not added together as functional test totals. Automated tests do not prove a real device flow.

TESTS PENDING: physical Safari/iPhone/iPad; VoiceOver; OS-level reduced-motion and JS-disabled browser acceptance; Lighthouse/FPS profiling; public hosting/direct-production routes and actual installer download.

## Known issues, Git and next step

KNOWN ISSUES: real Client screenshots missing (honest placeholder is intentional); no approved official HTTPS domain/hosting destination; Privacy/Support remain DRAFT/noindex and their App Store URL blockers remain OPEN. Historical DESIGN snapshot drift is explicitly recorded, not silently corrected. No remaining source blocker identified for this Home phase.

DATABASE / MIGRATIONS: NONE.

GIT: main; origin https://github.com/Pauz121/Sito_Web_GymManager.git; HEAD c7aa6cc4467d2020849427fdc2a6388a90ed6ab5. Staged files NONE; cumulative dirty website work preserved. No commit, push, tag or deployment. Render configuration is preparation only.

NEXT EXACT STEP: user reviews/approves Home. Develop /desktop detailed product page only after that approval. /app-trainer, /app-client and /download detailed-page redesigns remain parked; do not start automatically.
