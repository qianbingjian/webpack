<template>
  <el-container>
    <el-header class="layout-top-bar flex-center">header</el-header>
  </el-container>
</template>

<script>
export default {
  name: 'top-bar',
  title: '页面头部',
  desc: '页面头部',
  props: {
     menuReady:{
       type: Function
     }
  },
  created () {
    this.$emit('menuReady')
  }
}
</script>

<style lang="scss">
.layout-top-bar{
  background: $theme-color;
  justify-content: left;
}
</style>