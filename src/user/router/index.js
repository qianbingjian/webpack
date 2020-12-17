import Vue from 'vue'
import Router from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "layout" */ '~/libs/components/fuchi/layout/main'),
    useInMenu: true,
    children: [
      { path: '', redirect: '/workplace' },
      {
        path: '/workplace',
        component: () => import(/* webpackChunkName: "workplace" */ '@/views/workplace/index'),
        name: '工作台',
        icon: 'el-icon-s-home',
        showMenu: true
      },
      {
        name: '系统管理',
        path: '/sys',
        showMenu: true,
        component: { render: h => h('router-view') },
        children: [
          {
            name: '资源管理',
            path: '/sys/resource',
            showMenu: true,
            component: () => import(/* webpackChunkName: "sys" */ '@/views/sys/resource/index')
          }
        ]
      },
      {
        name: '组织管理',
        path: '/organization',
        showMenu: true,
        component: { render: h => h('router-view') },
        children: [
          {
            name: '组织管理',
            path: '/organization/organization',
            showMenu: true,
            component: () => import(/* webpackChunkName: "organization" */ '@/views/organization/organization/index')
          }
        ]
      }
    ]
  }
]

export default routes
