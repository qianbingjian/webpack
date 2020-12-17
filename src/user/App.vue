<template>
  <div id="app">
   <common-init />
   <router-view  v-if="hasReady"></router-view>
  </div>
</template>

<script>
import CommonInit from '~/libs/components/init'
export default {
  name: 'App',
  title:'App',
  desc: 'App',
  components: {
    CommonInit
  },
  data () {
    return {
      hasReady: false
    }
  },

  created () {
    this.doInit()
  },
  methods: {
    /**
     * @desc doinit
     */
    async doInit () {
      this.hasReady = true
    }
  },
  
}
</script>

<style lang="scss">
#app {
  margin: 0;
  height: 100%;
  font-size: 16px;
}
</style>