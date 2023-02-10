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
        <el-form-item label="头像">
          <el-upload
            :disabled="formMode !== 'edit'"
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            action="#"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar">
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
          <el-progress
            v-show="uploadingAvatar"
            :percentage="percentage"
            :status="progressStatus"
          ></el-progress>
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
import { resizeFile } from '@/utils/image'
import { uuid } from '@/utils/uuid'

export default {
  name: 'Mine',
  data() {
    return {
      oldForm: {},
      form: {
        nickname: '',
        points: '',
        ipAddress: '',
        avatar: ''
      },
      formMode: 'view',
      cos: null,
      uploadingAvatar: false,
      progressStatus: 'warning',
      percentage: 0
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
          avatar: data['avatar'],
          ipAddress: data['ipAddress']
        }
      })
    },
    onSubmit() {
      if (this.formMode === 'view') {
        this.formMode = 'edit'
        Object.assign(this.oldForm, this.form)
      } else {
        if (this.uploadingAvatar) {
          this.$message.warning('头像正在上传，请稍后')
        }
        editPersonalInfo({
          nickname: this.form.nickname,
          avatar: this.form.avatar
        }).then(res => {
          this.$store.commit('SET_NAME', this.form.nickname)
          this.$store.commit('SET_AVATAR', this.form.avatar)
          this.formMode = 'view'
        })
      }
    },
    onCancel() {
      if (this.formMode !== 'edit') {
        return
      }
      this.formMode = 'view'
      this.form = this.oldForm
    },
    initCosIfNecessary() {
      if (this.cos != null) {
        return
      }
      this.cos = new COS({
        // getAuthorization 必选参数
        getAuthorization: function(options, callback) {
          // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
          // 异步获取临时密钥
          // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
          // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
          // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048

          const url = 'http://www.jiangchunbo.com/TencentCloud/getTempSign.php' // url 替换成您自己的后端服务
          const xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.onload = function(e) {
            const data = JSON.parse(e.target.responseText)
            const credentials = data.credentials
            if (!data || !credentials) {
              return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
            }

            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              SecurityToken: credentials.sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
              ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000000
            })
          }
          xhr.send()
        }
      })
    },
    beforeAvatarUpload(file) {
      if (file.size > 100 * 1024) {
        this.$message.warning('请选择小于 100KB 的图片')
        return
      }
      // 初始化实例
      this.initCosIfNecessary()
      // 接下来可以通过 cos 实例调用 COS 请求。
      this.uploadingAvatar = true
      this.cos.putObject({
        Bucket: 'cannedbread-1302516612',
        Region: 'ap-shanghai',
        Key: 'user/avatar/' + uuid(32, 62) + file.name.substring(file.name.lastIndexOf('.')),
        Body: file,
        onProgress: (progressData) => {
          this.percentage = progressData.percent * 100
          if (this.percentage < 0) {
            this.progressStatus = 'warning'
          } else {
            this.progressStatus = 'success'
          }
        }
      }, (err, data) => {
        this.form.avatar = 'https://' + data.Location
        setTimeout(() => {
          this.uploadingAvatar = false
        }, 1000)
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.renderUserInfo()
    })
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: 75px;
  height: 75px;
  line-height: 75px;
  text-align: center;
}

.avatar {
  width: 75px;
  height: 75px;
  display: block;
}
</style>
