<template>
  <div class="app-container" style="height: 100%">
    <div class="php-tool-bar">
      <el-button size="small" @click="doExecutePhp()">执行</el-button>
    </div>
    <codemirror
      ref="codeMirrorEditor"
      v-model="code"
      style="height: 60%"
      class="php-codemirror codemirror-left-container"
      :options="cmOptions"
      @ready="onCodemirrorReady"/>
    <codemirror
      v-model="resultSrc"
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

import {executePhp} from '@/api/basis'
import {Message} from 'element-ui'

export default {
  name: 'Php',
  data() {
    return {
      code: '',
      resultSrc: '',
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
        theme: 'base16-light' // 默认主题
      }
    }
  },
  mounted() {
  },
  methods: {
    onCodemirrorReady(cm) {
      cm.on('keypress', () => {
        cm.showHint()
      })
    },
    doExecutePhp() {
      const code = this.code
      if (code === '') {
        return
      }
      this.resultSrc = ''
      executePhp(code).then(res => {
        const {data, code} = res
        this.resultSrc = data
      }).catch(error => {
        const {code, message} = error
        if (code === 66666) {
          this.resultSrc = message
        } else if (code === 50000) {
          Message.error({
            message: message
          })
        }
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
