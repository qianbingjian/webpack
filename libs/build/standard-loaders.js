/**
 * 组件标准化
 * 每个组件需要包含 name, title, desc
 */
let hasError
function loader (text, map) {
  let scriptData = text.match(/<script>[\s\S]*<\/script>/m)
  if (scriptData && scriptData[0]) {
    scriptData = scriptData[0].match(/export default[\s\S]*}/m)
    scriptData = scriptData[0].replace('export default ', '')
    scriptData = scriptData.replace(/components: {[^}]+},?/m, '')
    scriptData = scriptData.replace(/directives: {[^}]+},?/m, '')
    // scriptData = scriptData.replace(/filters: {[^}]+},?/m, '')
    scriptData = scriptData.replace(/mixins:\s*\[[^\]]+],?/m, '')
    scriptData = scriptData.replace(/extends:\s*[^,}]+,?/m, '')
    scriptData = scriptData.replace(/.*mapState.*,?/g, '')
    scriptData = scriptData.replace(/\S*mapGetters\([^)]+\),?/mg, '')
    scriptData = scriptData.replace(/window.Z.global.variable.getVariable\('\w+'\)/g, '\'getVariable\'')
    scriptData = scriptData.replace(/(?<=[^'"])<(\w+)>(?!<\/\1>)[\s\S]*<\/\1>(?=[^'"])/g, '\'\'')
    scriptData = scriptData.replace(/\bHTMLElement/g, '\'HTMLElement\'')
    scriptData = scriptData.replace(/\bElement/g, '\'Element\'')
    scriptData = scriptData.replace(/\bPDFMethod.getPdfId\(\)/g, '\'pdfId\'')
    try {
      const jsonData = eval('(' + `${scriptData}` + ')')
      if (!jsonData.name || !jsonData.title || !jsonData.desc) {
        return this.callback(new Error([this.resourcePath, '没有定义标准组件描述name|title|desc'].join('\n')))
      }
    } catch (e) {
      if (!hasError) {
        hasError = true
        console.error('scriptData', scriptData)
      }
      return this.callback(new Error([this.resourcePath, e, '没有定义标准组件描述-解析错误'].join('\n')))
    }
  }
  return text
}
module.exports = loader
