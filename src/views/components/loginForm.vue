<template>
  <div class="login__container">
    <el-tabs v-model="loginMethod">
      <el-tab-pane label="账号密码登录" name="account">
        <div class="login__pw-login-wrap">
          <el-form ref="loginFormRef" class="login__form" @keyup.enter="handleSubmit">
            <el-form-item label="账户" prop="username" autofocus>
              <el-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  size="default"
                  type="text">
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                  v-model="form.password"
                  placeholder="请输入密码"
                  size="default"
                  clearable
                  show-password
                  type="password">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                  class="login__btn-signup"
                  size="large"
                  @click="onSignUpClick">
                注册
              </el-button>
              <el-tooltip
                  class="tooltips-item"
                  effect="dark"
                  content="请先同意《用户协议》与《个人隐私条例》"
                  placement="bottom"
                  :visible="loginBtnDisabled">
                <el-button
                    class="login__btn-login"
                    size="large"
                    type="primary"
                    @click="handleSubmit"
                    :disabled="loginBtnDisabled"
                    :loading="loading">
                  登录
                </el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
          <div class="login__func">
            <el-button
                class="login__btn-forget"
                size="small"
                type="text"
                @click="onForgetClick">
              忘记密码
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="captcha" disabled>
        <template #label>
          <el-tooltip
              class="tooltips-item"
              effect="dark"
              :content="disabledMsg"
              placement="top">
            手机验证码登录
          </el-tooltip>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="login__eula">
      <el-checkbox
          v-model="eulaAgreed"
          @change="onEulaChange">
        我已阅读并同意
        <el-button
            class="login__btn-eula"
            size="small"
            type="text"
            @click="onEulaClick">
          《用户协议》
        </el-button>
        与
        <el-button
            class="login__btn-privacy"
            size="small"
            type="text"
            @click="onPrivacyClick">
          《个人隐私协议》
        </el-button>
        。
      </el-checkbox>
    </div>
  </div>
</template>

<script>
import {getUUID} from "@/utils/basic/User";
import {msgTextAlign, msgType} from "@/utils/basic/Notification";
import {showLinkDisabled} from "@/utils";

const defaultForm = {
  username: "",
  password: "",
  // captcha: "",
  clientId: "web:"
};

export default {
  name: "loginForm",
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        // captcha: '',
        clientId: 'web:',
      },
      loginMethod: "account",
      disabledMsg: "手机验证码登录暂停使用，请使用账号密码登录",
      eulaAgreed: false,
      loginBtnDisabled: true,
    }
  },
  mounted() {
    this.form.clientId = `web:${getUUID()}`;
  },
  methods: {
    /**
     * 提交事件
     * */
    handleSubmit() {
      // 按钮loading状态
      this.loading = true;
      // 防注入替换
      this.form.username.replace("'", '');
      this.form.username.replace("=", '');
      this.form.username.replace("UPDATE", '');
      this.form.username.replace("DELETE", '');
      this.form.username.replace("SELECT", '');
      this.form.username.replace("INSERT", '');
      // 向父组件提交数据
      this.$emit('submit', this.form, this.loginSuccess, this.loginError);
    },
    /**
     * 注册按钮点击事件
     * */
    onSignUpClick() {
      // this.$emit('signup');
      // this.$router.push({name: 'signup'});
      showLinkDisabled('/signup');
    },
    /**
     * 忘记密码按钮点击事件
     * */
    onForgetClick() {
      showLinkDisabled('/forgot');
    },
    /**
     * 用户协议同意单选框点击事件
     * */
    onEulaChange() {
      this.loginBtnDisabled = !this.eulaAgreed;
    },
    /**
     * 用户协议按钮点击事件
     * */
    onEulaClick() {
      showLinkDisabled('/politics/eula');
    },
    /**
     * 隐私条款按钮点击事件
     * */
    onPrivacyClick() {
      showLinkDisabled('/politics/privacy');
    },
    /**
     * 登录成功后的回调方法
     * */
    async loginSuccess() {
      // 按钮loading状态
      this.loading = false;
      // 登录成功隐藏登录窗口
      this.$message({
        type: msgType.SUCCESS,
        message: '登录成功',
        center: msgTextAlign.CENTERED
      });
      this.$emit('done');
      setInterval(() => {
        window.location.reload();
        clearInterval();
      }, 1000)
    },
    async loginError(errorCode, errorMsg) {
      // 按钮loading状态
      this.loading = false;
      // 登录失败提示
      this.$message({
        type: msgType.ERROR,
        message: `登录错误！\n错误代码：${errorCode}\n错误信息：${errorMsg}`,
        center: msgTextAlign.CENTERED
      });
      this.form.password = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.login__pw-login-wrap {
  //width: 500px;
  //width: 300px;
  //height: 300px;
}

.login__btn-login {
  width: 243px;
}

.login__btn-signup {
  width: 75px;
}

.login__btn-privacy {
  margin-left: 0 !important;
}

.login__btn-forget {
  margin-bottom: 15px;
}
</style>
