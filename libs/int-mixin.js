export default {
  beforeDestroy () {
    if (window.Z.global) {
      window.Z.global.subscribe.oneUnBind(this)
    }
  },
  destroyed () {
    if (window.Z.global) {
      window.Z.global.subscribe.trigger('vue-component-destroyed')
    }
  },
  data () {
    return {
      // useCurrentRegion: window.Z.global.auth.getRegion().id,
      // useConfigChangeCount: 0
    }
  },
  mounted () {

  },
  computed: {

  },
  created () {

  },
  methods: {

  }
}
