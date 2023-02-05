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
} from "@/api/menus";
import { buildRoutes } from "@/permission";
import { constantRoutes } from "@/router";

export default {
  name: "Menus",
  data() {
    return {
      menus: [],
      checkedKeys: [],
    };
  },
  methods: {
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    saveMenusConfig(routeNames) {
      saveMyMenusConfig(routeNames).then((res) => {});
    },
    onClickSave() {
      const checkedNodes = this.getCheckedNodes();
      const routeNames = checkedNodes.map((item) => {
        return item.id;
      });
      console.log(routeNames);
      this.saveMenusConfig(routeNames);
    },
    onCheckChange(node, checked) {
      console.log(node);
      if (checked) {
        setMenusVisible({
          menuName: node.id,
          visible: checked,
        }).then((res) => {
          const { data } = res;
          const routes = [data];
          const newRoutes = this.$store.getters.asyncRoutes.slice(0);
          newRoutes.splice(-1, 0, ...buildRoutes(routes));
          this.$router.addRoutes(newRoutes);
          this.$store.commit("user/SET_ASYNC_ROUTES", newRoutes);
        });
      } else {
        setMenusVisible({
          menuName: node.id,
          visible: checked,
        }).then((res) => {
          const newRoutes = this.$store.getters.asyncRoutes.filter((item) => {
            return item.name !== node.id;
          });
          this.$store.commit("user/SET_ASYNC_ROUTES", newRoutes);
        });
      }
    },
  },
  mounted() {
    listMyMenusConfig().then((res) => {
      const { data } = res;
      this.menus = data.routeList;
      console.log(data.checkedKeys);
      this.checkedKeys = data.checkedKeys;
    });
  },
};
</script>
  
<style>
</style>
  