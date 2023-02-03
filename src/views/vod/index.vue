<template>
  <div class="app-container" style="height: 100%">
    <el-table
      style="max-height: 100%; overflow-y: auto"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="标题">
        <template slot-scope="scope">
          <a :href="scope.row.video">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="封面" width="400" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 300px"
            :src="scope.row.cover">
          </el-image>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {fetchVideoList} from "@/api/basis";

export default {
  name: 'Vod',
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchVideoList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
