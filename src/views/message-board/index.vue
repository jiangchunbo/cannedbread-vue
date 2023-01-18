<template>
  <div class="message-board-container">
    <div class="message-list-container">
      <el-timeline
        ref="timeline"
        v-infinite-scroll="loadMoreMessage"
      >
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
    </div>
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
  </div>
</template>

<script>
import { fetchAfterMessage, fetchBeforeMessage, sendMessage } from '@/api/message-board'
import { Message } from 'element-ui'

export default {
  name: 'MessageBoard',
  components: {},
  data() {
    return {
      loadingNew: false,
      loading: false,
      noMore: false,
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
    timeoutFetchNewMessage() {
      if (this.loadingNew) {
        return
      }
      this.loadingNew = true
      this.loadNewMessage().then(res => {
        const { data } = res
        const additionalList = data
        // 旧元素滚动下去
        if (additionalList.length > 0) {
          this.messageList.unshift(...additionalList)
        }
        this.$nextTick().then(() => {
          // 先计算出所有的新增的门店
          for (let i = 0; i < additionalList.length; i++) {
            this.$refs[`messageItem${i}`][0].$el.style.transition = 'all 0s'
            this.$refs[`messageItem${i}`][0].$el.style.transform = 'scaleY(0)'
            this.$refs[`messageItem${i}`][0].$el.style.position = 'absolute'
            let top = 0
            if (i > 0) {
              const prevIndex = i - 1
              top = this.$refs[`messageItem${prevIndex}`][0].$el.offsetHeight + this.messageList[prevIndex].styleTop || 0
            }
            this.$refs[`messageItem${i}`][0].$el.style.top = top + 'px'
            this.messageList[i].styleTop = top
            console.log(top)
          }
          // 旧元素依然保持位置
          for (let i = additionalList.length; i < this.messageList.length; i++) {
            this.$refs[`messageItem${i}`][0].$el.style.transition = ''
            this.$refs[`messageItem${i}`][0].$el.style.position = 'absolute'
            let top = 0
            if (i > additionalList.length) {
              const prevIndex = i - 1
              top = this.$refs[`messageItem${prevIndex}`][0].$el.offsetHeight + this.messageList[prevIndex].styleTop || 0
            }
            this.$refs[`messageItem${i}`][0].$el.style.top = top + 'px'
            this.messageList[i].styleTop = top
          }
        }).then(() => {
          for (let i = 0; i < this.messageList.length; i++) {
            if (i < additionalList.length) {
              this.$refs[`messageItem${i}`][0].$el.style.transition = 'all 0.6s'
              this.$refs[`messageItem${i}`][0].$el.style.transform = 'scaleY(1)'
              this.$refs[`messageItem${i}`][0].$el.style.transformOrigin = 'center top'
            } else {
              this.$refs[`messageItem${i}`][0].$el.style.transition = '0.3s'
              let top = 0
              if (i > 0) {
                const prevIndex = i - 1
                top = this.$refs[`messageItem${prevIndex}`][0].$el.offsetHeight + this.messageList[prevIndex].styleTop || 0
              }
              this.$refs[`messageItem${i}`][0].$el.style.top = top + 'px'
              this.messageList[i].styleTop = top
            }
          }
        }).then(() => {
          this.loadingNew = false
          this.timer = setTimeout(() => {
            this.timeoutFetchNewMessage()
          }, 1000)
        })
      })
    },
    loadMoreMessage() {
      if (this.loading) {
        return
      }
      if (this.noMore) {
        return
      }
      this.loading = true
      let promise
      if (this.messageList.length > 0) {
        const last = this.messageList[this.messageList.length - 1]
        promise = fetchBeforeMessage({
          sendTime: last.sendDateTime,
          id: last.id
        })
      } else {
        promise = fetchBeforeMessage()
      }
      return promise.then((res) => {
        this.loading = false
        const { data } = res
        if (data.length > 0) {
          this.messageList.push(...data)
        } else {
          this.noMore = true
        }
      }).then(() => {
        // load more message 不进行动画，立即追加
        this.$nextTick(() => {
          for (let i = 0; i < this.messageList.length; i++) {
            let top = 0
            if (i > 0) {
              const prevIndex = i - 1
              top = this.$refs[`messageItem${prevIndex}`][0].$el.offsetHeight + this.messageList[prevIndex].styleTop || 0
            }
            this.$refs[`messageItem${i}`][0].$el.style.top = top + 'px'
            this.messageList[i].styleTop = top
          }
        })
      })
    },
    submitMessage(content) {
      if (content.trim().length === 0) {
        Message.warning({
          message: '不能发送空白消息'
        })
        return
      }
      sendMessage(content).then(() => {
        clearTimeout(this.timer)
        this.timeoutFetchNewMessage()
        this.content = ''
      })
    },
    loadNewMessage() {
      if (this.messageList.length > 0) {
        const first = this.messageList[0]
        return fetchAfterMessage({
          sendTime: first.sendDateTime,
          id: first.id
        }).then(res => {
          return res
        })
      } else {
        return fetchBeforeMessage().then(res => {
          return res
        })
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      if (vm.messageList.length > 0) {
        return
      }
      vm.loading = true
      await fetchBeforeMessage().then((res) => {
        const { data } = res
        vm.loading = false
        vm.messageList = data
        if (data.length === 0) {
          vm.noMore = true
        }
        vm.$nextTick(() => {
          for (let i = 0; i < vm.messageList.length; i++) {
            let top = 0
            if (i > 0) {
              const prevIndex = i - 1
              top = vm.$refs[`messageItem${prevIndex}`][0].$el.offsetHeight + vm.messageList[prevIndex].styleTop || 0
            }
            vm.$refs[`messageItem${i}`][0].$el.style.top = top + 'px'
            vm.messageList[i].styleTop = top
          }
        })
        this.timeoutFetchNewMessage()
      })
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
.message-board-container {
  height: 100%;

  .message-list-container {
    flex-direction: column;
    height: calc(100% - 61px);
    width: calc(100% + 20px);
    position: relative;
    padding-left: 20px;

    .el-timeline {
      height: 100%;
    }
  }

  .message-input-form {
    height: 60px;
    display: flex;
    flex-direction: row;
    margin-left: 0;
    margin-right: 0;
    padding: 10px 20px 10px 20px;
    border-top: 1px solid #eee;
    background: #fff;
  }
}

.message-list-container {
  .el-timeline {
    position: relative;
    overflow-y: auto;

    .message-item {
      padding: 10px 0;
      position: absolute;
      left: 1px;
      right: 0;
      white-space: pre-line;

      .el-timeline-item__content {
        margin-right: 40px;
      }
    }
  }
}

.message-input-form {
  .el-form-item {
    margin-bottom: 0;
  }

  .message-input {
    flex: 1;
    align-self: flex-end;

    textarea {
      /* Firefox 隐藏滚动条 */
      scrollbar-width: none;
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

