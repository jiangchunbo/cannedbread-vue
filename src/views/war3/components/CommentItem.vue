<template>
  <div class="comment-item-container">
    <el-image class="el-avatar" :src="data.comment.playerData.headIcon"/>
    <div class="comment-right">
      <div class="title">{{ data.comment.playerName }}</div>
      <div class="map-data">游戏时长: {{ formatDuration(data.comment.gameTimeSec) }} 版本:
        {{ data.comment.mapVersion }}
      </div>
      <div class="comment-time">发布于: {{ data.comment.commentTime }}
      </div>
      <div class="comment">{{ data.comment.content }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CommentItem',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    formatDuration(duration) {
      if (duration < 60) {
        return Math.floor(duration) + ' 秒'
      } else if (duration < 60 * 60) {
        return Math.floor(duration / 60) + ' 分钟'
      } else {
        return Math.floor(duration / 60 / 60) + ' 小时'
      }
    }
  }
}
</script>
<style lang="scss">
.comment-item-container {
  margin-bottom: 50px;

  .el-avatar {
    float: left;

    height: 50px;
    width: 50px;
  }

  .comment-right {
    position: relative;
    font-size: 12px;
    padding-left: 55px;

    .title {
      font-weight: 700;
    }

    .map-data {
    }

    .comment-time {
      float: right;
      margin-right: 5px;
    }

    .comment {
      padding-top: 50px;
    }
  }
}
</style>
