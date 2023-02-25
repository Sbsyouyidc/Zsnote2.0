<template>
  <div class="container flex-row j-s-b">
    <div class="logo-container">
      <img class="logo" :src="logoImg" alt="知市笔记Logo">
    </div>
    <el-menu
        :default-active="$route.path"
        class="el-menu link-container"
        mode="horizontal"
        router>
      <el-menu-item index="/index" :key="'home'">
        <el-icon>
          <home-filled/>
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/space/mynotes" :key="'space'">
        <el-icon>
          <document-copy/>
        </el-icon>
        <span>个人空间</span>
      </el-menu-item>
    </el-menu>
    <div class="search-container">
      <el-input
          v-model.trim="search.searchText"
          @keyup.enter.native="doSearch"
          size="large"
          placeholder="搜索"
          :prefix-icon="search.searchIcon"
          clearable
      />
    </div>
    <div class="user-info-container">
      <!--    <div class="user-info-container flex-row" :class="loginState ? 'j-s-e' : 'j-end'">-->
      <div v-if="loginState" class="logged flex-row j-s-a">
        <el-link :underline="false" @click="toNewNote">
          <el-button type="primary">新建笔记
            <el-icon class="el-icon--right">+</el-icon>
          </el-button>
        </el-link>
        <el-link :underline="false" @click="toChatBox">
          <!--          带未读数字角标-->
          <!--          <el-badge :value="messageBtn.unreadNum" :max="messageBtn.maxUnreadShow" class="item">-->
          <el-badge :max="messageBtn.maxUnreadShow" class="item">
            <el-button type="primary" :icon="messageBtn.MessageIcon" circle></el-button>
          </el-badge>
        </el-link>
        <el-popover
            :width="100"
            trigger="hover">
          <div class="popover-container flex-col">
            <span class="popover-content">{{ userInfo.name }}</span>
            <!--            <span class="popover-content">{{ userInfo.UID }}</span>-->
            <span class="popover-content">
            <el-link @click="toLogout">退出登录</el-link>
          </span>
          </div>
          <template #reference>
            <div class="icon-container">
              <avatar :user="userInfo" :popover-disabled="true" :name-visible="false"></avatar>
            </div>
            <!--            <img class="user-avatar" :src="userInfo.portrait" alt/>-->
          </template>
        </el-popover>
      </div>
      <div v-else class="not-logged">
        <el-link :underline="false" @click="onLoginPopUpClick">
          <el-button type="primary">
            登录
          </el-button>
        </el-link>
      </div>
    </div>

    <!-- 登录框 -->
    <el-dialog
        width="370px"
        v-model="loginVisibility"
        title="请登录"
        @close="loginDialogHide"
        destroy-on-close>
      <login-form @submit="doLogin" @done="loginDialogHide"></login-form>
    </el-dialog>
  </div>
</template>

<script>
import {Message, Search, HomeFilled, DocumentCopy} from '@element-plus/icons-vue'
import Avatar from "@/views/components/avatar";
import logoImg from '@/assets/images/logo.png'
import loginForm from '@/views/components/loginForm'
import {getSearchNote, postLogin, showLinkDisabled} from "@/utils";
import {saveToken} from "@/utils/basic/User";
import {msgTextAlign, msgType} from "@/utils/basic/Notification";

export default {
  name: "zsHeader",
  components: {Avatar, HomeFilled, DocumentCopy, loginForm},
  data() {
    return {
      loginVisibility: false,
      logoImg,
      search: {
        searchIcon: Search,
        searchText: "",
      },
      loginState: false,
      userInfo: {
        name: "",
        portrait: "",
        avatarSize: "large",
      },
      messageBtn: {
        unreadNum: 109,
        maxUnreadShow: 99,
        MessageIcon: Message
      }
    }
  },
  mounted() {
    // 监听登录用户信息
    // this.$store.dispatch("writeUserInfo");
    this.$store.watch(state => state.userInfo, (newVal) => {
      if (newVal.name !== "") {
        this.userInfo = [newVal.name, newVal.portrait];
        this.loginState = true;
      }
    });
    // 监听登陆界面可见性
    this.$store.watch(state => state.bLoginModal, (newVal) => {
      this.loginVisibility = newVal;
    });
    // 监听登录状态
    this.$nextTick(() => {
      this.$store.watch(state => state.userInfo.name, (newVal) => {
        if (newVal !== "" || newVal !== null || true) {
          this.userInfo.name = this.$store.getters.getUserName;
          this.userInfo.portrait = this.$store.getters.getUserPortrait;
          this.loginState = true;
        }
      })
    })
  },
  methods: {
    /*链接、按钮点击事件处理*/
    /**
     * 登出按钮
     * */
    toLogout() {
      this.$store.dispatch("logout");
      this.$notify({
        message: '您已退出登录',
        title: '提示',
        type: msgType.SUCCESS
      })
      location.reload();
    },
    /**
     * 弹出登录窗口按钮点击事件
     * */
    onLoginPopUpClick() {
      if (this.loginState === true) {
        this.$notify({
          message: '您已登录',
          title: '提示',
          type: msgType.WARNING
        });
        try {
          window.location.reload();
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$store.dispatch("changeLoginModal", true);
        // this.loginVisibility = true;
        // this.$router.push('/login')
      }
    },
    /**
     * 发送登录请求
     * @param {Object} arg 登录信息，包含用户名、密码、clientId以及预留的验证码位置
     * @param {String} arg.username 用户名
     * @param {String} arg.password 密码
     * @param {String} arg.clientId 客户端ID
     * @param {Function} callback 登陆成功回调函数
     * @param {Function} fallback 登陆失败回调函数
     * */
    async doLogin(arg = {}, callback = () => {
      // callback未指定时提示错误。
      this.$notify({message: "Login callback undefined."})
    }, fallback = () => {
      this.$notify({message: "Login fallback undefined."})
    }) {
      // TODO: 2022/02/10 未做登录表单验证
      await postLogin(arg)
          .then(r => {
            return r.json();
          })
          .then(res => {
            console.log(res);
            // 登录成功会返回一个对象，其中包含 token与isLogin
            // 登录出错会返回一个对象，其中包含 errorCode, errorMes, stackTrace
            const isLogin = res.isLogin;
            if (isLogin) {
              const token = res.token;
              saveToken(token);
              this.loginState = isLogin;
              callback();
            } else {
              const {errorCode, errorMes} = res;
              // const {errorCode, errorMes, stackTrace} = res;
              fallback(errorCode, errorMes);
            }
          })
          .catch(err => {
            // console.log(`Login err: ${err}`);
            this.$message({
              message: err.message,
              type: msgType.ERROR,
              center: msgTextAlign.CENTERED
            })
          })
    },
    /**登录窗口隐藏*/
    loginDialogHide() {
      this.$store.dispatch("changeLoginModal", false);
    },
    /**搜索框回车按下*/
    doSearch() {
      const searchText = this.search.searchText;
      const searchPageNum = 1;
      const searchPageSize = 10;
      if (searchText !== "") {
        getSearchNote(searchText, searchPageNum, searchPageSize)
            .then(r => {
              return r.json();
            })
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            })
      } else {
        this.$message({
          message: '请输入内容',
          title: '提示',
          type: msgType.ERROR,
          offset: 60
        });
      }
    },
    /**消息按钮*/
    toChatBox() {
      showLinkDisabled(`/chatBox`)
    },
    /**新建笔记按钮*/
    toNewNote() {
      if (this.$route.name !== "mynotes") {
        this.$store.commit("setNewNotebookModal", true);
        this.$router.push({
          name: 'mynotes',
          params: {
            newNotebook: true
          }
        });
      } else {
        this.$store.commit("setNewNotebookModal", true);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
}

.container {
  height: 100%;
}

.el-menu {
  border-bottom: 0;
}

.logo {
  height: 60px;
}

.link-container {
  width: 300px;
  margin: 0 50px;

  a {
    text-decoration: none;
    color: inherit;
    //line-height: 58px;
  }

  .link-item {
    height: 100%;
  }
}

.search-container {
  width: 300px;
  //padding: 10px 0;
  .el-input {
    height: 40px;
    margin: 10px 0;
  }
}

.user-info-container {
  margin: auto 0;
  height: 40px;
  width: 300px;
  //width: 400px;
}

.icon-container {
  width: 40px;
}

.logged {
  width: 300px;
}

.not-logged > a {
  float: right;
}

.popover-content {
  padding: 10px;
}
</style>
