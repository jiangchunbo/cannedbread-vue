<template>
  <div class="app-container">
    <a :href="bindWorkWeixinUrl"></a>
  </div>
</template>

<script>

export default {
  data() {
    return {
      bindWorkWeixinUrl: '',
    };
  },
  mounted() {
    this.$axios.get("/work-weixin/qrConnect").then((res) => {
      const { data } = res;
      this.bindWorkWeixinUrl = data
    });
  },
  created() {
  },
  methods: {
  },
};
</script>
