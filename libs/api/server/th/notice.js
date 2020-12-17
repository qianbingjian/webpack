// 封装的项目接口
import fetch from '~/libs/service/utils/fetch'

export default {
  list: (params) => fetch('GET', '/api/v2/server/th/notice/list', params)
}
