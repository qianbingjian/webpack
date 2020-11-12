
// 去除对象里 字符串两端的空格
export function trim (data) {
  if (data instanceof FormData || data instanceof File || data instanceof Blob) return data
  if (data) {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        data.forEach((cell, i) => {
          data[i] = trim(cell)
        })
      } else {
        for (const key in data) {
          data[key] = trim(data[key])
        }
      }
    } else if (typeof data === 'string') {
      return data.trim()
    }
  }
  return data
}
