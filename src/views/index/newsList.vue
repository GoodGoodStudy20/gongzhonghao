<template>
  <div class="box">
    <!-- <List v-model="loading" style="height:100%" :finished="finished" finished-text="" @load="getList"> -->
    <div class="news-box" v-for="item in list" @click="gotoInfo(item)">
      <div class="left">
        <p>{{item.title}}</p>
        <span>{{item.author_name}}</span>
      </div>
      <img :src="item.thumbnail_pic_s" alt="">
    </div>
    <!-- </List> -->
  </div>
</template>

<script>
import { getJournalismTouTiAoList, getJsJDK } from '@/api/user.js'
import { List, Toast, Empty } from 'vant';
export default {
  components: { List, Empty },
  data() {
    return {
      loading: false,
      finished: false,
      pageNum: 1,
      list: []
    }
  },
  created() {
    getJsJDK()
    this.getList()
  },
  methods: {
    getList() {
      getJournalismTouTiAoList({ pageNum: this.pageNum, pageSize: 20 }).then(res => {
        if (res.code == 200) {
          let arr = res.data.data || [];
          this.list = this.pageNum == 1 ? arr : this.list.concat(arr)
          this.finished = arr.length == 0;
          this.pageNum++
          setTimeout(() => {
            // 加载状态结束
            this.loading = false;
          }, 800)
        } else {
          this.finished = true
          Toast(res.msg || res.error_msg || res.message, 1000)
        }

      }).catch(err => {
        this.finished = true
      })
    },
    gotoInfo(item) {
      this.$router.push(`/index/newsInfo?uniquekey=${item.uniquekey}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 0px 10px;
}
.news-box {
  filter: drop-shadow(2px 4px 12px rgba(0, 0, 0, 0.08));
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
  height: 100px;
  .left {
    font-weight: bold;
    font-size: 14px;
    line-height: 21px;
    color: #333333;
    p {
      padding: 0;
      margin: 0;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin-bottom: 16px;
    }
    span {
      font-weight: normal;
      font-size: 12px;
      color: #999;
    }
  }
  img {
    width: 111px;
    height: 74px;
    border-radius: 6px;
    margin-left: 19px;
  }
}
</style>