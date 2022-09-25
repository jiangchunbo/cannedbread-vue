<template>
  <div>
    <el-form>
      <el-form-item label="输入字符串">
        <el-input v-model="originString" type="textarea" class="url-encode-textarea" />
      </el-form-item>

      <el-form-item label="32位 小写">
        <el-input v-model="md5Uppercase32" type="textarea" class="url-encode-textarea" />
      </el-form-item>

      <el-form-item label="32位 大写">
        <el-input v-model="md5Lowercase32" type="textarea" class="url-encode-textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'crypto-js/md5'

export default {
  name: 'Md5Digest',
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

<style scoped>

</style>
