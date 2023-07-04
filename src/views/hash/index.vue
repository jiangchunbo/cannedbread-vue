<template>
  <div class="hash-container">
    <el-tabs tab-position="left">
      <el-tab-pane label="MD5">
        <el-scrollbar>
          <md5 />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="SHA-1">
        <el-scrollbar>
          <sha1 />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import Md5 from '@/views/hash/components/Md5'
import Sha1 from '@/views/hash/components/Sha1'

export default {
  name: 'Digest',
  components: { Sha1, Md5 },
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.hash-container {
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
