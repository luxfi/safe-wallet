#!/usr/bin/env bash
# select-brand.sh — switch the active brand for a local build.
#
# Usage:   scripts/select-brand.sh <slug>
# Slugs:   safe | lux | hanzo
#
# Copies apps/web/.env.<slug> -> apps/web/.env.local (overridden each run).
#
# Nothing else is baked in: name, logo, icons and manifest are served from
# apps/web/public/brand/<slug>/ and picked by request host at runtime.
#
# After this runs, `yarn workspace @safe-global/web build` produces the branded build.

set -euo pipefail

slug="${1:-}"

if [[ -z "$slug" ]]; then
  echo "usage: scripts/select-brand.sh <slug>"
  echo "available brands:"
  for d in apps/web/public/brand/*/; do
    name="$(basename "$d")"
    [[ "$name" == "active" ]] && continue
    echo "  - $name"
  done
  exit 1
fi

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
env_file="$repo_root/apps/web/.env.$slug"
brand_dir="$repo_root/apps/web/public/brand/$slug"

if [[ ! -f "$env_file" ]]; then
  echo "error: $env_file not found"
  exit 2
fi
if [[ ! -d "$brand_dir" ]]; then
  echo "error: $brand_dir not found"
  exit 2
fi

cp "$env_file" "$repo_root/apps/web/.env.local"

echo "brand '$slug' selected"
echo "  env    -> apps/web/.env.local"
echo "  assets -> apps/web/public/brand/$slug/ (served as-is, resolved by host)"
