# Safe Wallet — White-Label Plan

This monorepo is a fork of `safe-global/safe-wallet-monorepo`. We ship multiple
branded wallets (Lux Safe, Hanzo Vault, partner builds) from a single source.

## Strategy

One source. One image. Every hardcoded brand reference in app code reads from
a single `Brand` object exposed by the workspace package `@safe-global/brand`,
which resolves against the request host at runtime.

```ts
// packages/brand/src/index.ts
export interface Brand {
  name: string
  shortName: string
  domain: string
  appHost: string
  appUrl: string
  email: string
  helpUrl: string
  termsUrl: string
  privacyUrl: string
  // … and more
}

/** Host suffix → brand. First match wins; Lux monochrome is the fallback. */
const REGISTRY: ReadonlyArray<readonly [RegExp, Brand]> = [
  [/(^|\.)lux\.network$/i, lux],
  [/(^|\.)zoo\.network$/i, zoo],
  [/(^|\.)pars\.network$/i, pars],
  [/(^|\.)hanzo\.ai$/i, hanzo],
]
```

Because the host decides, the same bundle serves every brand and there is
nothing to bake in. A host that matches nothing gets Lux.

## Pattern table

| Pattern                           | Replacement                                   |
| --------------------------------- | --------------------------------------------- |
| `'Safe{Wallet}'` / `Safe{Mobile}` | `brand.name`                                  |
| `'Safe'` (subject noun in chrome) | `brand.shortName`                             |
| `https://help.safe.global/...`    | `${brand.helpUrl}/...`                        |
| `https://app.safe.global/...`     | `${brand.appUrl}/...`                         |
| `https://safe.global/{terms,…}`   | `brand.{terms,privacy,imprint,…}Url`          |
| `support@safe.global`             | `brand.email`                                 |
| `/images/safe-logo*.{png,svg}`    | `brand.logoUrl`                               |
| `app.safe.global` (host literal)  | `brand.appHost`                               |
| `anon.safe.global`                | `brand.supportChatAliasDomain`                |
| `https://chat.safe.global`        | `brand.discordUrl`                            |
| `https://twitter.com/safe`        | `brand.twitterUrl`                            |
| `https://status.safe.global`      | `brand.statusUrl`                             |
| `https://developer.safe.global`   | `brand.developerUrl`                          |
| webmanifest `name`/`description`  | per-brand `public/brand/<slug>/manifest.json` |
| mobile Expo `name`                | reads `EXPO_PUBLIC_BRAND_NAME`                |

## What stays upstream (not brand strings)

- Smart contract addresses (every brand uses the same Safe contracts).
- `safe-client.safe.global` (CGW — Safe Transaction Service host; protocol).
- `safe-transaction-*.safe.global` (the per-network tx-service).
- `safe-transaction-assets.safe.global` (chain logo CDN).
- npm package names of upstream deps (`@safe-global/protocol-kit`,
  `@safe-global/api-kit`, etc.).
- TypeScript identifiers (`SafeInfo`, `useSafeInfo`, `class Safe`,
  `safe.address` etc.) — these are protocol terms, not brand strings.
- `OFFICIAL_HOSTS` / `IPFS_HOSTS` regexes (identity check for the
  upstream-deployed canonical host).

## Assets

Four brands ship in-tree, one asset directory each:

| Host                | Brand       | Asset dir                      |
| ------------------- | ----------- | ------------------------------ |
| `safe.lux.network`  | Lux Safe    | `apps/web/public/brand/lux/`   |
| `safe.zoo.network`  | Zoo Safe    | `apps/web/public/brand/zoo/`   |
| `safe.pars.network` | Pars Safe   | `apps/web/public/brand/pars/`  |
| `vault.hanzo.ai`    | Hanzo Vault | `apps/web/public/brand/hanzo/` |

Each directory holds that brand's `manifest.json`, wordmark (`logo.svg`),
square mark (`mark.svg`) and icons. The Lux wordmark and mark are not kept
here — `apps/web/scripts/generate-brand.mjs` draws them from `@luxfi/logo`
before `next build`, so the letterforms have one home.

### Build invocation

```bash
# From repo root.
yarn workspace @safe-global/web build:lux
```

`build:lux` runs `scripts/select-brand.sh lux` then `yarn build`. The selector
copies `apps/web/.env.lux` → `apps/web/.env.local`; that file carries build
settings (production mode, client gateway, default chain), not brand tokens.
`.env.local` is gitignored so a local selection never leaks into a commit.

There is one build. The brand follows the host it is served from.

### Adding a new brand

1. Add the brand and its host pattern to the registry in
   `packages/brand/src/index.ts`.
2. Add `apps/web/public/brand/<slug>/` with `manifest.json`, `logo.svg`,
   `mark.svg`, `favicon.ico`, and the Android Chrome icon sizes referenced by
   the manifest.

That's the entire surface area. No env vars, no extra build.

## Identity

Sign-in is Hanzo IAM — one OIDC client per brand, declared in
`packages/brand/src/index.ts` and resolved by host like every other brand
token. The client is public: Authorization Code + PKCE-S256, no secret in the
browser, so nothing below is a credential.

| Brand | Issuer                 | `client_id`   | Redirect URI                              |
| ----- | ---------------------- | ------------- | ----------------------------------------- |
| Lux   | `https://lux.id`       | `lux-safe`    | `https://safe.lux.network/auth/callback`  |
| Zoo   | `https://zoolabs.id`   | `zoo-safe`    | `https://safe.zoo.network/auth/callback`  |
| Pars  | `https://pars.id`      | `pars-safe`   | `https://safe.pars.network/auth/callback` |
| Hanzo | `https://iam.hanzo.ai` | `hanzo-vault` | `https://vault.hanzo.ai/auth/callback`    |

Each application has to exist on its IAM carrying that exact `redirectUris`
entry (plus `http://localhost:3000/auth/callback` for local dev) and the
`authorization_code` + `refresh_token` grants. Set `expireInHours` and
`refreshExpireInHours`: an unset refresh lifetime falls back to the access
lifetime, which expires the refresh token at the same instant as the token it
renews, so the session cannot be extended.

The wallet path is untouched. A user signs in with either, and the Safe
transaction signer is always the wallet — IAM carries identity, never a key.

## Status

| Phase | Status | Commit prefix                                                                 |
| ----- | ------ | ----------------------------------------------------------------------------- |
| 0     | landed | `feat(brand): create @safe-global/brand workspace`                            |
| 1     | landed | `refactor(brand): pass 1 — URLs, emails, and asset paths route through brand` |
| 2     | landed | `refactor(brand): pass 2 — product name in JSX, copy, and SDK metadata`       |
| 3     | landed | `refactor(brand): pass 3 — manifests and metadata`                            |
| 4     | landed | `feat(brand): per-brand build configs and asset pipeline`                     |

After all phases land, `grep -RIn 'safe\.global\|support@safe\.global\|Safe{Wallet}' apps/ packages/`
returns only protocol references (the CGW/tx-service hosts) and the brand
package's own defaults — no brand strings in app source.

## Manual review queue

The build pipeline is correct; the items below need human follow-up before a
true non-Safe branded release ships, but do not block per-brand builds.

### Brand assets

`logo.svg` and `mark.svg` are real for all four brands — drawn at build time
from each brand's own logo package (`@luxfi/logo`, `@zooai/logo`,
`@hanzo/logo`, `@parsdao/brand`) by `apps/web/scripts/generate-brand.mjs`.

The raster icons are still generic: `favicon.ico` and both
`android-chrome-*.png` are byte-identical across zoo, pars and hanzo. Each
brand needs its own set cut from its own mark:

- `apps/web/public/brand/{zoo,pars,hanzo}/favicon.ico`
- `apps/web/public/brand/{zoo,pars,hanzo}/android-chrome-192x192.png`
- `apps/web/public/brand/{zoo,pars,hanzo}/android-chrome-512x512.png`

Only Lux has real letterforms. The other three name themselves in Inter beside
their mark, because their logo packages ship a mark and a `<text>` element
rather than outlined type.

### Legal copy

The terms-of-service and privacy markdown is the upstream Safe-DAO legal text.
A real lux/hanzo brand needs its own legal copy. The env file points
`termsUrl` / `privacyUrl` to the brand domain (e.g. `https://lux.network/terms`),
but the in-app markdown body still reads as Safe Foundation copy:

- `apps/web/src/markdown/terms/terms.md`
- `apps/web/src/markdown/privacy/privacy.md`

### Safe Labs page

`apps/web/src/components/terms/safe-labs-terms.tsx` is a Safe-Labs-specific
upstream marketing/legal page (`https://safe.global/blog`, `https://safe.global`).
For a non-Safe brand this page should be hidden, replaced, or unlinked from
the routes. Leaving it for now because no current branded build needs it.

### Test fixture brand strings

`__snapshots__/*.snap`, `__tests__/*.test.ts`, and a couple of `*.stories.tsx`
files reference the upstream Safe brand. Snapshots regenerate; tests use
literals as fixed string fixtures. Not a brand leak in shipped output.

### Help-article slugs

Some `${brand.helpUrl}/articles/...` paths still embed the upstream article
slug (which includes `Safe{Wallet}` or `Safe{Staking}` in the URL path). The
hostname is brand-correct, but the slug is upstream. Acceptable so long as
the brand's docs site (e.g. `docs.lux.network/safe`) either hosts the same
slug or returns a sensible redirect. Track per-article as docs migrate.

## Status

| Phase | Status | Commit prefix                                                                 |
| ----- | ------ | ----------------------------------------------------------------------------- |
| 5     | landed | `refactor(brand): pass 5 — missed help.safe.global hrefs, placeholder assets` |
