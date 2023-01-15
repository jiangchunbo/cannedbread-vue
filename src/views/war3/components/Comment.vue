<template>
  <div class="comment-container">
    <ul v-infinite-scroll="loadComments" style="overflow:auto">
      <li
        v-for="(comment, index) in commentList"
        :key="index">
        <comment-item :data="comment"/>
      </li>
    </ul>
  </div>
</template>

<script>
import CommentItem from "@/views/war3/components/CommentItem";

export default {
  name: 'Comment',
  components: {CommentItem},
  data() {
    return {
      start: 0,
      limit: 10,
      commentList: []
    }
  },
  mounted() {
    this.loadComments()
  },
  methods: {
    loadComments() {
      this.$axios2.get(`https://comment-api.reckfeng.com/api/v1/comment/search?sort=HOT&currentVersion=true&start=${this.start}&limit=${this.limit}&mapId=182869&_ag=0&_lang=cn`).then(res => {
        const {data} = res.data
        const rows = data.rows
        this.commentList.push(...rows)
        this.start += this.limit
      })
    }
  }
}
</script>

<style lang="scss">
.comment-container {
  height: 100%;
  > ul {
    height: 100%;
  }

  li {
    list-style: none;
  }
}
</style>
