import utilsString from '~/libs/service/utils/string'

const robotData = {}
const req = require.context('./', true, /^\.\/.*\.js$/)

function setKey (data, key, value) {
  key = key.replace(/^\.\//, '')
  const index = key.indexOf('/')
  if (index > 0) {
    let _key = key.slice(0, index)
    _key = utilsString.turnKey(_key, /([_-])\w/g)
    data[_key] = data[_key] || {}
    return setKey(data[_key], key.slice(index + 1), value)
  }
  key = key.replace(/\.js$/, '')
  key = utilsString.turnKey(key, /([_-])\w/g)
  data[key] = value
}

const requireAll = requireContext => {
  // eslint-disable-next-line array-callback-return
  return requireContext.keys().map(path => {
    (() => {
      if (path.indexOf('index') > -1) return
      const data = require('~/libs/service/utils' + path.slice(1))
      setKey(robotData, path, data.default || data)
    })()
  })
}
requireAll(req)
export default robotData
