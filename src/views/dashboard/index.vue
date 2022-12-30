<template>
  <div class="dashboard-container">
    <user-ranking-list class="el-col-8"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
