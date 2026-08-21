#!/usr/bin/env node
/**
 * Rasterises Lux's icon set from @luxfi/logo, the one place the geometry lives.
 *
 * The tab icon proper is `mark.svg` — transparent, with a prefers-color-scheme
 * rule, so the mark takes its tone from the browser chrome instead of carrying a
 * tile that fights it. These rasters are the fallback for readers that resolve no
 * CSS: an .ico cannot ask what colour the chrome is, so it commits to a white mark
 * with a dark keyline, which survives either ground.
 *
 * The keyline is drawn as a stroked path UNDER a filled one rather than with
 * `paint-order`, because .ico pipelines and librsvg do not all honour that
 * property and the one that ignores it paints the keyline over the mark.
 *
 * Lux's mark is a triangle, and a triangle's ~60° vertices give a miter ratio of
 * ~2.0 — under SVG's default `stroke-miterlimit` of 4, so the miter is KEPT and
 * each corner grows a spike twice as far as the stroke is wide. Measured on the
 * canonical geometry, the apex reaches y=98 of a 100-unit box. `getFaviconSVG`
 * draws the keyline with `stroke-linejoin="round"`, which caps every corner at
 * half the stroke width; do not change it to a miter without also pinning
 * `stroke-miterlimit` below 1.98.
 *
 * Not wired into `build`: the SVGs are generated on every build by
 * generate-brand.mjs, these binaries are committed. Run this by hand when the
 * mark changes, and commit what it writes.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { getFaviconSVG } from '@luxfi/logo'

const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')

/** Sizes a browser actually asks an .ico for. */
const ICO_SIZES = [16, 32, 48, 64]

/**
 * PNG-in-ICO. Every browser and Windows since Vista reads it, it keeps full
 * alpha, and it spares us hand-rolling a BMP with an AND mask — the format whose
 * fixed size is why the blank tile and the wordmark tile weighed the same 32,038
 * bytes and looked like the same file.
 */
const ico = (pngs) => {
  const dir = Buffer.alloc(6 + 16 * pngs.length)
  dir.writeUInt16LE(0, 0) // reserved
  dir.writeUInt16LE(1, 2) // type: icon
  dir.writeUInt16LE(pngs.length, 4)
  let offset = dir.length
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i
    dir.writeUInt8(size >= 256 ? 0 : size, e) // width
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1) // height
    dir.writeUInt8(0, e + 2) // palette
    dir.writeUInt8(0, e + 3) // reserved
    dir.writeUInt16LE(1, e + 4) // colour planes
    dir.writeUInt16LE(32, e + 6) // bits per pixel
    dir.writeUInt32LE(data.length, e + 8)
    dir.writeUInt32LE(offset, e + 12)
    offset += data.length
  })
  return Buffer.concat([dir, ...pngs.map((p) => p.data)])
}

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

const writeIco = async (svg, path) => {
  const pngs = await Promise.all(ICO_SIZES.map(async (size) => ({ size, data: await png(svg, size) })))
  writeFileSync(path, ico(pngs))
  console.log(`Wrote ${path}`)
}

const writePng = async (svg, path, size) => {
  writeFileSync(path, await png(svg, size))
  console.log(`Wrote ${path}`)
}

const mark = getFaviconSVG()

const luxDir = resolve(webRoot, 'public', 'brand', 'lux')
mkdirSync(luxDir, { recursive: true })

await writeIco(mark, resolve(luxDir, 'favicon.ico'))
await writePng(mark, resolve(luxDir, 'android-chrome-192x192.png'), 192)
await writePng(mark, resolve(luxDir, 'android-chrome-512x512.png'), 512)

/**
 * Browsers request /favicon.ico on their own, before any <link> is parsed, and
 * one static export serves every host — so this file cannot be per-brand. Lux is
 * what the brand registry already resolves to when no host matches, so Lux is
 * what belongs here.
 */
await writeIco(mark, resolve(webRoot, 'public', 'favicon.ico'))
