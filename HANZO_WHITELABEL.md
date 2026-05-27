# Safe Wallet — White-Label Plan

This monorepo is a fork of `safe-global/safe-wallet-monorepo`. We ship multiple
branded wallets (Lux Safe, Hanzo Vault, partner builds) from a single source.

## Strategy

One source. Env-driven brand tokens. Every hardcoded brand reference in app
code reads from a single `Brand` config object exposed by the workspace
package `@safe-global/brand`.

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

export const brand: Brand = {
  name: env('NAME', 'Safe{Wallet}'),
  domain: env('DOMAIN', 'safe.global'),
  email: env('EMAIL', 'support@safe.global'),
  // …
}
```

Defaults match upstream Safe values, so an unbranded build is byte-for-byte
the same as today. Per-brand builds override via `NEXT_PUBLIC_BRAND_*` (web)
or `EXPO_PUBLIC_BRAND_*` (mobile) env vars at build time.

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

## Per-brand build

Three sample brand bundles ship in-tree:

| Slug    | Brand        | Env file              | Asset dir                      |
| ------- | ------------ | --------------------- | ------------------------------ |
| `safe`  | Safe{Wallet} | `apps/web/.env.safe`  | `apps/web/public/brand/safe/`  |
| `lux`   | Lux Safe     | `apps/web/.env.lux`   | `apps/web/public/brand/lux/`   |
| `hanzo` | Hanzo Vault  | `apps/web/.env.hanzo` | `apps/web/public/brand/hanzo/` |

Each `apps/web/public/brand/<slug>/` directory holds the per-brand
`manifest.json` plus logo and icon assets.

### Build invocation

```bash
# From repo root.
pnpm --filter @safe-global/web build:lux       # Lux Safe
pnpm --filter @safe-global/web build:hanzo     # Hanzo Vault
pnpm --filter @safe-global/web build:safe      # Upstream Safe defaults (sanity check)
```

Under the hood each `build:<slug>` runs
`scripts/select-brand.sh <slug>` then `pnpm build`. The selector:

1. Copies `apps/web/.env.<slug>` → `apps/web/.env.local`
2. Copies `apps/web/public/brand/<slug>/` → `apps/web/public/brand/active/`
3. Copies `apps/web/public/brand/<slug>/manifest.json` →
   `apps/web/public/safe.webmanifest`

`apps/web/.env.local` and `apps/web/public/brand/active/` should be in
`.gitignore` (or treated as build outputs) so the local-dev brand selection
never leaks into commits.

### Adding a new brand

1. Add `apps/web/.env.<slug>` with `NEXT_PUBLIC_BRAND_*` values.
2. Add `apps/web/public/brand/<slug>/` with `manifest.json`, `logo.svg`,
   `favicon.ico`, and the Android Chrome icon sizes referenced by the
   manifest.
3. Add a `build:<slug>` script to `apps/web/package.json`.
4. (Mobile) wire `EXPO_PUBLIC_BRAND_*` into the EAS build profile in
   `apps/mobile/eas.json`.

That's the entire surface area. No source file changes needed.

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

### Brand assets (placeholders in tree)

The `lux/` and `hanzo/` directories ship 1x1 transparent placeholder PNGs and
a text-only SVG logo so the manifests resolve at runtime. Design must replace
with real artwork before public release:

- `apps/web/public/brand/lux/logo.svg`
- `apps/web/public/brand/lux/favicon.ico`
- `apps/web/public/brand/lux/android-chrome-192x192.png`
- `apps/web/public/brand/lux/android-chrome-512x512.png`
- `apps/web/public/brand/hanzo/logo.svg`
- `apps/web/public/brand/hanzo/favicon.ico`
- `apps/web/public/brand/hanzo/android-chrome-192x192.png`
- `apps/web/public/brand/hanzo/android-chrome-512x512.png`

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
