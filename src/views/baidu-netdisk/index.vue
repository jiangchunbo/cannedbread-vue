<template>
  <div class="app-container" style="height: 100%">
    <el-button-group style="height: 40px">
      <el-button icon="el-icon-arrow-left" :disabled="currentLocation === 0" @click="onClickGoBackwards " />
      <el-button
        icon="el-icon-arrow-right"
        :disabled="currentLocation === historyPathList.length - 1"
        @click="onClickGoForwards"
      />
      <el-button icon="el-icon-refresh-right" />
    </el-button-group>
    <el-image-viewer
      v-if="imageViewerVisible"
      :on-close="onCloseImageViewer"
      :url-list="[imageUrl]"
    />
    <el-table
      ref="FileList"
      v-loading="loading"
      :data="fileList"
      height="calc(100% - 40px)"
    >
      <el-table-column
        prop="server_filename"
        label="文件名"
        width="380"
      >
        <template slot-scope="scope">
          <a
            v-if="scope.row.isdir === 1"
            style="text-align: center"
            @click="onClickDirectory(scope)"
          >
            <svg
              color="#FFD94A"
              fill="currentColor"
              style="width: 1em; height: 1em; vertical-align: baseline; position: relative; bottom: -2px"
              aria-hidden="true"
            >
              <use xlink:href="#icon-folder" />
            </svg>
            {{ scope.row.server_filename }}
          </a>
          <a
            v-else-if="capableOfPreview(scope)"
            style="text-align: center"
            @click="download(scope)"
          >
            <svg
              color="gray"
              fill="currentColor"
              style="width: 1em; height: 1em; vertical-align: baseline; position: relative; bottom: -2px"
              aria-hidden="true"
            >
              <use xlink:href="#icon-file" />
            </svg>
            {{ scope.row.server_filename }}
          </a>
          <span v-else>
            <svg
              color="gray"
              fill="currentColor"
              style="width: 1em; height: 1em; vertical-align: baseline; position: relative; bottom: -2px"
              aria-hidden="true"
            >
              <use xlink:href="#icon-file" />
            </svg>
            {{ scope.row.server_filename }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="local_mtime"
        label="修改时间"
      >
        <template slot-scope="scope">
          {{ timestampToDateTime(scope.row.server_mtime * 1000) }}
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
      >
        <template slot-scope="scope">
          {{ scope.row.isdir === 1 ? '文件夹' : '文件' }}
        </template>
      </el-table-column>
      <el-table-column
        label="大小"
      >
        <template slot-scope="scope">
          {{ scope.row.isdir === 1 ? '-' : formatFileSize(scope.row.size) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchBaiduNetdiskFileList } from '@/api/basis'

export default {
  name: 'BaiduNetdisk',
  components: {
    elImageViewer: () => import('element-ui/packages/image/src/image-viewer')
  },
  data() {
    return {
      loading: false,
      fileList: [],
      historyPathList: [],
      currentLocation: 0,
      imageViewerVisible: false,
      imageUrl: ''
    }
  },
  mounted() {
    // const a = document.createElement('a')
    // a.style.display = 'none'
    // a.href = process.env.VUE_APP_BASE_API + '/baidu-netdisk/authorize'
    // a.click()
    this.refreshFileList('/').then(() => {
      this.historyPathList.push('/')
      this.currentLocation = 0
    })
  },
  methods: {
    formatFileSize(size) {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return Math.round(size / 1024) + ' KB'
      } else if (size < 1024 * 1024 * 1024) {
        return Math.round(size / 1024 / 1024) + ' MB'
      } else if (size < 1024 * 1024 * 1024 * 1024) {
        return Math.round(size / 1024 / 1024) + ' GB'
      }
    },
    timestampToDateTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },
    refreshFileList(path = '/') {
      this.loading = true
      const promise = fetchBaiduNetdiskFileList({
        path
      })
      this.$nextTick(() => {
        promise.then(res => {
          const { data } = res
          this.fileList = data
        }).finally(() => {
          this.loading = false
        })
      })
      return promise
    },
    onClickDirectory(scope) {
      if (scope.row['isdir'] !== 1) {
        return
      }
      const { row } = scope
      this.refreshFileList(row.path).then(() => {
        this.historyPathList = this.historyPathList.slice(0, this.currentLocation + 1)
        this.historyPathList.push(row.path)
        this.currentLocation++
      })
    },
    onClickGoForwards() {
      this.refreshFileList(this.historyPathList[++this.currentLocation])
    },
    onClickGoBackwards() {
      this.refreshFileList(this.historyPathList[--this.currentLocation])
    },
    onCloseImageViewer() {
      this.imageViewerVisible = false
    },
    capableOfPreview(scope) {
      return scope.row.thumbs
    },
    onClickPreview(scope) {
      this.imageUrl = scope.row.thumbs.url3
      this.imageViewerVisible = true
    },
    download(scope, poolLimit = 4) {
      const contentLength = scope.row.size
      const chunkSize = 50 * 1024 * 1024
      const chunks = Math.ceil(contentLength / chunkSize)
      console.log(scope.row)
      this.$axios.get(`/baidu-netdisk/download/prepare?fsid=${scope.row['fs_id']}`).then(res => {
        console.log(res)
      })
      this.asyncPool(
        poolLimit,
        [...new Array(chunks).keys()],
        (i) => {
          let start = i * chunkSize
          let end = i + 1 === chunks ? contentLength - 1 : (i + 1) * chunkSize - 1
          return this.getBinaryContent(url, start, end, i)
        }
      )
    },

    getBinaryContent(url, start, end, i) {
      return new Promise((resolve, reject) => {
        try {
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('range', `bytes=${start}-${end}`) // 请求头上设置范围请求信息
          xhr.responseType = 'arraybuffer' // 设置返回的类型为arraybuffer
          xhr.onload = function() {
            resolve({
              index: i, // 文件块的索引
              buffer: xhr.response, // 范围请求对应的数据
            })
          }
          xhr.send()
        } catch (err) {
          reject(new Error(err))
        }
      })
    },
    async asyncPool(poolLimit, array, iteratorFn) {
      const ret = [] // 存储所有的异步任务
      const executing = [] // 存储正在执行的异步任务
      for (const item of array) {
        // 调用iteratorFn函数创建异步任务
        const p = Promise.resolve().then(() => iteratorFn(item, array))
        ret.push(p) // 保存新的异步任务

        // 当poolLimit值小于或等于总任务个数时，进行并发控制
        if (poolLimit <= array.length) {
          // 当任务完成后，从正在执行的任务数组中移除已完成的任务
          const e = p.then(() => executing.splice(executing.indexOf(e), 1))
          executing.push(e) // 保存正在执行的异步任务
          if (executing.length >= poolLimit) {
            await Promise.race(executing) // 等待较快的任务执行完成
          }
        }
      }
    }
  }
}
</script>

<style scoped>
</style>

