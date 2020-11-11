// https://github.com/michael-ciniawsky/postcss-load-config
let config = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "autoprefixer": {}
  }
}
// if (process.env.BUILD_TYPE === 'www') {
//   config.plugins['postcss-pxtorem'] = { "rootValue": 16, "propList": ["*"] }
// }
module.exports = config
