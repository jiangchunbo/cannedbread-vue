<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <iframe ref="iframe" style="height: calc(100vh - 50px); width: 100%; border: none;" src="http://yapi.jiangchunbo.com" />
  </div>
</template>

<script>
export default {
  name: 'Yapi',
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.loading = true
    this.$refs.iframe.onload = () => {
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
