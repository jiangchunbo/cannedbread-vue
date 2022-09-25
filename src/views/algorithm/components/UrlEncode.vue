<template>
  <div>
    <el-form>
      <el-form-item label="输入字符串">
        <el-input v-model="originString" type="textarea" class="url-encode-textarea" />
      </el-form-item>

      <el-form-item label="encodeURI 编码（不会对特殊符号编码）">
        <el-input v-model="encodeUriString" type="textarea" class="url-encode-textarea" />
      </el-form-item>

      <el-form-item label="encodeURIComponent 编码（会对特殊符号编码）">
        <el-input v-model="encodeUriComponentString" type="textarea" class="url-encode-textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UrlEncode',
  data() {
    return {
      originString: ''
    }
  },
  computed: {
    encodeUriString: function() {
      return encodeURI(this.originString)
    },
    encodeUriComponentString: function() {
      return encodeURIComponent(this.originString)
    }
  }
}
</script>

<style>
.url-encode-textarea textarea {
  height: 100px;
}

</style>
