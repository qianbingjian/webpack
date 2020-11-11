const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const path = require('path')
const BUILD_TYPE = process.env.BUILD_TYPE || 'www'

const POST = process.env.PORT || '8000'

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    stats: 'errors-only',
    clientLogLevel: 'warning',
    historyApiFallback: true,
    disableHostCheck: true,
    publicPath: '/',
    hot: true,
    hotOnly: true,
    compress: true,
    host: '0.0.0.0',
    port: POST,
    open: 'http://localhost:' + POST,
    overlay: {
      warnings: true,
      errors: true
    },
    quiet: true // necessary for FriendlyErrorsPlugin
  },
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: ['style-loader', 'css-loader',
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
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['Your application is running...']
      }
    })
  ]
})
