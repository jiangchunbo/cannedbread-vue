<template>
  <div class="app-container">
    <el-timeline class="mobile-message-list">
      <el-timeline-item v-for="(value, index) in messageList" :key="index" :timestamp="value['createTime']"
                        placement="top">
        <el-card>
          <p>{{ value['content'] }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-form class="el-row mobile-message-input" size="small">
      <div class="el-col-20">
        <el-form-item>
          <el-input v-model="content"></el-input>
        </el-form-item>
      </div>
      <div class="el-col-offset-1 el-col-3">
        <el-form-item>
          <el-button type="primary" @click="submitMessage(content)">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {getList, addMessage} from '@/api/message-board'

export default {
  name: 'MessageBoard',
  components: {
    Editor, Toolbar
  },
  data() {
    return {
      messageList: [],
      mode: 'simple',
      content: ''
    }
  },
  mounted() {
    this.refreshMessageList()
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    refreshMessageList() {
      getList().then(res => {
        const {data} = res
        this.messageList = data
      })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    submitMessage(content) {
      addMessage({
        content
      }).then(res => {
        console.log(res)
        this.refreshMessageList()
      })
    }
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.mobile-message-list {
  margin-bottom: 60px;
}
.mobile-message-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  height: 60px;
  margin-left: 0;
  margin-right: 0;
  padding: 10px 20px 0 20px;
  border-top: 1px solid #eee;

  background: #fff;
}
</style>
