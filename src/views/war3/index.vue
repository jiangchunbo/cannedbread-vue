<template>
  <div class="app-container war3-container" style="height: 100%">
    <el-tabs v-model="activeName" class="war3-map-tabs" tab-position="left" style="height: 100%">
      <el-tab-pane label="英雄的远征" name="英雄的远征">
        <el-tabs :stretch="false" class="war3-tabs" type="border-card">
          <el-tab-pane style="width: 20px" label="装备词典">
            <heroic-expeditions />
          </el-tab-pane>
          <el-tab-pane label="评论区">
            <comment />
          </el-tab-pane>
          <el-tab-pane label="更新说明">
            <war3-map-update />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="海战" name="second">海战</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HeroicExpeditions from '@/views/war3/components/HeroicExpeditions'
import Comment from '@/views/war3/components/Comment'
import War3MapUpdate from '@/views/war3/components/War3MapUpdate'

export default {
  components: { HeroicExpeditions, Comment, War3MapUpdate },
  data() {
    return {
      activeName: '英雄的远征'
    }
  }
}
</script>

<style lang="scss">

.war3-container .war3-map-tabs > .el-tabs__content {
  height: 100%;
}

.war3-tabs {
  height: 100%;

  > .el-tabs__content {
    height: calc(100% - 40px);

    > div {
      height: 100%;
    }
  }
}

.el-tab-pane {
  height: 100%;
}
</style>

