<template>
  <div>
    <el-form>
      <el-form-item label="输入字符串">
        <el-input v-model="originString" type="textarea" class="url-encode-textarea"/>
      </el-form-item>

      <el-form-item label="输出 Base64">
        <el-input v-model="outputBase64String" type="textarea" class="url-encode-textarea"/>
      </el-form-item>

      <el-form-item label="输入 Base64">
        <el-input v-model="inputBase64String" type="textarea" class="url-encode-textarea"/>
      </el-form-item>

      <img :src="imageSrc" alt=""/>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Base64Encode',
  data() {
    return {
      originString: '',
      inputBase64String: ''
    }
  },
  computed: {
    outputBase64String: function () {
      return window.btoa(this.originString)
    },
    imageSrc: function () {
      try {
        return 'data:image/jpeg;base64,' + this.inputBase64String
      } catch (error) {
        return ''
      }
    }
  }
}
</script>

<style scoped>

</style>
