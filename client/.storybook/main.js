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
    config.resolve.alias['@templates'] = path.resolve(__dirname, '../src/components/templates')
    config.resolve.alias['@molecules'] = path.resolve(__dirname, '../src/components/molecules')
    config.resolve.alias['@organisms'] = path.resolve(__dirname, '../src/components/organisms')
    return config
  },
}
