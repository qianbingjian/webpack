const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const utils = require('./utils')
const BUILD_TYPE = process.env.BUILD_TYPE || 'www'

module.exports = {
  context: path.resolve(__dirname, '../../src'),
  entry: '/' + BUILD_TYPE + '/main.js',
  output: {
    publicPath: '',
    filename: '[name].js',
    path: path.resolve(__dirname, '../../dist')
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.scss', '.less'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': utils.resolve(`src${utils.getBuildType()}`),
      '~': utils.resolve('')
    }
  },
  module: {
    rules: [
      {
        test: /\.(vue)$/,
        loader: path.join(__dirname, './standard-loaders'),
        include: [utils.resolve('src'), utils.resolve('libs/components')],
        enforce: 'pre',
        exclude: [
          utils.resolve('node_modules'),
          utils.resolve('libs/components/zqlian')
        ]
      },
      {
        test: /\.(js|vue)$/,
        loader: path.join(__dirname, './loader'),
        include: [utils.resolve('src'), utils.resolve('libs')],
        enforce: 'pre',
        exclude: [utils.resolve('libs/plugins'), utils.resolve('src/screen/components/extend')]
      },
      {
        test: /\.vue$/,
        loader: path.join(__dirname, './vue-loader'),
        include: [utils.resolve('src'), utils.resolve('libs')],
        enforce: 'pre',
        exclude: [utils.resolve('libs/plugins'), utils.resolve('src/screen/components/extend')]
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [utils.resolve('src'), utils.resolve('libs'), utils.resolve('test'), utils.resolve('node_modules/quill-image-extend-module'), utils.resolve('node_modules/vue-async-computed')],
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /.s?css$/,
        use: ['style-loader', 'css-loader', 
        {loader:'postcss-loader',options:{postcssOptions: {plugins: [['postcss-preset-env']]}}},
        'sass-loader',
        {
          loader: 'sass-resources-loader',
          options: {
            // it need a absolute path
            resources: [path.resolve(__dirname, '../../src') + '/' + BUILD_TYPE + '/assets/css/_var.scss']
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../../src') + '/' + BUILD_TYPE + '/index.html',
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: utils.resolve(`src${utils.getBuildType()}`) + '/static',
          to: 'static'
        },
        {
          from: utils.resolve('libs/plugins'),
          to: 'plugins'
        }
      ]
    })
  ]
}