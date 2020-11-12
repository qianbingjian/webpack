/* eslint-disable prefer-promise-reject-errors */
/**
 * @file 统一的http 请求处理
 * @module service/utils/fetch
 */
import axios from 'axios'
const pako = require('pako')
axios.defaults.withCredentials = true
let usePost

// 转化GET请求，data参数为url地址参数
const formatGET = (config) => {
  const data = config.data
  if (['get'].indexOf(config.method.toLowerCase()) > -1 && data &&
    config.url.indexOf('?') < 0
  ) {
    config.url = config.url + '?' + Object.keys(data).map(
      (key) => {
        if (data[key] === '' || data[key] === null || data[key] === undefined) return null
        return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
      }
    ).filter(
      (item) => (item !== null && item !== undefined)
    ).join('&')
  }
  return config
}

const setZValue = (url) => {
  // monitor-web直接使用window.Z
  if (window.Z && window.Z.constant.isMonitor) {
    return window.Z
  } else {
    // 根据为url判断是否为skd请求
    const isSdkUrl = url.indexOf('/api/v2/monitor/') !== -1
    return isSdkUrl ? window.MZ : window.Z
  }
}
const setCONFIGValue = (url) => {
  // monitor-web直接使用window.Z
  if (window.Z && window.Z.constant.isMonitor) {
    return window.CONFIG
  } else {
    // 根据为url判断是否为skd请求
    const isSdkUrl = url.indexOf('/api/v2/monitor/') !== -1
    return isSdkUrl ? window.MTCONFIG : window.CONFIG
  }
}

// 是否包含请求前缀 http || https
function hasRquestPrefix (url) {
  if (url.indexOf('http') === 0) return true
  if (url.indexOf('//') === 0) return true
}

/**
 * Responsible for all HTTP requests.
 */

const fetch = {
  request (method, url, data, config) {
    const Z = setZValue(url)
    if (!url && typeof method === 'object') {
      url = method.url
      data = method.data || method.params
      method = method.method
    }
    // trim
    if (data && Z.global.utils) data = Z.global.utils.trim(data)
    method = method.toLowerCase()
    if (!navigator.onLine) {
      if (process.env.PLATFORM === 'mobile') {
        Z.global.message.error('网络异常，请确认你的手机处于联网状态！')
      } else {
        Z.global.message.error('网络异常，请确认你的电脑处于联网状态！')
      }
      Z.global.subscribe.trigger('loading', 0)
      return Promise.reject('网络异常，请确认你的电脑处于联网状态！')
    }
    data = data || {}
    return axios.request({ url, data, method, ...data._config, ...config })
  },

  get (url, data = {}, progress = false) {
    return this.request('get', url, data, progress)
  },

  post (url, data = {}, progress = false) {
    return this.request('post', url, data, progress)
  },

  put (url, data = {}, progress = false) {
    return this.request('put', url, data, progress)
  },

  delete (url, data = {}, progress = false) {
    return this.request('delete', url, data, progress)
  },

  /**
   * Init the service.
   */
  init () {
    axios.interceptors.request.use(config => {
      const Z = setZValue(config.url)
      // 更多的_config
      const _config = config._config || (config.data && config.data._config) || {}
      if (_config) {
        // 通过请求把参数绑定到config
        if (_config.configExtends) {
          Object.keys(_config.configExtends).forEach(key => {
            config[key] = _config.configExtends[key]
          })
        }
      }
      if (config.data) delete config.data._config

      config = formatGET(config)

      // FormData 才进行进度更新
      if (config.data instanceof FormData) {
        config.onUploadProgress = (progressEvent) => {
          const complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
          console.log('complete', complete)
          Z.global.subscribe.trigger('loading-text', `上传进度${complete}`)
        }
      }
      // 允许请求自带token
      let token = (_config && _config.token) || (Z && Z.global.auth && Z.global.auth.getToken())
      if (Z && Z.constant.isQa) {
        if (Z && Z.utils) token = Z.utils.auth.getToken(config, _config)
      }
      if (config.data instanceof FormData) config.headers['Content-Type'] = 'multipart/form-data'
      config.headers.token = token
      return config
    })

    // Intercept the response and…
    axios.interceptors.response.use(response => {
      const Z = setZValue(response.config.url)
      if (response.data.status === 302) {
        return
      }
      // 过滤掉多余的data层 将data list pagination 提升一级
      if (typeof response.data === 'object' && 'data' in response.data) {
        if (response.data.status) {
          const data = response.data.data
          response.data = data
          // 文字处理
          const text = JSON.stringify(response.data)
          const replaceText = text.replace(/\$\$variable\{\w+\}/g, match => {
            const key = match.replace(/\W/g, '').replace('variable', '')
            return Z.global.variable.getVariable(key)
          })
          response.data = JSON.parse(replaceText)
        }
      }
      return response.data
    },
    async error => {
      let Z
      let CONFIG
      if (!error.response) {
        Z = window.MZ || window.Z
        CONFIG = window.MTCONFIG || window.CONFIG
      } else {
        Z = setZValue(error.response.config.url)
        CONFIG = setCONFIGValue(error.response.config.url)
      }
      Z.global.subscribe.trigger('loading', 0)
      const errResponse = error.response
      const resData = errResponse && errResponse.data
      let errorMessage = resData && resData.message
      if (errorMessage) {
        // 返回非字符串
        if (typeof errorMessage !== 'string') {
          errorMessage = '系统繁忙，请稍后再试...'
        }
        // 屏蔽json式异常
        if (/^{[\w\W]*}^/.test(errorMessage)) {
          errorMessage = '系统繁忙，请稍后再试...'
        }
        // 屏蔽过长的异常
        if (errorMessage.length > 100) {
          errorMessage = '系统繁忙，请稍后再试...'
        }
      }
      const resStatus = errResponse && errResponse.status

      if (errResponse) {
        console.log('errResponse.config', errResponse.config)
        // 某些接口 异常不需要做处理
        if (errResponse.config) {
          if (errResponse.config.errorReturnNull === true) {
            return null
          }
          if (errResponse.config.errorHandler === false) {
            return Promise.reject({ status: resStatus, data: resData })
          }
        }
      }
      if (resStatus === 401) {
        console.log(401)
      } else {
        console.log(99)
      }
      return Promise.reject(error)
    })
  }
}
// function showErrorMessage (errorMessage, Z) {
//   if (/^<[\s\S]+>$/.test(errorMessage)) {
//     return Z.global.message.confirm(errorMessage, '操作提示', {
//       dangerouslyUseHTMLString: true,
//       confirmButtonText: '我知道了',
//       type: 'warning',
//       showCancelButton: false
//     })
//   }
//   Z.global.message.error(errorMessage)
// }
fetch.init()

export default fetch.request
