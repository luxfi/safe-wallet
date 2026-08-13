import CustomLink from '@/components/common/CustomLink'
import MarkdownContent from '@/components/common/MarkdownContent'
import type { NextPage } from 'next'
import SafeTerms from '@/markdown/terms/terms.md'
import type { MDXComponents } from 'mdx/types'
import Legal from '@/components/common/Legal'
import { brand } from '@safe-global/brand'

const overrideComponents: MDXComponents = {
  a: CustomLink,
}

const Terms: NextPage = () => (
  <Legal title="Terms" href={brand.termsUrl}>
    <MarkdownContent>
      <SafeTerms components={overrideComponents} />
    </MarkdownContent>
  </Legal>
)

export default Terms
