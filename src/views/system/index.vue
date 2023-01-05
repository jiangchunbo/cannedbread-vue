<template>
  <div class="app-container">
    <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <el-form ref="form" :model="form" label-width="250px" size="mini">
        <el-form-item label="连续登陆失败次数限制:">
          <el-input v-model="form.loginFailureCountLimit"/>
        </el-form-item>
        <el-form-item label="登录失败锁定时间（单位：秒）">
          <el-input v-model="form.loginFailureLockTimeInSeconds"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

import {listSystemProperties, updateSystemProperties} from '@/api/basis';
import {Message} from 'element-ui';

export default {
  name: 'Mine',
  data() {
    return {
      form: {
        loginFailureCountLimit: '',
        loginFailureLockTimeInSeconds: ''
      }
    }
  },
  methods: {
    renderSystemProperties() {
      listSystemProperties().then(res => {
        const {data} = res
        this.form = {
          loginFailureCountLimit: data['loginFailureCountLimit'],
          loginFailureLockTimeInSeconds: data['loginFailureLockTimeInSeconds']
        }
      })
    },
    onSubmit() {
      updateSystemProperties(this.form).then(res => {
        Message.success({
          message: '更新成功'
        })
      })
    }
  },
  mounted() {
    this.renderSystemProperties()
  }
}
</script>

<style scoped>

</style>
