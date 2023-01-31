<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="username" :error="usernameError">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password" :error="passwordError">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item
        v-if="showVerificationCodeInput"
        prop="code"
        :error="verificationCodeError"
      >
        <span class="svg-container">
          <svg-icon icon-class="verification-code" />
        </span>
        <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="请输入验证码"
          type="text"
          tabindex="1"
        />
        <el-image
          :src="verificationCodeImgUrl"
          fit="contain"
          class="verification-code-img"
          @click="refreshCode"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-top: 5px; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>

      <div class="tips">
        <span style="margin-right:20px;" />
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于 6 位'))
      } else {
        callback()
      }
    }
    const validateVerificationCode = (rule, value, callback) => {
      if (this.showVerificationCodeInput && value.length === 0) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      showVerificationCodeInput: false,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{
          required: this.showVerificationCodeInput,
          trigger: 'blur',
          validator: validateVerificationCode
        }]
      },
      usernameError: '',
      passwordError: '',
      verificationCodeError: '',
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      verificationCodeImgUrl: `${process.env.VUE_APP_BASE_API}/user/login/verification-code`,
      refreshCodeCount: 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (Cookies.get('loginRequireCode') !== undefined) {
        this.showVerificationCodeInput = true
      }
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.usernameError = ''
          this.passwordError = ''
          this.verificationCodeError = ''
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((error) => {
            console.log(this.redirect)
            this.loading = false
            switch (error.code) {
              case 60001: // 用户名不存在
                this.usernameError = error.message
                break
              case 60002: // 密码错误
                this.passwordError = error.message
                if (Cookies.get('loginRequireCode') !== undefined && !this.showVerificationCodeInput) {
                  this.refreshCode()
                  this.showVerificationCodeInput = true
                  this.verificationCodeError = '请输入验证码'
                }
                break
              case 60003:
                this.verificationCodeError = error.message
                break
              case 60004: // 锁定本账户登录
                this.usernameError = error.message
                break
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCode() {
      this.verificationCodeImgUrl = `${process.env.VUE_APP_BASE_API}/user/login/verification-code?${this.refreshCodeCount++}`
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showVerificationCodeInput = Cookies.get('loginRequireCode') !== undefined
      vm.loginForm.code = ''
    })
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .verification-code-img {
      position: absolute;
      top: 0;
      bottom: 0;
      right: calc(15% - 30px);
      margin: auto;

      width: 120px;
      height: 30px;

      cursor: pointer;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
