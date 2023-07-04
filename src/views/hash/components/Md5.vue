<template>
  <div class="md5-container">
    <el-form>
      <p>输入字符串:</p>
      <el-input v-model="originString" type="textarea" class="url-encode-textarea" />
      <p>32位 小写:</p>
      <el-input v-model="md5Uppercase32" type="textarea" class="url-encode-textarea" />
      <p>32位 大写:</p>
      <el-input v-model="md5Lowercase32" type="textarea" class="url-encode-textarea" />
    </el-form>
  </div>
</template>

<script>
import md5 from 'crypto-js/md5'

export default {
  name: 'Md5',
  data() {
    return {
      originString: ''
    }
  },
  computed: {
    md5Uppercase32: function() {
      if (this.originString.length === 0) {
        return ''
      }
      return md5(this.originString).toString()
    },
    md5Lowercase32: function() {
      if (this.originString.length === 0) {
        return ''
      }
      return md5(this.originString).toString().toUpperCase()
    }
  }
}
</script>

<style lang="scss">
.hash-container .md5-container {
  textarea {
    height: 150px;
  }
}
</style>
