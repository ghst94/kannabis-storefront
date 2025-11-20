import type { Meta, StoryObj } from "@storybook/react"

import { Hero } from "./Hero"

const meta: Meta<typeof Hero> = {
  component: Hero,
  decorators: (Story) => <Story />,
}

export default meta
type Story = StoryObj<typeof Hero>

export const FirstStory: Story = {
  args: {
    heading: "Snag your style in a flash",
    paragraph: "Buy and discover premium cannabis from the best brands.",
    image: "/images/hero/Image.jpg",
    buttons: [
      { label: "Shop now", path: "#" },
    ],
  },
}
