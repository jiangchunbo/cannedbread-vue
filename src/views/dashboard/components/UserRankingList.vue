<template>
  <el-card>
    <el-table
      :data="userRankingList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="nickname"
        label="昵称"
        width="180"
      >
        <template slot-scope="scope">
          <div style="height: 24px; line-height: 24px">
            <svg v-if="scope.$index === 0" class="rank-icon" aria-hidden="true">
              <use xlink:href="#icon-金牌" />
            </svg>
            <svg v-if="scope.$index === 1" class="rank-icon" aria-hidden="true">
              <use xlink:href="#icon-银牌" />
            </svg>
            <svg v-if="scope.$index === 2" class="rank-icon" aria-hidden="true">
              <use xlink:href="#icon-铜牌" />
            </svg>
            <span v-if="scope.$index > 2" style="display: inline-block;" class="rank-icon"/>
            <span style="display: inline-block; vertical-align: top; height: 24px; margin-left: 10px">
              {{ scope.row.nickname }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="points"
        label="积分"
      />
    </el-table>
  </el-card>
</template>

<script>
import {fetchUserRankingList} from '@/api/dashboard'

export default {
  name: 'UserRankingList',
  data() {
    return {
      userRankingList: []
    }
  },
  mounted() {
    this.refreshUserRankingList()
  },
  methods: {
    refreshUserRankingList() {
      fetchUserRankingList().then(res => {
        this.userRankingList = res.data
      })
    }
  }
}
</script>

<style scoped>
.rank-icon {
  width: 24px;
  height: 24px;
}

</style>
