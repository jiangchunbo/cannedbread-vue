<template>
  <el-card>
    <el-table
      :data="userRankingList"
      :span-method="arraySpanMethod"
      border
      style="width: 100%">
      <el-table-column
        prop="nickName"
        label="昵称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="points"
        label="积分">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {fetchUserRankingList} from "@/api/dashboard";

export default {
  name: 'UserRankingList',
  data() {
    return {
      userRankingList: []
    }
  },
  methods: {
    refreshUserRankingList() {
      fetchUserRankingList().then(res => {
        this.userRankingList = res.data
      })
    }
  },
  mounted() {
    this.refreshUserRankingList()
  }
}
</script>

<style scoped>

</style>
