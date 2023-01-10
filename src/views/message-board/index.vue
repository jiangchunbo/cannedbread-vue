<template>
  <el-row style="height: 100%; display: flex; flex-direction: column">
    <el-col :offset="1" :span="22" class="message-list-container">
      <el-timeline>
        <el-timeline-item
          v-for="(value, index) in messageList"
          :key="index"
          :ref="`messageItem${index}`"
          :timestamp="`${value['senderName']} ${value['sendDateTime']}`"
          placement="top"
          class="message-item"
          :style="`top: ${value.styleTop ? value.styleTop : 0}px`"
        >
          <el-card>
            <p>{{ value['content'] }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-form class="el-row message-input-form" inline>
      <el-form-item class="message-input">
        <el-input
          ref="inputTextarea"
          v-model="content"
          type="textarea"
          :autosize="{minRows:1,maxRows:5}"
        />
      </el-form-item>
      <el-form-item class="message-send">
        <el-button type="primary" @click="submitMessage(content)">提交</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import { fetchMessageBoardList, sendMessage } from '@/api/message-board'
import { Message } from 'element-ui'

export default {
  name: 'MessageBoard',
  components: {
  },
  data() {
    return {
      messageList: [],
      mode: 'simple',
      content: '',
      timer: 0
    }
  },
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    timeoutRefreshMessageList() {
      this.refreshMessageList().then(res => {
        const { data } = res
        const additionalList = data
        if (additionalList.length > 0) {
          this.messageList.unshift(...additionalList)
        }
        this.$nextTick(() => {
          for (let i = 0; i < additionalList.length; i++) {
            if (i > 0) {
              const prevIndex = i - 1
              const top = this.$refs[`messageItem${prevIndex}`][0].$el.offsetHeight + this.messageList[prevIndex].styleTop ?? 0
              this.$refs[`messageItem${i}`][0].$el.style.top = top + 'px'
              this.messageList[i].styleTop = top
            } else {
              this.messageList[i].styleTop = 0
            }
          }
          // 旧元素滚动下去
          for (let i = additionalList.length; i < this.messageList.length; i++) {
            if (i > 0) {
              const prevIndex = i - 1
              const top = this.$refs[`messageItem${prevIndex}`][0].$el.offsetHeight + this.messageList[prevIndex].styleTop ?? 0
              this.$refs[`messageItem${i}`][0].$el.style.top = top + 'px'
              this.$refs[`messageItem${i}`][0].$el.style.transition = '0.3s'
              this.messageList[i].styleTop = top
            } else {
              this.messageList[i].styleTop = 0
            }
          }
          this.timer = setTimeout(this.timeoutRefreshMessageList, 1000)
        })
      })
    },
    refreshMessageList() {
      if (this.messageList.length > 0) {
        const first = this.messageList[0]
        return fetchMessageBoardList({
          minSendTime: first.sendDateTime,
          previousId: first.id
        }).then(res => {
          return res
        })
      } else {
        return fetchMessageBoardList().then(res => {
          return res
        })
      }
    },
    submitMessage(content) {
      if (content.trim().length === 0) {
        Message.warning({
          message: '不能发送空白消息'
        })
      }
      sendMessage(content).then(() => {
        clearTimeout(this.timer)
        this.timeoutRefreshMessageList()
        this.content = ''
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.timeoutRefreshMessageList()
    })
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timer)
    next()
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
.message-list-container {
  flex: 1;
  position: relative;
  padding-top: 20px;

  .el-timeline {
    position: relative;
    height: 100%;
    overflow-y: auto;

    .message-item {
      position: absolute;
      left: 1px;
      right: 0;
      white-space: pre-line;
    }
  }
}

.message-input-form {
  display: flex;
  flex-direction: row;
  margin-left: 0;
  margin-right: 0;
  padding: 10px 20px 10px 20px;
  border-top: 1px solid #eee;
  background: #fff;

  .el-form-item {
    margin-bottom: 0;
  }

  .message-input {
    flex: 1;
    align-self: flex-end;

    textarea {
      box-sizing: border-box;
      font-size: 18px;
      font-family: 'Noto Serif SC', monospace;
      resize: none;
    }

    textarea::-webkit-scrollbar {
      display: none;
    }
  }

  .message-send {
    display: inline;
    margin-bottom: 0;
    margin-right: 0;
    align-self: flex-end;
  }

  .el-form-item__content,
  .el-textarea {
    width: 100%;
  }
}

.message-editor-form-item {
  margin-bottom: 0 !important;
}
</style>
