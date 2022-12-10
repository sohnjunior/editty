const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/web-components',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, '../src/')
    config.resolve.alias['@atoms'] = path.resolve(__dirname, '../src/components/atoms')
    config.resolve.alias['@layouts'] = path.resolve(__dirname, '../src/components/layouts')
    return config
  },
}
