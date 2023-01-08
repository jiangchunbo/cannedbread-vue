<template>
  <div class="app-container" style="height: 100%">
    <el-tabs v-model="activeName" style="height: 100%">
      <el-tab-pane label="英雄的远征" name="英雄的远征">
        <heroic-expeditions/>
      </el-tab-pane>
      <el-tab-pane label="海战" name="second">海战</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HeroicExpeditions from '@/views/war3/components/HeroicExpeditions';

export default {
  components: {HeroicExpeditions},
  data() {
    return {
      activeName: '英雄的远征'
    }
  }
}
</script>

<style>

.el-tabs__content {
  height: calc(100% - 55px);
  overflow-y: auto;
}
</style>

