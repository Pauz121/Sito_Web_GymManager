# Mobile experience parity — 2026-10-29

Status: PASS — implementation, source tests and local Chromium responsive review. Physical device acceptance remains NOT RUN. Local only; NO COMMIT / PUSH / DEPLOY / DB. Baseline main473f8cf, index empty. Pre-existing modified user recording excluded/preserved byte-for-byte. Existing public deployment is not changed.

Publication follow-up: after this local implementation checkpoint, the user explicitly requested publication to inspect the site on a phone. Website-only commit/push and the existing Cloudflare automatic deployment are now authorized. The sections below retain the original local QA record; the actual remote outcome is recorded separately in CODEX_HANDOFF.md. No database/application changes are included.

## Macro1 — pre-edit parity-gap inventory

| Section | Desktop behaviour | Current mobile | Gap | Target / implementation | Risk |
|---|---|---|---|---|---|
| Hero | Approved title, CTA, authentic software screen | Stack below1024; CTA below480 | Smallest320 size/readability requires review | Preserve content/identity, inspect scale/spacing at320 | Accidental identity change avoided |
| Desktop story | Native vertical scroll→pinned horizontal six-screen track | Controller requires960×700; CSS turns it into six sequential screenshots | Main product interaction removed by width | Same controller with explicit mobile/tablet/desktop/landscape modes; compact stage/copy/progress, real-image focus plus full-screen detail | Sticky fit, legibility, focus in inactive slide |
| Trainer story | Phone swaps five real screens as copy passes reading line | Mobile sticky exists, but600pxheight disables it; stage can consume copy space | Small/landscape loses interaction; geometry repeatedly read after class writes | Keep same phone/source DOM, remove size-as-disable rule, compact height-aware stage; cache geometry on layout changes | Landscape clipping and stale geometry after prior story resize |
| Ecosystem | Three steps Desktop→Trainer→connected account, transfer token | Shared controller disabled; token hidden below960 | Continuity absent on mobile | Reuse normalized story engine; compact token/path and devices, same meaning/content | Too much chrome in small stage |
| Navbar | Native links/current route/menu | Opens/closes/Escape, no explicit pageshow reset or focus return | Back/keyboard state needs verification | Keep four links, native scrolling; pageshow reset, accessible close/focus,44px | Overlay obscures focus |
| CTA | Details and Download plus section-step controls | Major CTA present, story progress/controls hidden | Orientation/control gap | Preserve all CTA,44px step buttons, selected number/underline | Crowding at320 |
| Footer | Shared six routes/legal | Stacked | No structural gap identified | Verify wrapping/order/targets without redesign | No new product links |

Main safety constraint: do not confuse reduced-motion with a narrow viewport. Explicit reduced-motion/no-JS/media-failure remain readable sequential fallbacks. Measured oversized-content safety must be explained, not silently enabled by a generic mobile breakpoint.

## Skills read and decisions

Installed shared skills found under `../GymManager/.agents/skills/`; not installed/duplicated into this project.

| Skill | Principle | Mobile finding | Codex decision |
|---|---|---|---|
| UI/UX Pro Max | Visible focus around sticky elements; responsive hierarchy; normal touch scrolling | Pin/menu can hide focus; viewport-height guard conflates accessibility and device class | ACCEPTED: visible44px controls, measured stage fit, preserved native scroll. Local UX search `focus not obscured sticky` verified Web AA/AAA distinction; no certification claimed |
| interface-design | Read in full; explicitly excludes marketing/landing pages | This is a product website, not an application dashboard | MODIFIED: retain relevant native HTML/control consistency advice; REJECT product-app redesign workflow/new palette/components/dependencies |
| ux-heuristics | Consistency, status visibility, user control, no hover-only information | Narrow visitors lose the signature storytelling and progress controls | ACCEPTED: coherent story/progress, optional buttons, Back/Escape, no swipe requirement. Source heuristic starting score6/10 (consistency/status/readability gaps); not user-testing evidence |
| React best practices | Passive listeners, minimal bundle, batch DOM writes/reads | Vanilla JS already avoids React; repeated layout reads in Trainer can be improved | MODIFIED: apply framework-independent listener/geometry rules only; no React/Next/SWR/framework migration |
| Impeccable adapt/polish + craft floor | Adapt meaning rather than dimensions; preserve incumbent, test real sizes | Width-only fallback violates requested parity; historical DESIGN snapshot is not current layout truth | ACCEPTED: same colors/type/media/section logic; content-based compact stages and actual render checks. No historical design-system rewrite |
| Sites local-preview guidance | Existing project/build, allowlisteddist, real HTTP/rendered tests | Current source is framework-free Node generated pages | ACCEPTED: retain build/server/route registry; no registration/hosting operation |

## Plan / macro checkpoints

1. Audit/inventory: COMPLETE before code.
2. Desktop story mobile + focused tests: COMPLETE. Narrow width no longer disables enhancement. Actual scroll advances/reverses six real screens; controls and full-image dialog remain available.
3. Trainer mobile + focused tests: COMPLETE. Five real phone screens, current original copy in stage, cached geometry and native anchors. Source articles restored in fallback. No replacement content/model.
4. Ecosystem mobile + focused tests: COMPLETE. Same Desktop→Trainer→connected meaning; compact token/path and sequential device transitions, no Client marketing.
5. Navbar/CTA/rhythm: COMPLETE. Menu label/state, outside/focus-leave close, Escape focus return, pageshow/breakpoint reset. Shared CTA/footer44px targets. Hero identity and content unchanged.
6. Tablet adaptation: COMPLETE. Same scroll engines at768×1024, readable two-column Trainer and measured stages; no width-as-fallback shortcut.
7. Reduced-motion/performance/a11y/source/full/HTTP/browser: COMPLETE for available source/local tools. Exact evidence/limits below.

No claims of physical Safari/iPhone/VoiceOver/60fps until actually measured. No Gemini delegation claimed; Codex owns implementation/acceptance, optional historical provider unavailability retained.

## Implementation and readability decisions

The existing controllers remain authoritative. Home stories have one normalized scroll progress, reversible step selection and the existing track. Desktop retains continuous movement. Mobile/tablet/landscape settle on a complete slide with a220ms horizontal transition: stopping a normal scroll no longer leaves half of two descriptions clipped. There is no autoplay, required swipe, wheel/touch interception or custom scroll lock. Optional step buttons move the document to the corresponding native scroll position.

The Desktop screenshot is the same original asset. On phones a focus viewport uses object-fit/object-position and a1.6scale, reducing browser chrome. “Ingrandisci” remains visible above the crop, opens the complete original at960px with native pan, sticky close and Escape/focus return. This is a product preview; detailed full-software labels still require that intentional zoom, rather than pretending every original1416px label can be read in320px. No screenshot was fabricated, edited or recompressed.

Trainer reuses the existing phone/5screens. Compact mode clones only the active original step-copy into a fixed-height measured stage on step changes, not every scroll pixel. Original articles remain native fragment targets; inert/aria-hidden are applied only while their accessible text is represented in the active stage. Reduced-motion/no-JS/media-error restore the complete sequential content. A measured stage taller than usable height falls back with `content-overflow`, preserving all content instead of trapping visitors with large text/short windows.

Ecosystem uses the same controller and continuous transfer-token progress. Tile travel uses its actual compact width, not a Desktop180px assumption. Short portrait and landscape use side-by-side image/text; larger phones use stacked devices/text. The wide visual now includes real frame/zoom height so it does not overlap its description. The current public flow has two products and a connected final state, not an invented Client screen.

## Breakpoints / geometry

- Home story modes: mobile below768px; tablet768–1023px; Desktop from1024px. Landscape under520px height takes precedence.
- Navbar remains mobile through768px; story pin top82px there,94px otherwise. Original wide Trainer pin remains100px.
- Compact Trainer below1024px width OR650px height; phone/copy columns from600px width OR below650px height. Narrow portrait taller than649px uses the centered phone above the copy.
- Stable `svh` bounds media rather than tying the story run to collapsing address-bar height. ResizeObserver measures Home pin/intro changes and notifies Trainer to invalidate cached geometry. Resize/pageshow/reduced-motion changes reconfigure. No dynamic browser-chrome certification is implied.
- Content fit is measured, not inferred from a named device. Reduced motion remains the only intentional design simplification; no-JS, failed media and genuinely oversized content are documented technical/accessibility safety paths.

## Final viewport matrix — real Edge/Chromium layout overrides

Numbers are final measured stage heights in CSSpx, Desktop / Trainer / Ecosystem. Each height plus its sticky inset fits the viewport. All11 layouts enhanced; no horizontal document overflow and AppClient absent.

| Viewport | Mode | Stage heights | Result |
|---|---|---|---|
|320×568|mobile|448 /411 /458|PASS|
|360×800|mobile|513 /540 /569|PASS|
|375×812|mobile|496 /544 /569|PASS|
|390×844|mobile|505 /532 /549|PASS|
|393×852|mobile|507 /535 /529|PASS|
|414×896|mobile|509 /549 /529|PASS|
|768×1024|tablet|745 /465 /473|PASS|
|1024×768|Desktop|652 /594 /616|PASS|
|1366×768|Desktop|652 /594 /616|PASS|
|1440×900|Desktop|718 /726 /656|PASS|
|844×390|landscape|248 /230 /288|PASS|

All six public routes also checked at375×812 and768×1024: no horizontal overflow, one h1 each, direct Trainer route retains compact enhancement. Header/CTA/footer and local routing remain shared. Temporary viewport overrides reset after QA.

## Behaviour / accessibility review

Actual normal scroll at375×812, with settled controller states:

| Story | Start | Mid | End | Reverse |
|---|---|---|---|---|
|Desktop|step0, p≈0|step3, p≈.501|step5, p1|step3, p≈.501|
|Trainer|Home, p0|Clienti, p≈.396|Agenda, p≈.966|Clienti, p≈.396|
|Ecosystem|step0, p0|step1, p≈.503|step2, p1|step1, p≈.503|

Current copy/progress/real media update together. Tested native step/anchor navigation and reverse states in the existing controller tests, including320px, tablet and landscape fixtures. Initial readouts captured before scroll input/220ms transition settled were discarded and re-read after expected active state; these are not reported as product failures or false clipping passes.

Actual menu375px: open/close label and expanded state, Escape closes and focuses toggle; Desktop navigation closes menu/current route correct; browser Back returns with menu closed. No body locking. Desktop image dialog320px: original960px accessible through native pan, close remains visible, Escape restores focus. Actual landscape Ecosystem and320/375Trainer inspected for fit; image loading briefly takes a frame after a programmatic jump and then shows the original correctly.

Source accessibility: native button/link semantics, labels and alt text retained;44px menu/step/Trainer-nav/detail/CTA/footer controls; numbered/underlined selected state plus aria-current, not colour alone; inactive slides inert only in enhanced mode; visible focus and sticky-aware focus margin; content survives no-JS/error/reduced motion. Headings/routes and local HTTP checked. This is source/Chromium review, not VoiceOver or WCAG certification.

## Reduced motion / performance

PASS source/controller tests: changing motion preference restores sequential content and removes enhancement/inert; independent CSS reduced-motion rules remove pinning/large transforms, restore source articles, retain content/CTAs. No-JS is sequential by default. Real OS preference switching and real Safari assistive-technology testing NOT RUN.

Passive scroll listeners and rAF coalescing retained. Home reads one section rectangle per story, not every screenshot; stage/intro/token measurements occur during configuration. Trainer geometry is cached on layout changes; scroll does not repeatedly measure each article. Active-copy cloning happens only when the step changes. Transform/opacity are the animation primitives; Home will-change is scoped to visible enhanced stories. No new package, animation framework, video autoplay or synthetic imagery. All source browser JS totals27670bytes uncompressed; the five existing400×816Trainer story screens total135362bytes. A sixth31360byte poster remains a separate existing asset. Raw user video is not part of the public build. This is a small-source/payload review, not a measured60fps/Lighthouse result.

Impeccable static detector actually executed on index.html + the two CSS files:8warnings and117advisories, NOT CLEAN. Warnings concern existing Hero-eyebrow/font/glow/raster composition and the existing model-flow side-tab; the requested approved identity is preserved. Token/radius/type advisories also reflect the documented historical DESIGN snapshot drift and deliberate compact sizing. Low-contrast advisory reports4.2:1 against a gradient on the large accented Hero; no new ordinary-size accent-on-soft text was introduced (controls use existing accent-dark). No suppressions/design-system rewrite to manufacture a clean detector result. It is a heuristic receipt, separate from functional test PASS.

## Tests / final build

- Node full suite:57/57 PASS,0skipped. Includes real controller VM tests for mobile start/mid/end/reverse, compact settling vs continuous Desktop, no narrow-width fallback, reduced-motion/media-error/measured overflow, Trainer geometry caching and source-content restoration; existing route/media/download/legal/publication regressions retained.
- `node scripts/validate-site.mjs`: PASS,6real pages +10compatibility aliases.
- `node scripts/prepare-public.mjs`: PASS,45allowlisted files in dist; source/QA/raw recordings excluded.
- `node scripts/test-http.mjs`: PASS against actual127.0.0.1:8765; six routes bare/slash/index, aliases, disabledClient404, assets/ranges/private404.
- `node --check`:22JS/MJS source/test files PASS.
- `git diff --check`: PASS. Scoped high-confidence credential/private-key/machine-path scan PASS; not a full-history security audit. Index empty.
- Protected pre-existing recording SHA256 unchanged: C82A059B28CB2FEACE44B5ED0CD7416255C08D3F1E83AD84FCF866D7B6253896.
- Ignored local receipts: `.qa/mobile-parity-20261029/` contains viewport-matrix.json, native-scroll.json, routes.json, final-tests.txt, final-source-checks.json, detector JSON and representative actual screenshots. Not public/not staged.

NOT RUN: real iPhone/Safari/Android/iPad, physical browser chrome/rotation, VoiceOver, Lighthouse, CPU/GPU/FPS profiling, touch-device certification. No database/backend/app tests apply.

## Files / release boundary

Modified: assets/css/home-story.css, assets/css/styles.css, assets/js/home-story.js, assets/js/app-showcase.js, assets/js/site.js, index.html, scripts/home-render.mjs, scripts/home-story.test.mjs, scripts/trainer-showcase.test.mjs, README.md. Created: this report. Root/project ignored CODEX_HANDOFF.md updated. QA helpers/screenshots are ignored local evidence. Protected pre-existing assets/videos/ios-trainer-overview-web.mp4 remains dirty but was NOT modified by this task.

NO database/migrations, Desktop/iOS edits, dependency additions, Client enablement, routing architecture changes, commit, push, tag or deploy. Public site still serves473f8cf.

## Final result / next exact step

DESKTOP STORY MOBILE: PASS. TRAINER STORY MOBILE: PASS. ECOSYSTEM MOBILE: PASS. NAVBAR: PASS. CTA PARITY: PASS. TABLET: PASS. REDUCED MOTION: PASS source/controller/CSS; native OS NOT RUN. BUILD: PASS. STATUS: PASS local/source; device limitations above remain explicit.

User visual review before production publish. Restart the established local preview with `node scripts/serve-site.mjs --public` after build, inspect Home and `/app-trainer/` at target sizes, then authorize publication separately if approved. No remote operation is pending or partially executed.
