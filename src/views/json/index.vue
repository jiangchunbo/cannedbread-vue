<template>
  <div class="app-container" style="height: 100%">
    <div class="json-tool-bar">
      <el-button size="small" @click="remove">去转义</el-button>
      <el-button size="small" @click="formatJson">格式化</el-button>
    </div>
    <div class="el-row" style="height: calc(100% - 50px)">
      <div class="el-col-10" style="height: 100%">
        <codemirror
          v-model="rawJson"
          class="json-codemirror"
          :options="rowJsonCmOptions"
        />
      </div>
      <div class="el-col-14" style="height: 100%">
        <codemirror
          v-model="json"
          class="json-codemirror"
          :options="cmOptions"
        />
      </div>
    </div>
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
      rawJson: '{}',
      json: '{}',
      rowJsonCmOptions: {
        lineWrapping: true,
        mode: 'text/plain',
        theme: 'xq-light'
      },
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
      const rawJson = this.json
      const jsonObj = JSON.parse(rawJson)
      this.json = JSON.stringify(jsonObj, null, 4)
    },
    remove() {
      try {
        const rawJson = this.rawJson
        this.json = JSON.parse('[\"' + rawJson + '\"]')[0]
      } catch (error) {
        this.$message({
          message: error,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style>
.json-tool-bar {
  height: 49px;
  line-height: 49px;
}
.json-codemirror {
  height: calc(100%);
}

.json-codemirror .CodeMirror {
  height: 100%;
  border: 1px solid #000;
}
</style>
