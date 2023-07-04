<template>
  <div class="url-encode-container">
    <el-form>
      <p>原文:</p>
      <el-input v-model="originString" type="textarea" class="textarea" />
      <p>
        <el-button type="primary" size="medium" @click="encode">编码</el-button>
        <el-button type="primary" size="medium" @click="decode">解码</el-button>
      </p>
      <p>encodeURI 编/解码结果:</p>
      <el-input v-model="encodeUriString" type="textarea" class="textarea" />
      <p>encodeURIComponent 编/解码结果:</p>
      <el-input v-model="encodeUriComponentString" type="textarea" class="textarea" />
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UrlEncode',
  data() {
    return {
      originString: '',
      encodeUriString: '',
      encodeUriComponentString: ''
    }
  },
  methods: {
    encode() {
      this.encodeUriString = encodeURI(this.originString)
      this.encodeUriComponentString = encodeURIComponent(this.originString)
    },
    decode() {
      this.encodeUriString = decodeURI(this.originString)
      this.encodeUriComponentString = decodeURIComponent(this.originString)
    }
  }
}
</script>

<style lang="scss">
.encode-container .url-encode-container {
  .encoded-container {
    margin-top: 10px;
  }

  textarea {
    height: 150px;
  }
}
</style>

