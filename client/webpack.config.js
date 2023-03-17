const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, argv) => {
  const prod = argv.mode === 'production'

  return {
    mode: prod ? 'production' : 'development',
    devtool: prod ? 'hidden-source-map' : 'eval',
    entry: './src/index.ts',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.ts'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@elements': path.resolve(__dirname, 'src/components/elements'),
        '@molecules': path.resolve(__dirname, 'src/components/molecules'),
        '@layouts': path.resolve(__dirname, 'src/components/layouts'),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['babel-loader', 'ts-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react',
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/assets/favicon.ico',
        minify:
          process.env.NODE_ENV === 'production'
            ? {
                collapseWhitespace: true,
                removeComments: true,
              }
            : false,
      }),
      new CleanWebpackPlugin(),
    ],
    devServer: {
      port: 3000,
      hot: true,
    },
  }
}
