<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中">
    <iframe
      ref="blogIframe"
      style="height: calc(100vh - 50px); width: 100%; border: none; z-index: -99;"
      src="http://blog.jiangchunbo.com"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.loading = true
    this.$refs.blogIframe.onload = () => {
      this.loading = false
    }
  },
  methods: {}
}
</script>

<style scoped>
</style>

