<template>
  <div class="app-container">
    <div class="el-col-12" style="display: flex; flex-flow:column; height: 100%">
      <el-button @click="doExecutePhp()">执行</el-button>
      <codemirror style="flex: 1" ref="codeMirrorEditor" v-model="code" :options="cmOptions">
      </codemirror>
    </div>

    <div class="el-col-12">
      <iframe ref="output"></iframe>
    </div>
  </div>
</template>

<script>
import {executePhp} from "@/api/message-board";
import 'codemirror/mode/php/php.js'
// closebrackets
import 'codemirror/theme/base16-light.css'
import 'codemirror/addon/edit/closebrackets.js'

export default {
  name: 'Php',
  data() {
    return {
      code: '',
      resultSrc: '',
      cmOptions: {
        mode: 'text/x-java',  //Java语言
        theme: "base16-light", // 默认主题
        autofocus: true,
        lineNumbers: true,   //显示行号
        smartIndent: true, // 自动缩进
        autoCloseBrackets: true// 自动补全括号
      }
    }
  },
  methods: {
    doExecutePhp() {
      const code = this.code
      this.$refs['output'].src = `${process.env.VUE_APP_BASE_API}/message-board/php?code=${code}`
    }
  }
}
</script>

<style>
.vue-codemirror {
}

.CodeMirror * {
  font-size: 20px;
  line-height: 150%;
}

</style>
