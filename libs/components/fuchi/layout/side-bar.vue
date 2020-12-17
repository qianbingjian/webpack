<template>
  <div>
    <el-menu class="el-menu-vertical-demo collapsed-el-aside" unique-opened  @select="select" :default-active="currentRouter">
      <template v-for="(menu,index) in menuList">
        <fc-sub-menu :menu="menu" v-if="filterMenu(menu)" :key="index + 'key'"/>
      </template>
    </el-menu>
  </div>
</template>

<script>
import routes from '@/router/index'
export default {
  name: 'side-bar',
  title: '左侧菜单',
  desc: '左侧菜单的容器',
  data () {
    return {
      menuList: [],
      currentRouter: ''
    }
  },
  created () {
    this.initRoutes()
  },
  methods: {
    initRoutes(){
      this.menuList = routes.find(item => {
        return item.useInMenu
      }).children
     this.currentRouter = this.$route.path
    },
    filterMenu (menu) {
      return menu.name && menu.showMenu
    },
    select (path) {
      this.$router.push({
        path
      })
    }
  }
}
</script>

<style>

</style>