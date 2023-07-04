<template>
  <section class="app-main">
    <keep-alive>
      <router-view v-if="$route.meta && !$route.meta.cacheIframe && !$route.meta.noCache"/>
    </keep-alive>
    <router-view v-if="$route.meta && !$route.meta.cacheIframe && $route.meta.noCache"/>

    <component
      :is="item.name"
      v-for="item in hasOpenComponentsArr"
      v-show="$route.name === item.name"
      :key="item.name"/>
  </section>
</template>

<script>
import Vue from 'vue'
import store from '@/store'

export default {
  name: 'AppMain',
  data() {
    return {
      iframeComponents: []
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    // 实现懒加载，只渲染已经打开过（hasOpen:true）的iframe页
    hasOpenComponentsArr() {
      return this.iframeComponents.filter(item => item.hasOpen)
    }
  },
  watch: {
    $route() {
      this.isOpenIframePage()
    }
  },
  created() {
    const iframeComponents = this.getIframeComponents()
    console.log('iframeComponents', iframeComponents)
    iframeComponents.forEach(item => {
      Vue.component(item.name, item.component)
    })
    this.iframeComponents = iframeComponents
  },
  methods: {
    // 根据当前路由设置hasOpen
    isOpenIframePage() {
      const target = this.iframeComponents.find(item => {
        return item.name === this.$route.name
      })
      if (target && !target.hasOpen) {
        target.hasOpen = true
      }
    },
    getIframeComponents() {
      const routes = store.getters.asyncRoutes
      const iframeRoutes = routes.filter(item => {
        return item.children && item.children.length === 1 &&
          item.children[0].meta &&
          item.children[0].meta.cacheIframe
      })
      return iframeRoutes.map((item) => {
        const route = item.children[0]
        return {
          name: route.name,
          path: item.path + route.path,
          hasOpen: false, // 是否打开过，默认false
          component: route.component // 组件文件的引用
        }
      })
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
