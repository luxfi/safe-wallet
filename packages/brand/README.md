# @safe-global/brand

White-label brand tokens for the Safe wallet monorepo.

## Why

The Safe wallet codebase is the upstream OSS reference. Lux Safe, Zoo Safe,
Pars Safe and Hanzo Vault all ship from the same source. To keep them in lock-
step we keep brand strings (product name, URLs, support contacts, asset paths,
primary color) out of the source — they live here, in one file, behind one
type.

## Shape

```ts
import { brand } from '@safe-global/brand'

brand.name // "Lux Safe"  (or "Zoo Safe", "Pars Safe", "Hanzo Vault")
brand.domain // "safe.lux.network"
brand.email // "support@lux.network"
brand.helpUrl // "https://docs.lux.network/safe"
brand.logoUrl // "/brand/lux/logo.svg"
brand.primaryColor // "#000000"
```

See [`src/index.ts`](src/index.ts) for the full `Brand` interface.

## Where the values come from

The request host, at runtime — the same way `getWhiteLabelBrand` works across
the rest of the Lux/Hanzo stack. `safe.lux.network` is Lux, `safe.zoo.network`
is Zoo, `safe.pars.network` is Pars, `vault.hanzo.ai` is Hanzo Vault. A host
that matches nothing gets Lux.

Nothing is baked in at build time, so one image serves every brand. Adding a
brand means adding an entry to the registry in [`src/index.ts`](src/index.ts)
and an asset directory under `apps/web/public/brand/<slug>/` — there is no env
var to set and no per-brand build to run.

## Rule

There is exactly one way to render the product name. It is `brand.name`. There
is no `'Safe'` string literal in source files. If you find one, replace it.
