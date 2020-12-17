/**
* @file 查询区划的视图模板
* @author yun.wu
* header 头部显示区
* action 操作区
* content 主要内容区
* footer 底部显示区划
* 暂不支持动态切换
**/
<template>
  <div class="fc-tpl-main" :class="mainClass" :style="mainStyle">
    <div class="fc-tpl-main--header" v-if="hasHeader">
      <slot name="header"/>
    </div>
    <div class="fc-tpl-main--action fc-button-group flex-left" v-if="hasAction">
      <slot name="action"/>
    </div>
    <div class="fc-tpl-main--content scrollbar-none" :class="contentClass">
      <slot name="content"/>
    </div>
    <div class="fc-tpl-main--footer" v-if="hasFooter" :style="footerClass">
      <slot name="footer"/>
    </div>
    <slot/>
  </div>
</template>
<script>
  export default {
    name: 'fc-tpl-main',
    title: '视图模板',
    desc: '视图模板',
    props: {
      header: {
        type: String,
        default: 'big'
      },
      type: {
        type: String
      },
      border: {
        type: String
      }
    },
    data () {
      return {
        hasHeader: false,
        hasAction: false,
        hasContent: false,
        hasFooter: false
      }
    },
    computed: {
      contentClass () {
        let type = []
        if (this.hasHeader) type.push('header')
        if (this.hasAction) type.push('action')
        if (this.hasFooter) type.push('footer')
        let className = 'height'
        if (type.length) return className + '--' + type.join('-')
        return className + '-100'
      },
      mainClass () {
        return {
          'fc-tpl-main--header-big': this.header === 'big'
        }
      },
      mainStyle () {
        let style = {}
        if (this.type === 'full') style.padding = 0
        if (this.border) style.border = this.border
        return style
      },
      footerClass () {
        let style = {}
        if (this.type === 'full') {
          style.margin = 0
          style.width = '100%'
        }
        return style
      }
    },
    methods: {
      /**
       * 初始化显示 如果某个区划需要动态切换显示 可以主动调用此方法创新加载
       */
      init () {
        console.log('--------------------------------------------')
        this.hasHeader = this.$slots.header && this.$slots.header.length
        this.hasAction = this.$slots.action && this.$slots.action.length
        this.hasContent = this.$slots.content && this.$slots.content.length
        this.hasFooter = this.$slots.footer && this.$slots.footer.length
      }
    },
    created () {
      this.init()
    }
  }
</script>
