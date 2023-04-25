const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    ...common.plugins,
    new CopyPlugin({
      patterns: [{ from: 'public/assets/images', to: 'assets/images' }],
    }),
  ],
})
