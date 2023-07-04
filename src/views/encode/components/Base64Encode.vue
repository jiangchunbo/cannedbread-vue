<template>
  <div class="base64-encode-container">
    <el-form>
      <p>输入字符串:</p>
      <el-input v-model="inputString" type="textarea" class="textarea" />
      <p>
        <el-button type="primary" size="medium" @click="encode">编码</el-button>
        <el-button type="primary" size="medium" @click="decode">解码</el-button>
      </p>
      <p>输出 Base64:</p>
      <el-input v-model="outputString" type="textarea" class="textarea" />
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Base64Encode',
  data() {
    return {
      inputString: '',
      outputString: ''
    }
  },
  methods: {
    encode() {
      this.outputString = new Buffer(this.inputString).toString('base64')
    },
    decode() {
      this.outputString = Buffer.from(this.inputString, 'base64')
    }
  }
}
</script>

<style lang="scss">
.encode-container .base64-encode-container {
  .encoded-container {
    margin-top: 10px;
  }

  textarea {
    height: 150px;
  }
}
</style>
