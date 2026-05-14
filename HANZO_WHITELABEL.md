# Safe Wallet — White-Label Plan

This monorepo is a fork of `safe-global/safe-wallet-monorepo`. We want
a single codebase that can ship multiple branded wallets (Lux, Hanzo,
partner builds) without forking per brand.

## The strategy: one source, env-driven brand tokens

Every hardcoded brand reference in app code gets replaced with a
read from a single `Brand` config object. Brand config is sourced
from env vars at build time, **never** baked into the source files.

```ts
// packages/brand/src/index.ts   (new package)
export interface Brand {
  name: string                  // "Lux Safe", "Hanzo Vault", …
  shortName: string             // "Safe", "Vault" — used in UI chrome
  domain: string                // "safe.lux.network"
  email: string                 // "support@lux.network"
  logoUrl: string               // "/brand/logo.svg" (per-tenant CDN)
  faviconUrl: string
  primaryColor: string
  twitterHandle?: string
  discordUrl?: string
  helpUrl: string
  termsUrl: string
  privacyUrl: string
  // …
}

export const brand: Brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Safe",
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME ?? "Safe",
  domain: process.env.NEXT_PUBLIC_BRAND_DOMAIN ?? "safe.global",
  email: process.env.NEXT_PUBLIC_BRAND_EMAIL ?? "support@safe.global",
  // …
}
```

Every consumer imports from `@hanzo/safe-brand` (workspace alias)
and renders `brand.name` / `brand.logoUrl` / etc. No `'Safe'` string
literal anywhere in `apps/` or `packages/*/src/`.

## Brand surface inventory (audit)

```bash
$ grep -rln "Safe{Wallet}\|safe.global\|Safe Wallet" \
    --include='*.tsx' --include='*.ts' apps packages | wc -l
1759
```

≈1,759 files carry one or more brand references. Each falls into a
small set of patterns:

| Pattern                              | Replacement                          |
|--------------------------------------|--------------------------------------|
| `'Safe{Wallet}'`                     | `brand.name`                         |
| `'Safe'` (subject noun)              | `brand.shortName`                    |
| `https://safe.global/...`            | `${brand.helpUrl}/...`               |
| `support@safe.global`                | `brand.email`                        |
| `/images/safe-logo.svg`              | `brand.logoUrl`                      |
| `app.safe.global`                    | `brand.domain`                       |
| Tweet IDs / Discord links            | `brand.twitterHandle`, `discordUrl`  |
| `<meta name="apple-mobile-web-app-…` | per-brand `app.json` (mobile only)   |

## Implementation phases

1. **packages/brand**: create the package + types + default Brand
   pointing at the upstream Safe values (so the unbranded build
   matches today exactly).
2. **Mechanical replace pass 1** — the easy patterns (URLs, email,
   logo paths). ~700 files via a single codemod.
3. **Mechanical replace pass 2** — text-in-JSX (`"Safe Wallet"` →
   `{brand.name}`). ~900 files via a JSX-aware codemod.
4. **Manual pass 3** — anything the codemod can't safely rewrite
   (filenames, asset URLs that need per-brand assets, metadata in
   `apps/web/public/manifest.json`, native `Info.plist`/`AndroidManifest`).
5. **Per-brand build configs** — `apps/web/.env.lux`, `apps/web/.env.hanzo`,
   plus matching `mobile/app.config.lux.ts` / `app.config.hanzo.ts`.
6. **Asset pipelines** — brand-token-driven Tailwind theme,
   per-brand `public/brand/` directory, build step that copies the
   selected brand's assets in.

## What stays upstream

- Smart contract addresses (those are Safe's protocol — every brand
  uses the same contracts on each chain).
- Public-API endpoint paths (the Safe Transaction Service URL
  schema; we just point the SDK at a per-network host).
- The `safe-` prefix in npm package names of upstream deps. We don't
  rename `@safe-global/protocol-kit` etc.; that's the SDK, not the
  brand.

## Tracking

This file is the single source of truth for the white-label scope.
Update it as phases land.
