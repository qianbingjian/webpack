const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const POST = process.env.PORT || '8000'

module.exports = merge(baseWebpackConfig,{
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
  plugins: [
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['Your application is running...']
      }
    })
  ]
})