import CustomLink from '@/components/common/CustomLink'
import MarkdownContent from '@/components/common/MarkdownContent'
import type { MDXComponents } from 'mdx/types'
import type { NextPage } from 'next'
import SafePrivacyPolicy from '@/markdown/privacy/privacy.md'
import Legal from '@/components/common/Legal'
import { brand } from '@safe-global/brand'

const overrideComponents: MDXComponents = {
  a: CustomLink,
}

const PrivacyPolicy: NextPage = () => (
  <Legal title="Privacy policy" href={brand.privacyUrl}>
    <MarkdownContent>
      <SafePrivacyPolicy components={overrideComponents} />
    </MarkdownContent>
  </Legal>
)

export default PrivacyPolicy
