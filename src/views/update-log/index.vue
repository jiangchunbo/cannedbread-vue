<template>
  <div class="app-container update-log-container">
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(updateLog, index) in updateLogList"
        :key="index"
        :timestamp="updateLog.createTime"
        style="white-space: pre-line; line-height: 25px;"
      >
        {{ updateLog.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { fetchUpdateLogList } from '@/api/basis'

export default {
  name: 'UpdateLog',
  data() {
    return {
      reverse: true,
      updateLogList: []
    }
  },
  mounted() {
    this.renderUpdateLogList()
  },
  methods: {
    renderUpdateLogList() {
      fetchUpdateLogList().then(res => {
        const { data } = res
        this.updateLogList = data
      })
    }
  }
}
</script>

<style>
.update-log-container ul {
  padding-left: 0;
}
</style>
