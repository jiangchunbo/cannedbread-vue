<template>
  <div>
    <codemirror
      v-model="json"
      :options="cmOptions"
    />
    <el-button @click="remove">去转义</el-button>
    <el-button @click="formatJson">格式化</el-button>
  </div>
</template>

<script>
// 编辑器代码格式
import 'codemirror/mode/javascript/javascript'
// 支持括号自动匹配
import 'codemirror/addon/edit/closebrackets.js'

import 'codemirror/theme/xq-light.css'

import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'

import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/json-lint.js'
import jsonlint from 'jsonlint-mod'

window.jsonlint = jsonlint

import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/display/fullscreen.js'

export default {
  name: 'Json',
  data() {
    return {
      json: '{"id": 1234}',
      cmOptions: {
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        indentUnit: 4,
        lineNumbers: true,
        lineWrapping: false,
        fullScreen: false,
        lint: true,
        mode: 'application/json',
        theme: 'xq-light'
      }
    }
  },
  methods: {
    formatJson() {
      const json = this.json
      const jsonObj = JSON.parse(json)
      this.json = JSON.stringify(jsonObj, null, 4)
    },
    remove() {
      const json = this.json
      this.json = json.replace(/\\/g, '')
    }
  }
}
</script>

<style scoped>
</style>
