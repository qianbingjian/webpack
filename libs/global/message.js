/**
 * @file 各种提示的集合
 * @requires element-ui
 */
/**
 * @constant Message
 */
import { Message, MessageBox } from 'element-ui'

/**
 * 记录loading的元素
 */
let loadingEle
/**
 * 记录之前的弹出信息
 * @type {{}}
 */
const MessageCache = {}
function checkAble (type, message) {
  const cacheItem = MessageCache[type]
  if (cacheItem) {
    // 1秒内不重复显示提示
    if (cacheItem.message === message && Date.now() - cacheItem.time < 1000) {
      return false
    }
  }
  setCache(type, message)
  return true
}
function setCache (type, message) {
  MessageCache[type] = {
    message,
    time: Date.now()
  }
}
/**
 * info提示
 * @param {String} message 提示内容
 * @param {Object} options 更多配置
 * @returns {Object} VueComponent
 */
export function info (message, options) {
  if (checkAble('info', message)) {
    return Message({
      message,
      ...options
    })
  }
}

let successMessage
/**
 * success提示
 * @param {String} message 提示信息
 * @param {Object} options 更多配置
 * @returns {Object} VueComponent
 */
export function success (message, options) {
  if (checkAble('success', message)) {
    if (successMessage) successMessage.close()
    successMessage = Message.success({
      message,
      ...options
    })
    return successMessage
  }
}

/**
 * error提示
 * @param {String} message 提示信息
 * @param {Object} options 更多配置
 * @returns {Object} VueComponent
 */
export function error (message, options) {
  if (checkAble('error', message)) {
    return Message.error({
      message,
      ...options
    })
  }
}

/**
 * warning提示
 * @param {String} message 提示信息
 * @param {Object} options 更多配置
 * @returns {Object} VueComponent
 */
export function warning (message, options) {
  if (checkAble('warning', message)) {
    return Message.warning({
      message,
      ...options
    })
  }
}

/**
 * confirm提示
 * @param {String} message 提示信息
 * @param {Object} options 更多配置
 * @param {Object} params 更多参数
 * @returns {Promise<any>}
 */
export function confirm (options, message, params) {
  return window.Z.constant.vue.$confirm(options, message, params)
}

/**
 * prompt
 * @param {String} message 提示信息
 * @param {Object} options 更多配置
 * @param {Object} params 更多参数
 * @returns {Promise<any>}
 */
export function prompt (options, message, params) {
  return MessageBox.prompt(options, message, params)
}

/**
 * loading
 * @param {String} text 提示信息
 * @param {Object} options 更多配置
 * @returns {Promise<any>}
 */
export function loading (text, options) {
  if (text === 0) {
    if (loadingEle) loadingEle.close()
    return
  }
  loadingEle = window.Z.constant.vue.$loading({
    lock: true,
    text: text || '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    ...options
  })
  return loadingEle
}

/**
 * notify
 * @param {Object} options 更多配置
 * @param {Object} title 标题
 * @returns {Promise<any>}
 */
export function notify (options, title) {
  if (!options) return
  if (typeof options === 'string') {
    options = {
      title,
      message: options
    }
  }
  return window.Z.constant.vue.$notify({
    ...options
  })
}

/**
 * alert
 * @param {Object} options 更多配置
 * @param {Object} title 标题
 * @param {Object} message 提示信息
 * @returns {Promise<any>}
 */
// eslint-disable-next-line default-param-last
export function alert (message, title = '提示', options) {
  return window.Z.constant.vue.$alert(message, title, options)
}
