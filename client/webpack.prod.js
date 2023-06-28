const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    ...common.plugins,
    new CopyPlugin({
      patterns: [
        { from: 'public/assets/images', to: 'assets/images' },
        { from: 'public/assets/icons', to: 'assets/icons' },
        { from: 'public/assets/splash', to: 'assets/splash' },
        { from: 'public/sw.js', to: 'sw.js' },
        { from: 'public/manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
})
