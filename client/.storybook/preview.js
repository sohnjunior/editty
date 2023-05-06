import '@/global.css'
import { defineCustomElements } from '@/registry'

/**
 * ✅ setup web-component after generate storybook
 * @reference
 *  https://storybook.js.org/blog/declarative-storybook-configuration/
 */
defineCustomElements()

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
  },
}
