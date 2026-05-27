#!/usr/bin/env bash
# select-brand.sh — switch the active brand for a local build.
#
# Usage:   scripts/select-brand.sh <slug>
# Slugs:   safe | lux | hanzo
#
# What it does:
#   1) Copies apps/web/.env.<slug> -> apps/web/.env.local         (overridden each run)
#   2) Mirrors apps/web/public/brand/<slug>/ -> apps/web/public/brand/active/
#
# After this runs, `pnpm --filter @safe-global/web build` produces the branded build.

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

rm -rf "$repo_root/apps/web/public/brand/active"
mkdir -p "$repo_root/apps/web/public/brand/active"
cp -R "$brand_dir/." "$repo_root/apps/web/public/brand/active/"

# Per-brand manifest replaces the default safe.webmanifest at build time.
if [[ -f "$brand_dir/manifest.json" ]]; then
  cp "$brand_dir/manifest.json" "$repo_root/apps/web/public/safe.webmanifest"
fi

echo "brand '$slug' selected"
echo "  env       -> apps/web/.env.local"
echo "  assets    -> apps/web/public/brand/active/"
echo "  manifest  -> apps/web/public/safe.webmanifest"
