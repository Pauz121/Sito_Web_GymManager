# Website production alignment — 2026-10-29

## Scope and authority

User authorized publication of latest approved website source to its existing Cloudflare production branch. Website repository only: Pauz121/Sito_Web_GymManager, main. No Desktop/iOS/backend/database/Stripe/DNS/account/security changes. All earlier source work remains represented; no redesign of Hero/Desktop/Trainer.

## Public content

- Home: Hero, six authentic Desktop screens, preserved five-screen Trainer story, workflow and Desktop–Trainer ecosystem, final Download CTA/footer.
- App Client: single build-time flag `siteFeatures.clientMarketing=false`. Source renderers, original route definition, icon and CSS retained. No generated Client document, navbar/footer/Home CTA or Client icon in dist. Direct `/app-client`, slash/index variants return404. No coming-soon spacer/release date.
- Ecosystem temporarily represents Desktop and Trainer using the existing shared scroll controller. Client references in Privacy/Support remain factual information for existing ecosystem users, not product marketing/downloads.
- Privacy/Support: draft notices, labels, metadata and provisional-page wording removed; legal layout/contents/contact preserved. Approved name Paolino Bottiglieri and email Paolinob2@libero.it unchanged. Undefined legal bases/retention/provider terms remain explicitly undefined, no invented legal/company facts. This task is not legal or AppStore certification.

## Existing Cloudflare integration

Dashboard read-only inspection verified Worker `gym-manager`, repo Pauz121/Sito_Web_GymManager, production branch main, builds enabled, existing deploy `npx wrangler deploy`. Current public URL: https://gym-manager.paolinob2.workers.dev/ . No custom domain observed.

Prior successful build7aa22aa5 auto-detected static output `.` without running the site's generator. This is incompatible with current routes and can expose source documents. New `wrangler.jsonc` keeps that same Worker/deploy pipeline, runs the established validator+public preparation and restricts assets to `./dist`. Automatic HTML trailing-slash routing, real404, no SPA fallback. No account ID, bindings, variables, credentials or DNS introduced.

Configuration verified against [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) and [static HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/). Dashboard settings are not changed by this task.

## Validation

- Source/metadata/link/media validator: PASS, six real routes plus ten compatibility aliases.
- Established production build: PASS,45allowlisted files. Private sources, original recordings, manifests, QA and documents absent.
- Node suite:52/52PASS, including feature-flag exclusion/recoverability, legal preservation and Cloudflare output contract. Previous assertions requiring public Client were replaced with new required behavior; media/controller/security coverage preserved.
- Real local HTTP: PASS, all six routes bare/slash/index, ten aliases, assets/ranges, private404/method405, disabled Client404.
- Browser: six routes ×375/768/1366/1440 width checks, no horizontal overflow; mobile menu/direct navigation and Trainer→workflow continuity checked. Empty zoom-dialog image has no src and is not a broken asset. Local browser verification is not physical Safari/iPhone/VoiceOver certification.
- Protected user video unchanged SHA256 C82A059B28CB2FEACE44B5ED0CD7416255C08D3F1E83AD84FCF866D7B6253896; exclude this pre-existing local modification from commit/public output.

## Skill review

Sites: preserve repository/existing hosting rather than register another Site; use actual build, allowlisteddist, HTTP/rendered checks. ACCEPTED/APPLIED within explicit user hosting choice.

Impeccable: incumbent preservation, truthful copy and rendered responsive check ACCEPTED/APPLIED. Detector returned advisory findings on existing Hero/reveal/CSS and historical DESIGN token drift; no new visual tokens introduced. Replacing the pinned Hero or updating historical design-system documentation would expand this task, so those recommendations are deferred. Optional Gemini not invoked; historical provider failures not described as successful delegation.

## Publication and continuity

One reviewed website-only commit, normal main push, automatic existing Cloudflare build. Exact commit/deployment result and final public verification are recorded after publication in ignored local CODEX_HANDOFF and the user's final report; no intermediate pushes, force push, tag, application release or database operation.

Excluded: protected user recording modification, all `.qa`/review screenshots/build output/local handoffs and original uploads. Actual approved optimized product WebP assets are required by the latest website and included. No other repository changes included.

PARKED: App Client website re-enable when ready; Stripe live activation after updated website; Windows code signing. Next exact step after verified publication: use the public website URL in the separate Stripe live-account verification flow. No Stripe action in this task.
