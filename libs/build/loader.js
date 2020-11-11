const regexp = /佛山|广东|长沙|云南|海珠|北京|经开区/m
function loader (text, map) {
  if (regexp.test(text)) {
    return this.callback(new Error([this.resourcePath, '包含非法区划字符'].join('\n')))
  }
  return text
}
module.exports = loader