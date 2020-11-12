const Base64 = require('js-base64').Base64
export default {
  // 将指定字符串去掉变驼峰
  turnKey (str, reg = /_\w/g) {
    return str.replace(reg, (a) => {
      return a.split('')[1].toUpperCase()
    })
  },
  // 将指定字符串去掉变驼峰
  turnKeyData (data, reg = /_\w/g) {
    if (Array.isArray(data)) {
      return data.forEach(item => {
        this.turnKeyData(item, reg)
      })
    }
    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        const turnKey = this.turnKey(key, reg)
        this.turnKeyData(data[key])
        if (turnKey !== key) {
          data[turnKey] = data[key]
          delete data[key]
        }
      })
    }
  },
  // 去除空值
  clearEmpty (data) {
    Object.keys(data).forEach(key => {
      const item = data[key]
      if (item === null || item === undefined || item === '') delete data[key]
    })
  },
  // 获取URL参数转为对象
  getUrlQuery (url) {
    const query = {}
    // 检查问号的位置
    const index = url.indexOf('?')
    if (index === -1) return {}
    // 获取第一个文号后面的
    url = url.slice(index + 1)
    // 双问号处理 忽略第二个问号的
    url = url.split('#')[0]
    // &拆分
    url.split('&').forEach(queryItem => {
      const index = queryItem.indexOf('=')
      if (index === -1) return
      query[queryItem.slice(0, index)] = queryItem.slice(index + 1)
    })
    return query
  },
  // 将对象转url query
  turnQueryUrl (data, clearEmpty = true) {
    let rt = ''
    if (data) {
      for (const key in data) {
        const keyName = data[key]
        if (clearEmpty) {
          if (keyName === '' || keyName === undefined || keyName === null) continue
        }
        if (rt) rt += '&'
        rt += key + '=' + encodeURIComponent(keyName)
      }
    }
    return rt
  },
  // 给url添加query 参数
  addQueryUrl (url, params, clearEmpty = true) {
    if (!params) return url
    if (typeof params === 'object') {
      params = this.turnQueryUrl(params, clearEmpty)
    }
    url += url.indexOf('?') > -1 ? '&' : '?'
    return url + params
  },
  // 字符串截断处理
  doSplitJoin (str, len = 3) {
    const decimal = (str + '').split('.')[1]
    let showStr = (str + '').split('.')[0]
    showStr = showStr.split('').reverse().join('')
      .replace(/./g, (a, i) => ((i + 1) % len) ? a : (a + ','))
      .replace(/,$/, '').split('').reverse().join('')
    if (decimal) {
      showStr += '.' + decimal
    }
    return showStr
  },
  /**
   * 对象转url参数
   * @param {*} data
   * @param {*} isPrefix
   */
  urlencode (data, isPrefix = false) {
    const prefix = isPrefix ? '?' : ''
    const _result = []
    for (const key in data) {
      const value = data[key]
      // 去掉为空的参数
      if (['', undefined, null].includes(value)) continue
      if (value.constructor === Array) {
        value.forEach(_value => {
          _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
        })
      } else {
        _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }
    return _result.length ? prefix + _result.join('&') : ''
  },
  /**
   * 获取字符长度
   * @param {*} data
   * @return {Number}
   */
  getLength (data) {
    // 中文算2个 其他算一个
    // 总长度 * 2 减去英文字符长度
    return data.length * 2 - data.replace(/[^\w~`!@#$^&*()\-+=[\]{}\\|;':",./<>?]/g, '').length
  },
  /**
   * 获取模板字符
   * @param template 模板字符串
   * @param data 模板数据
   * @return {Number}
   */
  getTemplateText (template, data) {
    if (!data || !template) return template
    return template.replace(/\${[^}]+}/g, text => {
      const key = text.slice(2, -1)
      if (key in data) return data[key]
      return text
    })
  },
  split (text, split = ',') {
    if (Array.isArray(text)) return text
    if (!text || typeof text !== 'string') return []
    return text.split(split)
  },
  /**
   * 脱敏显示
   * @param value
   * @param fillDesensitization 脱敏规则
   * @return {string}
   */
  showDesensitization (value, fillDesensitization) {
    if (!value || !fillDesensitization) return ''
    if (value.length < fillDesensitization.length) {
      fillDesensitization = fillDesensitization.replace(Array(fillDesensitization.length - value.length).fill('*').join(''), '')
      console.log('fillDesensitization', fillDesensitization, value)
    }
    return fillDesensitization.replace(/./g, (split, index) => {
      if (/[xX]/.test(split)) {
        return value[index]
      } else {
        return split
      }
    })
  },
  /**
   * 截断字符串显示
   * @param {string} names
   * @param {num} length
   */
  doSortNames (names, length = 15) {
    if (!names) return ''
    if (typeof names === 'string') {
      return names.length > length ? names.slice(0, length - 1) + '…' : names
    }
    return names.map(name => name.length > length ? name.slice(0, length - 1) + '…' : name)
  },
  /**
   * Base64 decode
   * @param str
   */
  base64Decode (str) {
    return Base64.decode(str)
  },
  /**
   * Base64 encode
   * @param str
   */
  base64Encode (str) {
    return Base64.encode(str)
  }
}
