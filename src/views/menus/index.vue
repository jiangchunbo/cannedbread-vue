<template>
  <div class="app-container">
    <el-tree
      :data="menus"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :default-checked-keys="checkedKeys"
      @check-change="onCheckChange"
    >
    </el-tree>
  </div>
</template>
<script>
import {
  listMyMenusConfig,
  saveMyMenusConfig,
  setMenusVisible,
} from '@/api/menus'
import { buildRoutes } from '@/permission'
import { constantRoutes, resetRouter } from '@/router'

export default {
  name: 'Menus',
  data() {
    return {
      menus: [],
      checkedKeys: []
    }
  },
  mounted() {
    listMyMenusConfig().then((res) => {
      const { data } = res
      this.menus = data.routeList
      this.checkedKeys = data.checkedKeys
    })
  },
  methods: {
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
    saveMenusConfig(routeNames) {
      saveMyMenusConfig(routeNames).then((res) => {
      })
    },
    onClickSave() {
      const checkedNodes = this.getCheckedNodes()
      const routeNames = checkedNodes.map((item) => {
        return item.id
      })
      console.log(routeNames)
      this.saveMenusConfig(routeNames)
    },
    onCheckChange(node, checked) {
      setMenusVisible({
        params: {
          menuId: node.id,
          visible: checked
        }
      }).then((res) => {
        const { data } = res
        resetRouter()
        const newRoutes = buildRoutes(data.map(route => {
          return JSON.parse(route)
        }))
        console.log(newRoutes)
        this.$router.addRoutes(newRoutes)
        this.$store.commit('user/SET_ASYNC_ROUTES', newRoutes)
      })
    }
  },
}
</script>

<style>
</style>
