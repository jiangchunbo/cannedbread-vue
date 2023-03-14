<template>
  <div class="app-container" style="height: 100%; overflow-y: auto">
    <p>试一试</p>
    <div style="height: 150px;">
      <codemirror
        style="border: 1px solid #aaa"
        ref="codeMirrorEditor"
        v-model="code"
        :options="cmOptions"
        @ready="onCodemirrorReady"
      />
    </div>
    <el-row style="height: 100px; padding: 10px 0">
      <el-col span="4">
        <div style="padding: 10px">
          <el-button size="small" :loading="loading" @click="doExecute()">执行</el-button>
        </div>
      </el-col>
      <el-col span="20" style="height: 100%">
        <codemirror
          style="border: 1px solid #aaa"
          v-model="outMessage"
          v-loading="loading"
          :options="resultOptions"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
// closebrackets
import 'codemirror/theme/base16-light.css'
import 'codemirror/addon/edit/closebrackets.js'

import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'

export default {
  name: 'JavaScriptExecutor',
  data() {
    return {
      loading: false,
      code: '',
      outMessage: '',
      resultSrc: '',
      phpExecutorConfig: {
        maxCodeLength: 1000
      },
      cmOptions: {
        mode: 'text/javascript',
        theme: 'base16-light',
        autofocus: true,
        lineNumbers: true,
        smartIndent: true,
        autoCloseBrackets: true,
        hintOptions: {
          completeSingle: false
        }
      },
      resultOptions: {
        mode: 'text/plain',
        theme: 'base16-light'
      }
    }
  },
  mounted() {
    console.log = (message) => {
      if (typeof message === 'object') {
        this.outMessage += (JSON && JSON.stringify ? JSON.stringify(message) : message)
      } else {
        this.outMessage += message
      }
    }
  },
  methods: {
    doExecute() {
      const code = this.code.trim()
      if (code === '') {
        this.$message({
          showClose: true,
          message: '请输入需要执行的 JavaScript 代码，再点击【执行】按钮',
          type: 'warning'
        })
        return
      }
      if (code.length > this.phpExecutorConfig.maxCodeLength) {
        this.$message({
          showClose: true,
          message: `JavaScript 代码长度不能超过 ${this.phpExecutorConfig.maxCodeLength}`,
          type: 'error'
        })
        return
      }
      this.loading = true
      this.outMessage = ''
      try {
        // eslint-disable-next-line no-eval
        eval(this.code)
      } catch (e) {
        this.outMessage = e.message
      } finally {
        this.loading = false
      }
    },
    onCodemirrorReady(cm) {
      cm.on('keypress', () => {
        cm.showHint()
      })
    }
  }
}
</script>

<style>
.javascript-codemirror {
  height: 100%;
}
</style>
