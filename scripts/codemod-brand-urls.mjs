#!/usr/bin/env node
/**
 * codemod-brand-urls.mjs
 *
 * Pass 1 of the white-label sweep. Replace mechanical URL / email / domain /
 * logo-path literals in app + package source with reads off @safe-global/brand.
 *
 * Strategy: this is a *targeted* rewrite, not a blind substitution. We touch
 * only string contexts that look like ES expressions — `'literal'` or
 * `"literal"` with a non-`=` non-`}` character immediately before the
 * opening quote. That keeps us out of:
 *
 *   - JSX attributes:   href="https://..."     (preceded by `=`)
 *   - JSX text:         >Safe{Wallet}<         (not in scope here — Pass 2)
 *   - Template-literal placeholders we already produced ourselves
 *
 * Skip:
 *   - tests, stories, cypress, fixtures, mocks, AUTO_GENERATED, node_modules,
 *     dist, build, coverage
 *   - @safe-global/brand itself
 *   - safe-client.*, safe-transaction-*, safe-transaction-assets.*,
 *     api.safe.global, *.5afe.dev   (protocol/CDN, not brand)
 *
 * Import insertion: we add `import { brand } from '@safe-global/brand'` on
 * its own line *after* the last existing top-of-file import statement (we
 * find it by walking the AST-light way — find the last `from '…'` line
 * before any non-import token in column 0).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

const repoRoot = path.resolve(process.argv[1], '../..')
process.chdir(repoRoot)

const excludePatterns = [
  /\/node_modules\//,
  /\/AUTO_GENERATED\//,
  /\/__tests__\//,
  /\/__mocks__\//,
  /\/cypress\//,
  /\/fixtures\//,
  /\.test\.tsx?$/,
  /\.stories\.tsx?$/,
  /\.cy\.tsx?$/,
  /\.cy\.js$/,
  /\.spec\.tsx?$/,
  /^packages\/brand\//,
  /\/dist\//,
  /\/build\//,
  /\/coverage\//,
  /^scripts\//,
]

function listFiles() {
  const out = execSync(
    "git ls-files 'apps/*.ts' 'apps/*.tsx' 'apps/**/*.ts' 'apps/**/*.tsx' 'packages/*.ts' 'packages/*.tsx' 'packages/**/*.ts' 'packages/**/*.tsx'",
    { encoding: 'utf8' },
  )
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((p) => !excludePatterns.some((re) => re.test(p)))
}

// Map of literal -> brand-property replacement. Each value is the ES
// expression we want to substitute in.
//
// `safeUrl` flag means: when the literal appears in a JSX attribute string
// position (preceded by `=`), wrap with braces — `="x"` becomes `={x}`.
// Currently we DON'T touch JSX attribute strings at all (they're handled by
// Pass 2 which can rewrite them safely). We only touch ES-string positions.
const literalReplacements = [
  // marketing safe.global with named paths
  { lit: 'https://safe.global/terms', expr: 'brand.termsUrl' },
  { lit: 'https://safe.global/privacy', expr: 'brand.privacyUrl' },
  { lit: 'https://safe.global/imprint', expr: 'brand.imprintUrl' },
  { lit: 'https://safe.global/cookie', expr: 'brand.cookieUrl' },
  { lit: 'https://safe.global/licenses', expr: 'brand.licensesUrl' },
  // primary services
  { lit: 'https://help.safe.global', expr: 'brand.helpUrl' },
  { lit: 'https://status.safe.global', expr: 'brand.statusUrl' },
  { lit: 'https://developer.safe.global', expr: 'brand.developerUrl' },
  { lit: 'https://chat.safe.global', expr: 'brand.discordUrl' },
  { lit: 'https://twitter.com/safe', expr: 'brand.twitterUrl' },
  { lit: 'https://app.safe.global', expr: 'brand.appUrl' },
  { lit: 'support@safe.global', expr: 'brand.email' },
  { lit: 'app.safe.global', expr: 'brand.appHost' },
  { lit: 'anon.safe.global', expr: 'brand.supportChatAliasDomain' },
  // logo assets
  { lit: '/images/safe-logo-green.png', expr: 'brand.logoUrl' },
  { lit: '/images/safe-logo.svg', expr: 'brand.logoUrl' },
]

const importLine = "import { brand } from '@safe-global/brand'"

/**
 * Insert `importLine` after the last top-of-file import statement. The
 * file's import block is the contiguous run of lines starting with `import`
 * (potentially spanning multiple lines for `import {\n  a,\n  b,\n} from …`),
 * starting at top of file and continuing until we see a non-import top-
 * level statement.
 */
function ensureImport(content) {
  if (content.includes("from '@safe-global/brand'")) return content
  // Tokenize line by line. We keep accepting lines into the "import block"
  // while a JS-aware predicate says we're still in an import.
  const lines = content.split('\n')
  let lastImportEndIdx = -1
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('import ') || trimmed === 'import {') {
      // Walk until we find the line that closes this import — either a
      // semicolon at the end, OR a line whose content is `from '…'`. For
      // robustness we just keep going until the line ends with a quote or
      // a semicolon.
      let j = i
      while (j < lines.length) {
        const t = lines[j].trim()
        if (t.endsWith("'") || t.endsWith('"') || t.endsWith(';')) {
          lastImportEndIdx = j
          break
        }
        j++
      }
      i = (lastImportEndIdx >= i ? lastImportEndIdx : i) + 1
      continue
    }
    if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      // Allow blank lines and comments inside the import block.
      i++
      continue
    }
    break
  }
  if (lastImportEndIdx >= 0) {
    lines.splice(lastImportEndIdx + 1, 0, importLine)
  } else {
    lines.unshift(importLine)
  }
  return lines.join('\n')
}

/**
 * Replace `'literal'` and `"literal"` with `expr` whenever the quote is in
 * an ES-expression position (i.e. NOT preceded by `=`, which signals a JSX
 * attribute). Returns the new content and a hit count.
 *
 * We also rewrite `'literal/path/...'` and `"literal/path/..."` into a
 * template literal `\`${expr}/path/...\``.
 */
function rewriteLiterals(content) {
  let hits = 0

  for (const { lit, expr } of literalReplacements) {
    // 1. Bare literal: '<lit>' or "<lit>"
    //    Allowed prefix: any char that is NOT `=` (JSX attribute) or `}` (rare).
    //    We accept `(`, `,`, `:`, ` `, `\n`, etc.
    const escLit = escapeRegExp(lit)
    const bareSingle = new RegExp(`(^|[^=])'${escLit}'`, 'g')
    const bareDouble = new RegExp(`(^|[^=])"${escLit}"`, 'g')
    content = content.replace(bareSingle, (_m, pre) => {
      hits++
      return `${pre}${expr}`
    })
    content = content.replace(bareDouble, (_m, pre) => {
      hits++
      return `${pre}${expr}`
    })

    // 2. Literal-with-path: '<lit>/foo/bar' → `${expr}/foo/bar`
    //    Same prefix guard.
    const pathSingle = new RegExp(`(^|[^=])'${escLit}(/[^']+)'`, 'g')
    const pathDouble = new RegExp(`(^|[^=])"${escLit}(/[^"]+)"`, 'g')
    content = content.replace(pathSingle, (_m, pre, tail) => {
      hits++
      return `${pre}\`\${${expr}}${tail}\``
    })
    content = content.replace(pathDouble, (_m, pre, tail) => {
      hits++
      return `${pre}\`\${${expr}}${tail}\``
    })
  }
  return { content, hits }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let touched = 0
let totalReplacements = 0
const files = listFiles()
for (const file of files) {
  const before = readFileSync(file, 'utf8')
  const { content: rewritten, hits } = rewriteLiterals(before)
  if (hits === 0) continue
  const withImport = ensureImport(rewritten)
  if (withImport === before) continue
  writeFileSync(file, withImport)
  touched++
  totalReplacements += hits
  console.log(`  ${file}  (${hits})`)
}

console.log(`\nfiles touched: ${touched}`)
console.log(`replacements:  ${totalReplacements}`)
