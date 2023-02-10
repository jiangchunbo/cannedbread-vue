<template>
  <div style="height: 100%; height: 100%">
    <instant-messaging
      ref="IMUI"
      :user="user"
      @pull-messages="handlePullMessages"
      @send="handleSend"
      width="100%"
      height="100%"
    >
      <div slot="sidebar-contact-top">
        <div>
          <el-form inline>
            <el-form-item>
              <el-input
                v-model="keyword"
                style="width: 100px"
                @keydown.enter.native="onSearchUser"
                placeholder="昵称"
              />
            </el-form-item>
            <!-- <el-form-item v-show="!searching">
              <el-button @click="onClickAddContact">
                <i class="el-icon-plus"></i>
              </el-button>
            </el-form-item> -->
            <!-- <el-form-item v-show="searching">
              <el-button @click="onClickCancelSearch"> 取消 </el-button>
            </el-form-item> -->
          </el-form>
          <div
            v-for="(item, index) in searchedUserList"
            class="searched-user-container"
            :key="index"
          >
            <div class="searched-user" @click="handleClickUser(item)">
              <el-avatar
                shape="square"
                class="searched-user-avatar"
                :src="item.avatar"
              />
              <span class="searched-user-nickname">{{ item.nickname }}</span>
            </div>
          </div>
        </div>
      </div>
    </instant-messaging>
    <el-dialog
      title="添加好友"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
    >
      <div class="searched-user-detail">
        <el-avatar
          shape="square"
          class="el-avatar"
          :src="currentShowingUser.avatar"
        />
        <span>{{ currentShowingUser.nickname }}</span>
        <el-button @click="handleAddContact(currentShowingUser)"
          >添加到通讯录</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InstantMessaging from "@/components/InstantMessaging/components/index.vue";
export default {
  name: "Relationship",
  components: {
    InstantMessaging,
  },
  data() {
    return {
      user: {
        id: this.$store.getters.id,
        displayName: this.$store.getters.name,
        avatar: this.$store.getters.avatar,
      },
      cachedContacts: [],
      searchedUserList: [],
      searching: false,
      keyword: "",
      currentShowingUser: {},
      dialogVisible: false,
      ws: null,
    };
  },
  methods: {
    onClickAddContact() {
      const { IMUI } = this.$refs;
      this.searching = true;
      this.cachedContacts = IMUI.contacts;
    },
    handleAddContact(currentShowingUser) {
      const { IMUI } = this.$refs;
      this.$axios
        .post(`/relationship/addContact?id=${currentShowingUser.id}`)
        .then((res) => {
          const { data } = res;
          this.cachedContacts.push(data);
          this.dialogVisible = false;
        });
    },
    handleClickUser(currentShowingUser) {
      this.dialogVisible = true;
      this.currentShowingUser = currentShowingUser;
    },
    onClickCancelSearch() {
      this.searching = false;
      const { IMUI } = this.$refs;
      IMUI.initContacts(this.cachedContacts);
    },
    onSearchUser() {
      const keyword = this.keyword;
      this.$axios.get(`/relationship/search?keyword=${keyword}`).then((res) => {
        const { data } = res;
        const { IMUI } = this.$refs;
        IMUI.initContacts([]);
        this.searchedUserList = data;
      });
    },
    handlePullMessages(contact, next) {
      //从后端请求消息数据，包装成下面的样子
      this.$axios
        .get(`/relationship/message?contactId=${contact.id}`)
        .then((res) => {
          const { data } = res;

          //将第二个参数设为true，表示已到末尾，聊天窗口顶部会显示“暂无更多消息”，不然会一直转圈。
          next(data, true);
        });
    },
    handleSend(message, next, file) {
      // ... 调用你的消息发送业务接口
      this.ws.send(JSON.stringify(message));
      console.log(JSON.stringify(message));
      //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      next();
    },
  },
  mounted() {
    const { IMUI } = this.$refs;
    //初始化表情包。
    // IMUI.initEmoji(...)
    //从后端请求联系人数据，包装成下面的样子
    this.$axios.get(`/relationship/contact`).then((res) => {
      const { data } = res;
      const contacts = data;
      console.log(contacts);
      contacts.map((item) => {
        if (item.lastContent) {
          item.lastContent = IMUI.lastContentRender(item.lastContent);
        }
        return item;
      });
      IMUI.initContacts(contacts);
    });
    const name = this.$store.getters.name;
    this.ws = new WebSocket(process.env.VUE_APP_BASE_SOCKET + `/relationship/chat/${name}`);

    this.ws.onmessage = (event) => {
      console.log(event.data);
      IMUI.appendMessage(JSON.parse(event.data), true);
    };
  },
};
</script>

<style lang="scss">
.searched-user {
  padding: 10px;

  .searched-user-avatar {
    vertical-align: middle;
    margin-right: 10px;
  }
  .searched-user-nickname {
  }
}

.searched-user:hover {
  background-color: #ddd;
}
</style>
