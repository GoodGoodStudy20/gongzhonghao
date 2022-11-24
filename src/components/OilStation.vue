<template>
  <div style="margin-bottom:50px;">
    <List v-model="loading" style="height:100%" :finished="finished" finished-text="" @load="getShopList">
      <div class="coupons-box" v-for="(item,index) in shopList" :key="index" @click="shopClick(item)">
        <img class="coupons-img" v-if="type==0" src="@/assets/img/w18.png" alt="" style="width:80px">
        <img class="coupons-img" v-if="type==1" src="@/assets/img/shiYoulogo.png" alt="" style="width:80px">
        <div class="right-info">
          <div class="right-info-top">
            <div class="title text-ellipsis">{{item.stationName}}</div>
            <div class="address-box">
              <div class="address">{{item.stationAddress}}</div>
              <div class="distance" @click="Gomap(item)">
                <Icon name="guide-o"></Icon>{{item.distance}}km
              </div>
            </div>
            <div class="middle-box">
              <div class="rate-box">
                <Rate class="rate" v-model="rates" :size="14" color='#F46356' readonly />
                <span class="span">5.0分</span>
              </div>
            </div>
          </div>
          <!-- 立即加油按钮 -->
          <div class="right-info-btn">
            <div class="btn-box"><span class="button" @click="gotoBuy(item)">立即加油</span></div>
          </div>
        </div>
      </div>
    </List>
    <Empty v-if="!shopList || !shopList.length" description="暂无加油站"></Empty>
    <ActionSheet cancel-text="关闭" v-model="showSheet" duration=0.4>
      <a class="map-jump-btn" :href="gaodeMap">高德地图</a>
      <a class="map-jump-btn" :href="baiduMap">百度地图</a>
    </ActionSheet>
  </div>
</template>
<script>
import { Rate, List, Toast, Empty, Icon, Button, ActionSheet } from 'vant';
import { getGasStationPage } from '@/api/user'
import { storageGet, bd_encrypt } from '@/utils/utils'
export default {
  name: '',
  components: {
    Rate, List, Empty, Icon, Button, ActionSheet
  },
  props: ['type'],
  data() {
    return {
      rates: 5,
      pageNum: 1,         // 页码
      shopList: [],
      loading: false,
      finished: false,
      showSheet: false,
      gaodeMap: '',
      baiduMap: ''
    }
  },
  watch: {
    distance(n, o) {
      this.shopList = []
      this.pageNum = 1
      this.getShopList()
    },
    couponType(n, o) {
      this.shopList = []
      this.pageNum = 1
      this.getShopList()
    }
  },
  mounted() {
    this.getShopList();
  },
  methods: {
    Gomap(item) {
      this.gaodeMap = 'https://uri.amap.com/marker?position=' + item["lng"] + ',' + item["lat"] + '&name=' + item["stationName"] + '-' + item["stationAddress"]
      let item1 = bd_encrypt(item["lng"], item["lat"])
      this.baiduMap = 'https://api.map.baidu.com/marker?location=' + item1["lat"] + ',' + item1["lng"] + '&title=' + this.$store.state.addressDetail["stationName"] + '&content=' + this.$store.state.addressDetail["stationAddress"] + '&output=html'
      this.showSheet = true
    },
    selectShop(item) {
      this.$emit("selectShopFn", item)

    },
    shopClick(item) {
      this.$emit("shopClick", item)
    },
    getShopList() {
      let params = {
        pageNum: this.pageNum,
        pageSize: 15,
        lat: storageGet('lat'),
        lng: storageGet('lng'),
        type: this.type,//0：中石化，1：中石油
      }
      getGasStationPage(params)
        .then((response) => {
          if (response.code == 200) {
            let arr = response.data.records;
            this.shopList = this.pageNum == 1 ? arr : this.shopList.concat(arr)
            this.finished = arr.length == 0;
            this.pageNum++
            setTimeout(() => {
              // 加载状态结束
              this.loading = false;
            }, 800)
          } else {
            this.finished = true
            Toast(response.msg || response.error_msg || response.message, 1000)
          }

        }).catch(err => {
          this.finished = true
        })
    },
    gotoBuy(item) {
      this.$store.commit('setAddressDetail', item)
      this.$router.push('/oilFilling/oilDetail')
    }
  }
};
</script>
<style lang="scss" scoped>
.coupons-box {
  width: 351px;
  margin: 0 auto;
  height: 111px;
  background: rgba(255, 255, 255, 0.82);
  border-radius: 6px;
  display: flex;
  padding: 11px 0;
  margin-bottom: 8px;
  filter: drop-shadow(2px 4px 12px rgba(0, 0, 0, 0.08));
  .coupons-img {
    border-radius: 3px;
    width: 110px;
    height: 74px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .right-info {
    flex: 1;
    margin-left: 10px;
    .title {
      width: 220px;
      height: 19px;
      font-weight: bold;
      font-size: 14px;
      line-height: 19px;
      color: #000000;
    }
    .middle-box {
      // margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rate-box {
        display: flex;
        align-items: center;
        .span {
          font-size: 11px;
          color: #f46356;
          margin-left: 2px;
        }
      }
    }
    .address-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // margin-top: 19px;
      //新添加
      margin: 8px 0; //新添加
      color: #00000060;
      .address {
        font-weight: 400; //新添加
        line-height: 10px; //新添加
        width: 152px;
        font-size: 11px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgba(0, 0, 0, 0.6);
      }
      .distance {
        //新添加
        background: #f5f5f5;
        border-radius: 20px;
        // width: 50px;
        padding: 1px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        //新添加
        font-size: 10px;
        flex-shrink: 0;
        white-space: nowrap;
        margin-right: 8px;
      }
    }
    // 按钮
    .btn-box {
      float: right;
      margin-bottom: 11px;
      .button {
        margin-right: 9px;
        display: block;
        width: 76px;
        height: 26px;
        border-radius: 30px;
        // color: rgba(16, 16, 16, 100);
        color: #fff;
        font-size: 13px;
        font-weight: 400;
        text-align: center;
        line-height: 28px;
        background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      }
    }
  }
}
.map-jump-btn {
  color: #333333;
  width: 100%;
  display: inline-block;
  text-align: center;
  font-size: 18px;
  padding: 10px 0px;
  line-height: 30px;
}
.map-jump-btn:first-child {
  border-bottom: 1px solid #eee;
}
</style>