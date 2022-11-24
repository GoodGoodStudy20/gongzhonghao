<template>
  <div class="box">
    <p class="title">{{newsData.detail.title}}</p>
    <p class="sec-title">{{newsData.detail.author_name}} <span>{{newsData.detail.date}}</span></p>
    <div class="newsContent" v-html="newsData.content"></div>
  </div>
</template>

<script>
import { getJournalismTouTiAoContent, getJsJDK } from '@/api/user.js'
export default {
  data() {
    return {
      newsData: {}
    }
  },
  created() {
    getJsJDK()
    this.getInfo()
  },
  methods: {
    getInfo() {
      getJournalismTouTiAoContent({ uniquekey: this.$route.query.uniquekey }).then(res => {
        this.newsData = res.data || {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  font-size: 14px;
  font-weight: normal;
  padding: 10px 10px 30px;
  overflow-x: hidden;
  .title {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 20px;
    color: #000;
  }
  .sec-title {
    margin-top: 13px;
    font-weight: normal;
    font-size: 13px;
    color: #666;
    margin-bottom: 16px;
    span {
      margin-left: 8px;
    }
  }
}
</style>
<style lang="scss">
.newsContent {
  text-indent: 30px;
  p img {
    margin-left: -30px;
  }
}
</style>