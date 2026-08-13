import type { ComponentProps } from 'react'
import type { NextPage } from 'next'
import Legal from '@/components/common/Legal'
import { brand } from '@safe-global/brand'
import SafeCookiePolicy from '@/markdown/cookie/cookie.md'
import type { MDXComponents } from 'mdx/types'
import CustomLink from '@/components/common/CustomLink'
import MarkdownContent from '@/components/common/MarkdownContent'
import { Table as ShadcnTable, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'

const Table = (props: ComponentProps<typeof ShadcnTable>) => (
  <ShadcnTable {...props} className="border border-[black]" />
)
const Th = (props: ComponentProps<typeof TableHead>) => (
  <TableHead {...props} className="font-bold bg-[#fff] text-[black]" />
)
const Td = (props: ComponentProps<typeof TableCell>) => <TableCell {...props} />
const Tr = (props: ComponentProps<typeof TableRow>) => <TableRow {...props} />

const overrideComponents: MDXComponents = {
  a: CustomLink,
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: Tr,
  th: Th,
  td: Td,
}

const CookiePolicy: NextPage = () => (
  <Legal title="Cookie policy" href={brand.cookieUrl}>
    <MarkdownContent>
      <SafeCookiePolicy components={overrideComponents} />
    </MarkdownContent>
  </Legal>
)

export default CookiePolicy
