const path = require('path')
const BUILD_TYPE = process.env.BUILD_TYPE || 'www'

exports.resolve = (dir) => path.join(__dirname, '../..', dir)
exports.assetsPath = (_path) => path.posix.join('static', _path)

exports.getBuildType = function (endWith = '') {
  let useBuildType = '/'
  if (BUILD_TYPE !== 'auto') useBuildType += BUILD_TYPE
  return (useBuildType + endWith).replace(/\/+/g, '/')
}