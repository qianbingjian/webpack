<template>
  <el-container id="layout">
    <el-container :style="containerStyle">
      <el-aside class="aside" width="225px"> 
        <side-bar v-if="menuHasReady"></side-bar>
      </el-aside>
      <el-main class="workplaceClass">
        <el-header class="header min-width" :style="headerHeight">
            <top-bar  @menuReady="menuReady"></top-bar>
         </el-header>
        <router-view />
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
import TopBar from "./top-bar";
import SideBar from "./side-bar";
export default {
  name: "layout-main",
  title: "整体页面",
  desc: "整体页面的布局",
  components: {
    TopBar,
    SideBar
  },
  data() {
    return {
      needActive: false,
      menuHasReady: false
    };
  },
  mounted() {},
  beforeDestroy() {
    window.Z.global.subscribe.oneUnBind(this);
  },
  computed: {
    headerHeight() {
      return {
        padding: 0,
        height: '60px',
      };
    },
    isWorkplace () {
      return this.$route.path === '/workplace'
    },
    containerStyle () {
      return {
        height: `calc(100%)`
      }
    },
  },
  methods: {
    menuReady () {
      this.menuHasReady = true
    }
  },
  created() {},
};
</script>

<style lang="scss" scoped>
#layout {
  height: 100%;
  background: #f5f5f5;
}

.header {
  color: #333;
  height: 75px;
  background-color: white;
  border-bottom: 1px solid #d8dce5;
}

.aside {
  background: #f9fafc;
  border-right: solid 1px #d8dce5;
}

.workplaceClass {
    margin: 0;
    padding: 0;
    background: #f5f5f5;
    box-shadow: none;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>
