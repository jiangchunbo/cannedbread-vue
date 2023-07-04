<template>
  <div class="sha1-container">
    <el-form>
      <p>输入字符串:</p>
      <el-input v-model="inputString" type="textarea" class="textarea" @input="hash" />
      <p>输出字符串（十六进制）:</p>
      <el-input v-model="outputString" type="textarea" class="textarea" />
    </el-form>
  </div>
</template>

<script>
import sha1 from 'crypto-js/sha1'

export default {
  name: 'Sha1',
  data() {
    return {
      inputString: '',
      outputString: ''
    }
  },
  methods: {
    hash() {
      this.outputString = sha1(this.inputString)
    }
  }
}
</script>

<style lang="scss">
.hash-container .sha1-container {
  .encoded-container {
    margin-top: 10px;
  }

  textarea {
    height: 150px;
  }
}
</style>
