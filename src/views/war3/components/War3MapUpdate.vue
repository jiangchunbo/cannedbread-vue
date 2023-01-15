<template>
  <div class="comment-container">
    <ul v-infinite-scroll="loadComments" style="overflow:auto">
      <li
        v-for="(update, index) in updateList"
        :key="index"
        v-html="update.content">
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'War3MapUpdate',
  data() {
    return {
      start: 0,
      limit: 10,
      updateList: []
    }
  },
  mounted() {
    this.loadComments()
  },
  methods: {
    loadComments() {
      this.$axios2.request({
        method: 'get',
        url: `https://map-api.reckfeng.com/api/v1/map/changelogs?`
          + `start=${this.start}&limit=${this.limit}&mapId=182869&_ag=0&_lang=cn`,
        headers: {
          token: '0292fa936f0ed1e218782256c544e794afb61375a885b359fa0e01346f0555ab35f3cdc9f82c917e8ad14b58ba8642b9'
        }
      }).then(res => {
        const {data} = res.data
        const rows = data.rows
        this.updateList.push(...rows)
        this.start += this.limit
      })
    }
  }
}
</script>

<style scoped>

</style>
