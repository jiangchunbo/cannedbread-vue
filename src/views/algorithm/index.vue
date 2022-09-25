<template>
  <div class="app-container">
    <el-tabs tab-position="left">
      <el-tab-pane label="URL 编码">
        <url-encode />
      </el-tab-pane>
      <el-tab-pane label="MD5 摘要">
        <md5-digest />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UrlEncode from '@/views/algorithm/components/UrlEncode'
import Md5Digest from '@/views/algorithm/components/Md5Digest'

export default {
  name: 'Algorithm',
  components: {
    Md5Digest,
    UrlEncode
  },
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>
