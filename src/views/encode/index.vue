<template>
  <div class="encode-container">
    <el-tabs tab-position="left">
      <el-tab-pane label="URL 编码">
        <el-scrollbar>
          <url-encode />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="Base64 编码">
        <el-scrollbar>
          <base64-encode />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UrlEncode from '@/views/encode/components/UrlEncode'
import Base64Encode from '@/views/encode/components/Base64Encode'

export default {
  name: 'Encode',
  components: { Base64Encode, UrlEncode }
}
</script>

<style lang="scss">
.encode-container {
  height: 100%;
  padding: 20px;

  .el-tabs {
    height: 100%;
  }

  .el-tabs__content {
    height: 100%;

    .el-tab-pane {
      height: 100%;

      .el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
          padding-right: 15px;
          padding-bottom: 15px;
        }
      }
    }
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
