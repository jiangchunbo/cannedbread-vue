<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style>
.sidebar-container {
  box-shadow: 4px 2px 6px rgb(198 228 233 / 50%), -1px 0px 5px rgb(198 228 233 / 40%);
  background-image: linear-gradient(145deg, rgba(206,233,254,0.4) 0%, rgba(184,192,189,0.3) 25%, rgba(174, 183, 169, 0.09) 75%, rgba(205, 220, 226, 0.4) 100%), linear-gradient(240deg, rgba(0,0,0,0) 30%, rgba(184,192,189,0.1) 48%, rgba(214, 224, 228, 0.13) 54%, rgba(174,183,169,0.2) 60%, rgba(0,0,0,0) 80%);
}
</style>
