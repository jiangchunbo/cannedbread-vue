<template>
  <el-row style="position:relative; height: 100%; padding: 20px 0 50px 0;">
    <el-col :offset="1" :span="22" class="message-container">
      <el-timeline>
        <el-timeline-item
          v-for="(value, index) in messageList" :key="index"
          :ref="`messageItem${index}`"
          :timestamp="`${value['senderName']} ${value['sendDateTime']}`"
          placement="top"
          class="message-item"
          :style="`top: ${value.styleTop ? value.styleTop : 0}px`">
          <el-card>
            <p>{{ value['content'] }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-form class="el-row mobile-message-input" inline size="small">
      <el-form-item class="textarea">
        <el-input v-model="content" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitMessage(content)">提交</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {fetchMessageBoardList, sendMessage} from "@/api/message-board";

export default {
  name: 'MessageBoard',
  components: {
    Editor, Toolbar
  },
  data() {
    return {
      messageList: [],
      mode: 'simple',
      content: '',
      timer: null
    }
  },
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  watch: {},
  methods: {
    timeoutRefreshMessageList(limit) {
      this.refreshMessageList().then(res => {
        const {data} = res
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
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    submitMessage(content) {
      sendMessage(content).then(res => {
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
<style>
.message-container .el-timeline {
  position: relative;
}

.message-container .el-timeline:after {
  content: '';
  display: block;
  clear: both;
}

.message-container {
  position: relative;
  height: 100%;
}

.message-container .el-timeline {
  height: 100%;
  overflow: auto;
}

.mobile-message-list {
  /*position: relative;*/
  overflow: auto;
  height: calc(100% - 50px);
}

.message-item {
  position: absolute;
  left: 30px;
  right: 30px;
}

.mobile-message-input {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  display: flex;
  height: 50px;
  margin-left: 0;
  margin-right: 0;
  padding: 10px 20px 0 20px;
  border-top: 1px solid #eee;

  background: #fff;
}

.mobile-message-input .textarea {
  flex-grow: 1;
}

.mobile-message-input .el-form-item__content,
.mobile-message-input .el-textarea{
  width: 100%;
}

.mobile-message-input textarea {
  resize: none;
  height: 30px;
}
</style>
