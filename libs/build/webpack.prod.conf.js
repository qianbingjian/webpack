const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const path = require('path')
const utils = require('./utils')
const BUILD_TYPE = process.env.BUILD_TYPE || 'www'

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: utils.resolve('dist'),
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              // it need a absolute path
              resources: [path.resolve(__dirname, '../../src') + '/' + BUILD_TYPE + '/assets/css/_var.scss']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CssMinimizerPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 200000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 200000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})
