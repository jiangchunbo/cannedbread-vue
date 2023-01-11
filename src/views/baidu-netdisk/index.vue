<template>
  <div class="app-container" style="height: 100%">
    <div class="baidu-netdisk-nav">
      <el-button-group class="baidu-netdisk-nav-button-group">
        <el-button
          icon="el-icon-arrow-left"
          :disabled="currentLocation === 0"
          @click="onClickGoBackwards "
        />
        <el-button
          icon="el-icon-arrow-right"
          :disabled="currentLocation === historyPathList.length - 1"
          @click="onClickGoForwards"
        />
        <el-button
          icon="el-icon-refresh-right"
          @click="onClickRefresh"
        />
      </el-button-group>
      <el-dropdown style="margin-left: 5px" trigger="click">
        <el-button
          icon="el-icon-arrow-down el-icon--right"
        />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(path,index) in reverseHistoryPathList"
            :key="index"
            :divided="index === historyPathList.length - currentLocation - 1 || index === historyPathList.length - currentLocation"
            :data-click-index="index"
            @click.native="onClickDropdownPath"
          >
            <i v-if="index + currentLocation + 1 === historyPathList.length" class="el-icon-check" />
            <i v-else class="el-icon-back" />
            {{ path.substring(path.lastIndexOf('/') + 1) || '我的网盘' }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-divider direction="vertical" />
      <el-breadcrumb separator-class="el-icon-arrow-right" class="baidu-netdisk-nav-breadcrumb">
        <el-breadcrumb-item
          v-for="(filename, index) in breadcrumbList"
          :key="index"
          :index="index"
          class="baidu-netdisk-nav-breadcrumb-item"
        >
          <span :data-breadcrumb-index="index" @click="onClickPath">
            {{ filename === '/' ? '我的网盘' : filename }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <iframe name="hiddenIframe" style="display: none" />
    <el-image-viewer
      v-if="imageViewerVisible"
      :on-close="onCloseImageViewer"
      :url-list="[imageUrl]"
    />

    <el-popover
      ref="popover"
      v-model="popoverVisible"
      placement="bottom"
      trigger="manual"
      class="baidu-netdisk-menu-popover"
    >
      <ul class="baidu-netdisk-menu">
        <li @click="onClickDownload">
          <span>下载</span>
        </li>
      </ul>
    </el-popover>

    <el-table
      ref="FileList"
      v-loading="loading"
      :data="fileList"
      height="calc(100% - 40px)"
      class="baidu-netdisk-file-table"
      @row-contextmenu="onRowContextmenu"
    >
      <el-table-column
        prop="server_filename"
        label="文件名"
        width="380"
        class="baidu-netdisk-column-filename"
      >
        <template slot-scope="scope">
          <span
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
          </span>
          <span
            v-else-if="capableOfPreview(scope)"
            style="text-align: center"
            @click="onClickPreview(scope)"
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
          </span>
          <span
            v-else
            @click="onClickUnsupportedPreview"
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
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="local_mtime"
        label="修改时间"
        width="200"
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
      popoverVisible: false,
      loading: false,
      fileList: [],
      historyPathList: [],
      currentLocation: -1,
      currentFile: null,
      currentElement: null,
      imageViewerVisible: false,
      imageUrl: ''
    }
  },
  computed: {
    reverseHistoryPathList() {
      const historyPathList = [...this.historyPathList].reverse()
      return historyPathList
    },
    breadcrumbList() {
      const historyPathList = this.historyPathList
      const currentLocation = this.currentLocation
      let breadcrumbList = historyPathList[currentLocation] ? historyPathList[currentLocation].split('/') : []
      breadcrumbList = breadcrumbList.filter(filename => filename.length > 0)
      breadcrumbList.unshift('/')
      return breadcrumbList
    }
  },
  mounted() {
    this.refreshFileList('/').then(() => {
      this.pushHistoryPathList('/')
      this.currentLocation = 0
    })
    document.addEventListener('mouseup', (e) => {
      if (!this.currentElement) {
        return
      }
      const target = e.target
      const currentElement = this.currentElement
      if (currentElement !== target) {
        this.popoverVisible = false
      }
    })
  },
  methods: {
    formatFileSize(size) {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size < 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      }
    },
    timestampToDateTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },
    pushHistoryPathList(path) {
      this.historyPathList.push(path)
      this.currentLocation++
      if (this.historyPathList.length === 11) {
        this.historyPathList = this.historyPathList.slice(1, 11)
        this.currentLocation--
      }
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
        this.pushHistoryPathList(row.path)
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
    onClickUnsupportedPreview() {
      this.$message.warning('暂不支持在线预览，请下载后查看')
    },
    onClickRefresh() {
      this.refreshFileList(this.historyPathList[this.currentLocation])
    },
    download(row) {
      const size = row.size
      const chunkSize = 50 * 1024 * 1024
      if (size > chunkSize) {
        this.$message.warning('不允许使用浏览器直接下载超过 50 MB 的文件，请使用客户端下载')
      }
      this.$axios.get(`/baidu-netdisk/download/prepare?fsid=${row['fs_id']}`).then(res => {
        const { data } = res
        const dlink = data['dlink']
        const accessToken = data['access_token']
        const url = dlink + `&access_token=${accessToken}`
        if (size <= chunkSize) {
          const a = document.createElement('a')
          a.href = decodeURI(url)
          a.referrerPolicy = 'no-referrer'
          a.target = 'hiddenIframe'
          a.click()
        }
      })
    },
    onRowContextmenu(row, column, event) {
      event.preventDefault()
      if (row.isdir === 1) {
        return
      }
      this.popoverVisible = true
      this.$refs.popover.$el.style.left = event.clientX + 'px'
      this.$refs.popover.$el.style.top = event.clientY + 'px'
      this.currentFile = row
      this.currentElement = this.$refs.popover.$el
    },
    onClickDownload() {
      this.download(this.currentFile)
    },
    onClickPath(event) {
      const target = event.target.dataset['breadcrumbIndex']
      let path = '/'
      for (let i = 1; i <= target; i++) {
        path += '/' + this.breadcrumbList[i]
      }
      this.refreshFileList(path).then(res => {
        this.pushHistoryPathList(path)
      })
    },
    onClickDropdownPath(e) {
      const clickIndex = e.target.dataset['clickIndex']
      const path = this.reverseHistoryPathList[clickIndex]
      this.refreshFileList(path).then(() => {
        const length = this.historyPathList.length
        this.historyPathList = this.historyPathList.slice(0, length - clickIndex - 1)
        this.currentLocation = length - clickIndex - 2
        this.pushHistoryPathList(path)
      })
    }
  }
}
</script>

<style lang="scss">
.baidu-netdisk-nav {
  .baidu-netdisk-nav-button-group {
    height: 40px;
    display: inline-block
  }

  .el-dropdown {
    height: 40px;
    vertical-align: middle;
  }

  .baidu-netdisk-nav-breadcrumb {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;

    .el-breadcrumb__inner:hover:hover {
      color: #79B5FF;
      cursor: pointer;
    }
  }
}

.baidu-netdisk-file-table {
  .el-table__body tr td:first-child .cell span {
    cursor: pointer;
  }

  .el-table__body tr td:first-child .cell span:hover {
    color: #79B5FF;
  }
}

.baidu-netdisk-menu-popover {
  position: fixed;
  z-index: 99;

  .el-popover {
    padding: 0;
    border: 1px solid #A0A0A0;
    box-shadow: #97a8be;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    list-style: none;
    margin: 0;
    padding: 10px;
    cursor: pointer;
  }

  li:hover {
    background: #F1F3F7;
  }
}
</style>

