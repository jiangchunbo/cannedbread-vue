<template>
  <div class="app-container" style="height: 100%">
    <div class="php-tool-bar">
      <el-button size="small" :loading="loading" @click="doExecutePhp()">执行</el-button>
    </div>
    <codemirror
      ref="codeMirrorEditor"
      v-model="code"
      style="height: 60%"
      class="php-codemirror codemirror-left-container"
      :options="cmOptions"
      @ready="onCodemirrorReady"
    />
    <codemirror
      v-model="resultSrc"
      v-loading="loading"
      style="height: 30%"
      class="php-codemirror  codemirror-right-container"
      :options="resultOptions"
    />
  </div>
</template>

<script>
import 'codemirror/mode/php/php.js'
// closebrackets
import 'codemirror/theme/base16-light.css'
import 'codemirror/addon/edit/closebrackets.js'

import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'

import { executePhp, getPhpExecutorConfig } from '@/api/basis'
import { Message } from 'element-ui'

export default {
  name: 'Php',
  data() {
    return {
      loading: false,
      code: '',
      resultSrc: '',
      phpExecutorConfig: {
        maxCodeLength: 1000
      },
      cmOptions: {
        mode: 'text/x-php', // Java语言
        theme: 'base16-light', // 默认主题
        autofocus: true,
        lineNumbers: true, // 显示行号
        smartIndent: true, // 自动缩进
        autoCloseBrackets: true, // 自动补全括号
        hintOptions: {
          completeSingle: false
        }
      },
      resultOptions: {
        mode: 'text/plain', // Java语言
        theme: 'base16-light' // 默认主题
      }
    }
  },
  mounted() {
    this.loadPhpExecutorConfig()
  },
  methods: {
    loadPhpExecutorConfig() {
      getPhpExecutorConfig().then(res => {
        const { data } = res
        this.phpExecutorConfig = {
          maxCodeLength: data.maxCodeLength
        }
      })
    },
    onCodemirrorReady(cm) {
      cm.on('keypress', () => {
        cm.showHint()
      })
    },
    doExecutePhp() {
      const code = this.code.trim()
      if (code === '') {
        this.$message({
          showClose: true,
          message: '请输入需要执行的 PHP 代码，再点击【执行】按钮',
          type: 'warning'
        })
        return
      }
      if (code.length > this.phpExecutorConfig.maxCodeLength) {
        this.$message({
          showClose: true,
          message: `PHP 代码长度不能超过 ${this.phpExecutorConfig.maxCodeLength}`,
          type: 'error'
        })
        return
      }
      this.loading = true
      this.resultSrc = ''
      executePhp(code).then(res => {
        const { data } = res
        this.resultSrc = data
      }).catch(error => {
        const { code, message } = error
        switch (code) {
          case 70003: // 退出码异常
          case 70004: // 执行中错误
            this.resultSrc = message
            break
          case 70002: // 代码太长
          case 40001: // 操作太频繁
            Message.error({
              message: message
            })
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
.php-tool-bar {
  height: 49px;
  line-height: 49px;
}

.php-codemirror {
  height: calc(100%);
}

.CodeMirror-hints {
  font-family: Consolas, monospace;
  font-size: 18px;
}

.php-codemirror .CodeMirror {
  font-family: Consolas, monospace;
  font-size: 18px;
  height: 100%;
}

.php-codemirror.codemirror-left-container {
  border: 1px solid #333;
  border-bottom: none;
}

.php-codemirror.codemirror-right-container {
  border: 1px solid #333;
}

</style>
