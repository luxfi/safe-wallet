#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getWordmarkAdaptiveSVG, getWordmarkSquareSVG } from '@luxfi/logo'

const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')

// The Lux marks are drawn by @luxfi/logo, so this app does not keep a second
// copy of the letterforms to fall out of step with the first. Written before
// `next build` so the files exist for the dev server and the image alike.
//
// Only Lux comes from here. Hanzo, Pars and Zoo are other people's brands and
// ship their own art under their own directory.
const marks = {
  // Horizontal lockup — the header, the login page.
  'logo.svg': getWordmarkAdaptiveSVG(),
  // Square slot — letterboxed, so the wordmark keeps its proportions.
  'mark.svg': getWordmarkSquareSVG(),
}

const outDir = resolve(webRoot, 'public', 'brand', 'lux')
mkdirSync(outDir, { recursive: true })

for (const [name, svg] of Object.entries(marks)) {
  const outPath = resolve(outDir, name)
  writeFileSync(outPath, svg)
  console.log(`Wrote ${outPath}`)
}
