import fuchi from './fuchi'
import FcSubMenu from '~/libs/components/business/common/layout/menu/sub-menu'
export default {
  install (Vue, options) {
    Vue.use(fuchi, options)
    Vue.component('FcSubMenu', FcSubMenu)
  }
}
