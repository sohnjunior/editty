const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: './tsconfig.json', extensions: ['.js', '.ts'] }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'esbuild-loader', options: { minify: true } },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
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
}
