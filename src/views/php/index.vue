<template>
  <div class="app-container" style="height: 100%; overflow-y: auto" >
    <div class="php-tool-bar">
      <el-button size="small" :loading="loading" @click="doExecutePhp()">执行</el-button>
    </div>
    <codemirror
      ref="codeMirrorEditor"
      v-model="code"
      style="height: 60%"
      class="php-codemirror code-editor-container"
      :options="cmOptions"
      @ready="onCodemirrorReady"
    />
    <el-row style="height: 400px; padding-bottom: 50px">
      <el-col :span="15" style="height: 100%">
        <p>标准输出:</p>
        <codemirror
          v-model="stdOut"
          v-loading="loading"
          style="height: 100%"
          class="php-codemirror std-out-container"
          :options="resultOptions"
        />
      </el-col>
      <el-col :offset="1" :span="8" style="height: 100%">
        <p>标准出错:</p>
        <codemirror
          v-model="stdErr"
          v-loading="loading"
          style="height: 100%"
          class="php-codemirror std-err-container"
          :options="resultOptions"
        />
      </el-col>
    </el-row>
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
      code: '<?php\r\n',
      resultSrc: '',
      stdOut: '',
      stdErr: '',
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
      this.stdOut = ''
      this.stdErr = ''
      executePhp(code).then(res => {
        const { data } = res
        this.stdOut = data.stdOut
        this.stdErr = data.stdErr
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
  margin-bottom: 10px;
}

.php-codemirror {
  height: calc(100%);
}

.CodeMirror-hints {
  font-family: Consolas, monospace;
  font-size: 18px;
}

.php-codemirror.code-editor-container {
  border: 1px solid #DCDEE2;
}

.php-codemirror.std-err-container {
  border: 1px solid #DCDEE2;
}

.php-codemirror.std-out-container {
  border: 1px solid #DCDEE2;
}

</style>
