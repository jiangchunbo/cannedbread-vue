<template>
  <div class="war3-container">
    <el-tabs v-model="activeName" type="border-card" class="war3-map-tabs" tab-position="top" style="height: 100%">
      <el-tab-pane label="英雄的远征" name="英雄的远征">
        <el-tabs :stretch="false" class="war3-tabs" type="border-card">
          <el-tab-pane label="装备词典">
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

.war3-container {
  height: 100%;
  padding: 0;
}

.war3-map-tabs {
  > .el-tabs__header {
    border-bottom: none;
  }

  .el-tabs__nav > .el-tabs__item {
    border: 1px #DCDFE6 solid;
  }

  > .el-tabs__content {
    padding: 0;

    > .el-tab-pane {
      height: 100%;
    }

    > div > .el-tabs {
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
  }

  .war3-tabs {
    height: 100%;
    > .el-tabs__content {
      height: calc(100% - 40px);
    }

    .el-tab-pane {
      /* 父元素存在 15px 上下内边距，pane 需要减掉，否则内部的组件设置 100% 会溢出 */
      height: calc(100% - 30px);
    }
  }
}

.war3-container .war3-map-tabs > .el-tabs__content {
  height: 100%;
}
</style>

