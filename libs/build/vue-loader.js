
// 禁止在template 中使用this

const regexp = /<template[\s\S]*\bthis\.[\s\S]*<\/template>/m
function loader (text, map) {
  if (regexp.test(text)) {
    return this.callback(new Error([this.resourcePath, '包含非法字段使用 - \'|"this.'].join('\n')))
  }
  return text
}
module.exports = loader
