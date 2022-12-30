<template>
  <div class="app-container">
    <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" :disabled="true"/>
        </el-form-item>
        <el-form-item label="积分">
          <el-input v-model="form.points" :disabled="true"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">编辑</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import {getDetail} from "@/api/user";

export default {
  name: 'Mine',
  data() {
    return {
      form: {
        nickname: '',
        points: ''
      }
    }
  },
  methods: {
    renderUserInfo() {
      getDetail('').then(res => {
        const {data} = res
        this.form = {
          nickname: data['nickname'],
          points: data['points']
        }
      })
    }
  },
  mounted() {
    this.renderUserInfo()
  }
}
</script>

<style scoped>

</style>
