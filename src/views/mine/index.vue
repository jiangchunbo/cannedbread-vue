<template>
  <div class="app-container">
    <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="昵称">
          <span v-if="formMode === 'view'">{{ form.nickname }}</span>
          <el-input v-if="formMode === 'edit'" v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="积分">
          <span>{{ form.points }}</span>
        </el-form-item>
        <el-form-item label="IP 地址">
          <span>{{ form.ipAddress }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ formMode === 'edit' ? '确认' : '编辑' }}</el-button>
          <el-button v-if="formMode === 'edit'" @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { editPersonalInfo, getDetail } from '@/api/user'

export default {
  name: 'Mine',
  data() {
    return {
      oldForm: {},
      form: {
        nickname: '',
        points: '',
        ipAddress: ''
      },
      formMode: 'view'
    }
  },
  mounted() {
  },
  methods: {
    renderUserInfo() {
      getDetail().then(res => {
        const { data } = res
        this.form = {
          nickname: data['nickname'],
          points: data['points'],
          ipAddress: data['ipAddress']
        }
      })
    },
    onSubmit() {
      if (this.formMode === 'view') {
        this.formMode = 'edit'
        Object.assign(this.oldForm, this.form)
      } else {
        editPersonalInfo({
          nickname: this.form.nickname
        })
        this.formMode = 'view'
      }
    },
    onCancel() {
      if (this.formMode !== 'edit') {
        return
      }
      this.formMode = 'view'
      this.form = this.oldForm
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.renderUserInfo()
    })
  }
}
</script>

<style scoped>

</style>
