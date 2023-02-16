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
        <div class="search-user">
          <el-form class="search-user-form" inline>
            <el-form-item class="search-user-input">
              <el-input
                :disabled="searchModel !== 'user'"
                @blur="resetContacts"
                @focus="onSearchUser"
                v-model="keyword"
                @input="onSearchUser"
                placeholder="请在此输入昵称搜索"
              />
            </el-form-item>
            <svg-icon
              v-if="searchModel != 'user'"
              @click="searchModel = 'user'"
              class="add-contact"
              style="height: 30px; width: 30px; color: #aaa"
              icon-class="添加好友"
            />
            <span v-else class="cancel-add-contact" @click="searchModel = ''">取消</span>
          </el-form>
          <div class="not-found-user" v-show="notFoundUser && keyword">
            无法找到该用户，请检查你填写的账号是否正确。
          </div>
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
      notFoundUser: true,
      searchModel: "",
    };
  },
  methods: {
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
    resetContacts() {
      const { IMUI } = this.$refs;
      console.log(this.cachedContacts);
      IMUI.initContacts(this.cachedContacts);
    },
    onSearchUser() {
      const { IMUI } = this.$refs;
      this.searching = true;
      this.cachedContacts = IMUI.contacts;
      const keyword = this.keyword;
      this.$axios
        .get(`/relationship/search?keyword=${keyword}`)
        .then((res) => {
          const { data } = res;
          const { IMUI } = this.$refs;
          IMUI.initContacts([]);
          this.searchedUserList = data;
          if (data.length === 0) {
            this.notFoundUser = true;
          } else {
            this.notFoundUser = false;
          }
        })
        .finally(() => {
          this.searching = false;
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
    this.ws = new WebSocket(
      process.env.VUE_APP_BASE_SOCKET + `/relationship/chat/${name}`
    );

    this.ws.onmessage = (event) => {
      console.log(event.data);
      IMUI.appendMessage(JSON.parse(event.data), true);
    };
  },
};
</script>

<style lang="scss">
.search-user {
  .not-found-user {
    width: 200px;
    text-align: center;
    color: #aaa;
    margin: auto;
  }
}
.searched-user {
  padding: 10px;

  .searched-user-avatar {
    vertical-align: middle;
    margin-right: 10px;
  }
}

.search-user-form {
  height: 40px;
  padding: 0;
  position: relative;
  .search-user-input {
    position: absolute;
    left: 10px;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto 0;
    width: 190px;
    height: 30px;
    .el-form-item__content {
      line-height: 100%;
      height: 100%;
      width: 100%;
    }
    .el-input {
      height: 100%;
      width: 100%;
    }
    input {
      height: 100%;
      width: 100%;
    }
  }
  .cancel-add-contact {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 30px;
    width: 30px;
    line-height: 30px;
    color: #aaa;
  }
  .cancel-add-contact:hover {
    color: #ddd;
  }
  .add-contact {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .add-contact:hover {
    border-radius: 3px;
    background: #ddd;
  }
}

.searched-user:hover {
  background-color: #ddd;
}
</style>
