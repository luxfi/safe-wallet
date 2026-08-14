#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getWordmarkAdaptiveSVG, getWordmarkSquareSVG } from '@luxfi/logo'
import { getMenuBarSVG as hanzoMark } from '@hanzo/logo'
import { getColorSVG as zooMark } from '@zooai/logo'
import { logoColorSVG as parsMark } from '@parsdao/brand'

const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')

// Each brand's letterforms are drawn by that brand's own logo package, so this
// app does not keep a second copy of anyone's artwork to fall out of step with
// the first. Written before `next build` so the files exist for the dev server
// and the image alike.

// Place a mark inside a larger drawing without touching its coordinates: an
// inner <svg> keeps its own viewBox and scales into the box it is given. Any
// size the mark states for itself is dropped — the box decides — and stating
// it twice would make the file malformed.
const inset = (svg, box) =>
  svg.replace(
    /^<svg([^>]*)>/,
    (_, attrs) =>
      `<svg x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}"${attrs.replace(/\s+(?:x|y|width|height)="[^"]*"/g, '')}>`,
  )

// A mark drawn in currentColor has no colour of its own, and an SVG loaded as
// an image is its own document with nothing to inherit from — so it must say
// what its ink is, and say it again for a dark reader.
const adapt = (svg) =>
  svg.replace(/^(<svg[^>]*>)/, '$1<style>svg{color:#121312}@media(prefers-color-scheme:dark){svg{color:#fff}}</style>')

// Horizontal lockup: the mark, then the name. Ink follows the reader's theme —
// marks drawn in currentColor track it, marks drawn in brand colour keep theirs.
const lockup = (mark, name, width) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 28" width="${width}" height="28" role="img" aria-label="${name}"><style>svg{color:#121312}.t{fill:#121312;font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:19px;font-weight:700;letter-spacing:-.4px}@media(prefers-color-scheme:dark){svg{color:#fff}.t{fill:#fff}}</style>${inset(mark, { x: 0, y: 4, w: 20, h: 20 })}<text class="t" x="30" y="20">${name}</text></svg>`

const brands = {
  // Lux draws its own wordmark, so the name is lettered rather than typeset.
  lux: { 'logo.svg': getWordmarkAdaptiveSVG(), 'mark.svg': getWordmarkSquareSVG() },
  zoo: { 'logo.svg': lockup(zooMark(), 'Zoo Safe', 120), 'mark.svg': zooMark() },
  pars: { 'logo.svg': lockup(parsMark, 'Pars Safe', 122), 'mark.svg': parsMark },
  hanzo: { 'logo.svg': lockup(hanzoMark(), 'Hanzo Vault', 150), 'mark.svg': adapt(hanzoMark()) },
}

for (const [slug, marks] of Object.entries(brands)) {
  const outDir = resolve(webRoot, 'public', 'brand', slug)
  mkdirSync(outDir, { recursive: true })
  for (const [name, svg] of Object.entries(marks)) {
    const outPath = resolve(outDir, name)
    writeFileSync(outPath, svg)
    console.log(`Wrote ${outPath}`)
  }
}
