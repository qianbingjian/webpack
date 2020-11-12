const subscribe = {}
const handlers = {}
const readyHandler = {}
/*
* 订阅模式 事件驱动
* bind 发起事件监听
* trigger 触发事件执行
* ready 发起事件监听 包括已发生的事件
* readyOnce 只触发一次事件
* unbind 解绑
* clearBind 移除绑定
* */

/*
* 用于事件监听及触发
* params
*  type 事件名称 任意自定义  必须
*  func 1.如果为函数 则是监听事件  不需要第三参数  2.否则是触发对应的ready事件
*  done 预留的参数对象
*
* */
subscribe.ready = function (type, func, done) {
  const handler = readyHandler[type] = readyHandler[type] || {}
  if (typeof func === 'function') {
    subscribe.bind('ready-' + type, func)
    if (handler.isReady) {
      func && func(handler.data, handler.done)
    }
  } else {
    handler.data = func
    handler.done = done
    handler.isReady = true
    subscribe.trigger('ready-' + type, handler.data, handler.done)
    if (handler.once) {
      handler.once.forEach(function (a) {
        try {
          a(handler.data, handler.done)
        } catch (e) {
          console.error(e)
        }
      })
      handler.once = []
    }
  }
}
/*
* 用于事件触发
* 只触发一次ready效果
*
* */
subscribe.readyOnce = function (type, func) {
  const handler = readyHandler[type] = readyHandler[type] || {}
  if (typeof func === 'function') {
    if (handler.isReady) {
      func && func(handler.data, handler.done)
    } else {
      handler.once = handler.once || []
      handler.once.push(func)
    }
  }
}
/*
* 用于事件绑定
* param
*  event 事件名称 必须
*  func 监听函数 必须
*
* */
subscribe.bind = function (event, func) {
  if (func) {
    const handler = handlers[event] = handlers[event] || []
    if (handler.indexOf(func) >= 0) {
      return false
    }
    handler.push(func)
  }
}
/*
* 用于bind的解绑
*
* */
subscribe.unbind = function (event, func) {
  if (func) {
    const handler = handlers[event]
    if (handler) {
      const index = handler.indexOf(func)
      if (index >= 0) {
        handler.splice(index, 1)
      }
    }
  } else {
    handlers[event] = []
  }
}
/*
* 用于清除bind的解绑
*
* */
subscribe.clearBind = function (func) {
  if (func) {
    for (const key in handlers) {
      const o = handlers[key]
      let index
      if (o && o.length) {
        index = o.indexOf(func)
        if (index >= 0) {
          o.splice(index, 1)
          return
        }
      }
    }
    for (const key in readyHandler) {
      const o = readyHandler[key].once
      let index
      if (o && o.length) {
        index = o.indexOf(func)
        if (index >= 0) {
          o.splice(index, 1)
          return
        }
      }
    }
  }
}
/*
* 用于触发bind绑定是事件
* param
*  event 事件名称 必须
*  data , options 都是触发事件给的参数
*
* */
subscribe.trigger = function (event, data, options) {
  // console.log('trigger --' + event)
  const handler = handlers[event]
  let nextStatus
  let res
  handler && handler.forEach(function (a) {
    try {
      const sts = a(data, options)
      if (sts !== undefined) res = sts
      if (sts === false) {
        nextStatus = false
      }
    } catch (e) {
      console.error(e)
    }
  })
  if (nextStatus === false) return res
  const reg = /\.\w+$/
  if (reg.test(event)) {
    subscribe.trigger(event.replace(reg, ''), data, options)
  }
  return res
}

/*
* 已下方法是针对vue 小程序等做出的封装
* 事件都绑定到每个组件上 方便于事件销毁 防止内存泄漏
* subscribeObj 默认组件
* subscribeHandler 用于存储组件上绑定的事件列表
* */
subscribe.oneReady = function (type, func, oneObj) {
  oneObj = oneObj || subscribe.subscribeObj
  oneObj.subscribeHandler = oneObj.subscribeHandler || []
  oneObj.subscribeHandler.push(func)
  subscribe.ready(type, func)
}
subscribe.oneReadyOnce = function (type, func, oneObj) {
  oneObj = oneObj || subscribe.subscribeObj
  oneObj.subscribeHandler = oneObj.subscribeHandler || []
  oneObj.subscribeHandler.push(func)
  subscribe.readyOnce(type, func)
}
subscribe.oneBind = function (type, func, oneObj) {
  oneObj = oneObj || subscribe.subscribeObj
  oneObj.subscribeHandler = oneObj.subscribeHandler || []
  oneObj.subscribeHandler.push(func)
  subscribe.bind(type, func)
}
subscribe.oneUnBind = function (oneObj) {
  oneObj = oneObj || subscribe.subscribeObj
  const subscribeHandler = oneObj.subscribeHandler
  if (subscribeHandler) {
    subscribe.subscribeObj = null
    subscribe.subscribeHandler = null
    subscribeHandler.forEach(function (a) {
      subscribe.clearBind(a)
    })
  }
}
module.exports = subscribe
