import type { Meta, StoryObj } from '@storybook/react'
import { mswLoader } from 'msw-storybook-addon'
import { createMockStory } from '@/stories/mocks'
import IdSignInButton from './index'

const defaultSetup = createMockStory({})

const meta = {
  title: 'Features/OidcAuth/IdSignInButton',
  component: IdSignInButton,
  loaders: [mswLoader],
  tags: ['autodocs'],
  parameters: { ...defaultSetup.parameters },
  decorators: [defaultSetup.decorator],
} satisfies Meta<typeof IdSignInButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
