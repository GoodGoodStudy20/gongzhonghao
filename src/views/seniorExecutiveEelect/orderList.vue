<template>
  <div class="wrap-box">
    <div class="tabs-item-box">
      <Tabs v-model="active" @click="activeChange" swipeable title-active-color="#F46356" color="#F46356">
        <Tab v-for="(item,i) in stateList" :title="item" :key="i"></Tab>
      </Tabs>
    </div>
    <List v-if="list && list.length" v-model="loading" :finished="finished" style="height:100%;margin-top:-2px" finished-text="没有更多了" @load="getList">
      <CouponsList @getdata="getList" :list="list" @usedClick="gotoInfo"></CouponsList>
    </List>
    <div class="empty-box" v-else>
      <img class="img" src="@/assets/img/empty.png" alt="">
      <p>暂无内容</p>
    </div>
    <!-- <Empty description="暂无内容" v-else>
      <template #image>
        <img class="img" src="@/assets/img/empty.png" alt="">
      </template>
    </Empty> -->
  </div>
</template>

<script>
import { Tabs, Tab, List, Toast, Empty } from 'vant';
import { getH5ConsumptionRecordsPage } from '@/api/user'
import { storageGet } from '@/utils/utils'
import CouponsList from '@/components/CouponsList.vue'
export default {
  components: {
    Tabs, Tab, List, CouponsList, Empty
  },
  name: 'myCoupons',
  data() {
    return {
      stateList: ["全部", "待收货", "待使用", "已赠送", "已过期", "退款/售后"],
      active: '',
      phone: storageGet('userPhone'),
      list: [],
      loading: true,
      finished: false,
      pageSize: 10,
      pageNum: 1,
      userInfo: '',
    }
  },
  created() {
    this.userInfo = storageGet('userInfo')
    this.active = this.$route.params ? this.$route.params.state : 0
    // console.log(this.$route)
    this.getList()
  },
  methods: {
    getList() {
      let isUsed = ''
      if (this.active == 1) {
        isUsed = 5
      } else if (this.active == 2) {
        isUsed = 0
      } else if (this.active == 3) {
        isUsed = 3
      } else if (this.active == 4) {
        isUsed = 2
      } else if (this.active == 5) {
        isUsed = 6
      } else {
        isUsed = ''
        // this.pageNum = 1
      }
      let userId = storageGet('userInfo').id
      let params = {
        openId:storageGet('userInfo').openid,
        phone: storageGet('userPhone'),
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        isUsed,
        isPage: 1,
        userId,
      }
      getH5ConsumptionRecordsPage(params)
        .then((response) => {
          console.log('response', response);
          if (response.code == 200) {
            let arr = response.data.records;
            this.list = this.pageNum == 1 ? arr : this.list.concat(arr);
            console.log('arr',arr);
            this.finished = arr.length == 0;
            this.pageNum++;
            setTimeout(() => {
              this.loading = false;
            }, 800)
          } else {
            this.finished = true
            Toast(response.msg || response.error_msg || response.message, 1000)
          }

        })
    },
    activeChange() {
      console.log(555);
      this.list = []
      this.pageNum = 1;
      this.getList();
    },
    gotoInfo(item) {
      let query = {
        rid: item.id,
        // isUsed: item.isUsed,
        // vouchersId: item.vouchersId,
      }
      console.log(item);
      // this.$router.push('/oilFilling/successOil')
      this.$router.push({
        path: item.type == 1 ? '/user/my-coupons/washCar' : '/user/my-coupons/detail',
        query: query
      })
    },
  }
};
</script>
<style scoped lang="scss">
.tabs-item-box {
  z-index: 100;
  position: fixed;
  left: 0px;
  top: 0;
  width: 100%;
}
::v-deep .van-tabs__line {
  width: 20px;
  position: absolute;
  bottom: 22px;
  left: 0;
}
::v-deep .van-tab {
  font-size: 12px;
  line-height: 0;
}
.wrap-box {
  min-height: 100vh;
  padding: 46px 0px 0px 0px;
  background: #fdfeff;
  // overflow-y: scroll;
}
.empty-box {
  width: 160px;
  margin: 161px auto 0;
  text-align: center;
  .img {
    width: 159px;
    height: 132px;
  }
  p {
    margin-top: 10px;
    font-weight: normal;
    font-size: 16px;
    color: #666666;
  }
}
</style>