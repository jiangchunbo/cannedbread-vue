<template>
  <div class="dashboard-container">
    <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <user-ranking-list ref="userRankingList"/>
    </el-col>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import UserRankingList from '@/views/dashboard/components/UserRankingList';

export default {
  name: 'Dashboard',
  components: {
    UserRankingList
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.userRankingList.refreshUserRankingList()
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
