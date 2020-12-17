<template>
  <el-submenu v-if="menu.children" :index="getMenuKey(menu)">
    <template>
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.name }}</span>
      </template>

      <div
        v-for="(cmenu, cindex) in menu.children"
        :index="getMenuKey(cmenu)"
        :key="cindex + 'key'"
      >
        <template v-if="filterMenu(cmenu)">
          <fc-sub-menu
            v-if="cmenu.children"
            :menu="cmenu"
          />
          <el-menu-item v-else size="mini" :index="getMenuKey(cmenu)">
            {{ cmenu.name }}
          </el-menu-item>
        </template>
      </div>
    </template>
  </el-submenu>

  <el-menu-item v-else size="mini" :index="getMenuKey(menu)">
     <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.name }}</span>
      </template>
  </el-menu-item>
</template>

<script>
export default {
  name: 'layout-sub-menu',
  title: '配置的菜单',
  desc: '后台配置的菜单',
  props:{
    menu: {
      type: Object,
      default: null,
      required: true
    }
  },
  methods: {
    getMenuKey(menu) {
      return menu.path
    },
    filterMenu(menu) {
      return menu.name && menu.showMenu
    },
  },
};
</script>

<style>
</style>