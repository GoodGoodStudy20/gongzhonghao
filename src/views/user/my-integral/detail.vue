<template>
  <div class="box">
    <div class="carTitle">
      <img class="img" src="@/assets/img/integral.png" alt="">
      总权益： {{Number(countIntegral)}}</div>
    <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="wrap-box" v-for="(item,index) in list" :key="index">
        <div class="left-box">+{{item.receiveIntegral}}</div>
        <div class="right-box">
          <p>领取时间：{{item.receiveTime}}</p>
          <!-- <p>过期时间：{{item.overdueTime|TimeResive}}</p> -->
          <!-- <p>过期时间：{{item.overdueTime}}</p>
          <p>剩余：{{item.remainDay}}天</p> -->
        </div>
        <!-- <div class="newbox">
            <div class="title-day">剩余:{{item.remainIntegral}}权益</div>
            <div>剩余{{item.remainDay}}天</div>
            <div>
              有效期至
              {{item.overdueTime|TimeResive}}
            </div>
          </div> -->
      </div>
    </List>
  </div>
</template>

<script>
import { storageGet, storageSet } from '@/utils/utils'
import { List } from 'vant';
import { getIntegralList } from '@/api/user'
export default {
  components: {
    List
  },
  name: 'myIntegralDetail',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      countIntegral: sessionStorage.getItem('my_integral'),
      integralType: '', //历史类型
      isPage: 0, //不分页
      pageNum: 1, //　页码
      pageSize: 10, // 条数
      phone: '',   //电话
      search: '',  //搜索条件
      total: ''
    }
  },
  watch: {

  },
  mounted() {

  },
  filters: {
    TimeResive: value => {
      return value.substr(0, 11)
    }
  },
  methods: {
    onLoad() {
      let userInfo = storageGet('userInfo')
      let params = {
        integralType: '',
        isPage: this.isPage,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        phone: userInfo.bindPhone,
        search: this.search
      }
      getIntegralList(
        params
      ).then(res => {
        this.total = res.data.total
        if (res.code == 200) {
          for (let Item of res.data.records) {
            this.list.push(Item)
          }
        }
      })
      // 加载状态结束
      this.loading = false;
      // 数据全部加载完成
      if (this.list.length >= this.total) {
        this.finished = true;
      }

    },

  }
};
</script>
<style scoped lang="scss">
.box {
  padding: 12px;
}
.carTitle {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  color: #000000;
  .img {
    width: 40px;
    height: 40px;
    vertical-align: middle;
    margin-right: 2px;
  }
}
.wrap-box {
  width: 351px;
  height: 50px;
  border-radius: 6px;
  background: #fff4f4;
  margin: 8px auto;
  padding: 9px 0;
  display: flex;
  .left-box {
    width: 100px;
    height: 38px;
    line-height: 38px;
    border-right: 1px dashed #f14f44;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    color: #f14f44;
    position: relative;
    &::before {
      position: absolute;
      content: " ";
      display: block;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      height: 16px;
      width: 8px;
      border-radius: 0 8px 8px 0;
      background: #fff;
      top: 10px;
      left: 0px;
    }
  }
  .right-box {
    margin-left: 16px;
    display: flex;
    align-items: center;
    p {
      margin: 0;
      padding: 0;
      font-size: 13px;
      color: #666666;
    }
    // p:nth-child(1) {
    //   font-size: 13px;
    //   color: #666666;
    // }
    // p:nth-child(2) {
    //   font-size: 14px;
    //   color: #333333;
    //   margin: 6px 0;
    // }
    // p:nth-child(3) {
    //   font-weight: bold;
    //   font-size: 14px;
    //   color: #f14f44;
    // }
  }
}
</style>