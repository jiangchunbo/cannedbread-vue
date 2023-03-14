<template>
  <div class="app-container">
    <el-link :href="bindWorkWeixinUrl">绑定到第三方</el-link>
  </div>
</template>

<script>

export default {
  data() {
    return {
      bindWorkWeixinUrl: ''
    }
  },
  mounted() {
    this.$axios.get('/work-weixin/qrConnect', {
      params: {
        userId: this.$store.getters.id
      }
    }).then((res) => {
      console.log(res)
      const { data } = res
      this.bindWorkWeixinUrl = data
    })
  },
  created() {
  },
  methods: {}
}
</script>
