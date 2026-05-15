# @safe-global/brand

White-label brand tokens for the Safe wallet monorepo.

## Why

The Safe wallet codebase is the upstream OSS reference. Lux Safe, Hanzo Vault,
and future partner builds all ship from the same source. To keep them in lock-
step we keep brand strings (product name, URLs, support contacts, asset paths,
primary color) out of the source — they live here, in one file, behind one
type — and per-brand builds override them via env vars.

## Shape

```ts
import { brand } from '@safe-global/brand'

brand.name // "Safe{Wallet}"  (or "Lux Safe", "Hanzo Vault", …)
brand.domain // "safe.global"
brand.email // "support@safe.global"
brand.helpUrl // "https://help.safe.global"
brand.logoUrl // "/images/safe-logo-green.png"
brand.primaryColor // "#12FF80"
```

See [`src/index.ts`](src/index.ts) for the full `Brand` interface.

## Setting brand values at build time

Web uses `NEXT_PUBLIC_BRAND_*`, mobile uses `EXPO_PUBLIC_BRAND_*`. The brand
module reads whichever is set, so a single env file can drive both apps.

```bash
# apps/web/.env.lux
NEXT_PUBLIC_BRAND_NAME="Lux Safe"
NEXT_PUBLIC_BRAND_DOMAIN="safe.lux.network"
NEXT_PUBLIC_BRAND_EMAIL="support@lux.network"
NEXT_PUBLIC_BRAND_HELP_URL="https://help.lux.network"
NEXT_PUBLIC_BRAND_LOGO_URL="/brand/lux/logo.svg"
```

The repo ships three sample env files in `apps/web/`:

- `.env.safe` — upstream Safe defaults (sanity check)
- `.env.lux` — Lux Safe
- `.env.hanzo` — Hanzo Vault

`scripts/select-brand.sh <slug>` copies the selected env file and the matching
asset directory into place, then the normal Next build picks them up.

## Rule

There is exactly one way to render the product name. It is `brand.name`. There
is no `'Safe'` string literal in source files. If you find one, replace it.
