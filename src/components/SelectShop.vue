<template>
  <div style="margin-bottom:50px">
    <List v-model="loading" style="height:100%" :finished="finished" finished-text="" @load="getShopList">
      <div class="coupons-box" v-for="(item,index) in shopList" :key="index" @click="shopClick(item)">
        <lazy-component class="coupons-img">
          <img class="img" :src="item.logo" v-if="showBtn"></img>
          <VanImage class="img" :src="item.logo" v-else>
            <template #error>
              <div class="error-box">
                <Icon name="warning" size="28" />
                <div>暂无图片</div>
              </div>
            </template>
          </VanImage>
        </lazy-component>
        <div class="right-info">
          <div class="title text-ellipsis">{{item.name}}</div>
          <div class="middle-box">
            <div class="rate-box">
              <Rate class="rate" v-model="rates" :size="14" color='#F46356' readonly />
              <span class="span">5.0分</span>
            </div>
          </div>
          <div class="address-box">
            <span class="address">{{item.address}}</span>
            <span class="distance">
              <Icon name="guide-o" size='12' />{{item.distance}}km</span>
          </div>
        </div>
      </div>
    </List>

    <Empty v-if="!shopList || !shopList.length" description="暂无店铺"></Empty>
  </div>
</template>
<script>
import { Rate, List, Toast, Empty, Image as VanImage, Icon } from 'vant';
import { getShopPage } from '@/api/user'
import { storageGet } from '@/utils/utils'
export default {
  name: '',
  components: {
    Rate, List, Empty, VanImage, Icon
  },
  props: ['distance', 'couponType', 'showBtn', 'regionCode', 'servicesCode'],
  data() {
    return {
      rates: 5,
      pageNum: 1,         // 页码
      pageNum2: 1,         // 页码
      shopList: [],
      loading: false,
      finished: false,
    }
  },
  watch: {
    // distance(n, o) {
    //   this.shopList = []
    //   this.pageNum = 1
    //   this.getShopList()
    // },
    // couponType(n, o) {
    //   this.shopList = []
    //   this.pageNum = 1
    //   this.getShopList()
    // }
  },
  methods: {
    selectShop(item) {
      this.$emit("selectShopFn", item)
    },
    shopClick(item) {
      this.$emit("shopClick", item)
      if (this.showBtn) {
        this.$emit("selectShopFn", item)
      }
    },
    getShopList() {
      let params = {
        distance: 0,
        pageSize: 10,
        pageNum: this.pageNum,
        lat: storageGet('lat'),
        lng: storageGet('lng'),
        regionCode: this.regionCode || storageGet('CityCode'),
        ...this.$attrs.search
      }
      getShopPage(params).then((response) => {
        if (response.code == 200) {
          let arr = response.data.records || [];
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
    }
  }
};
</script>
<style  scoped lang="scss">
.coupons-box {
  width: 351px;
  height: 96px;
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
    // overflow: hidden;
    .img {
      width: 110px;
      height: 74px;
    }
    .error-box {
      margin-top: 20px;
      text-align: center;
    }
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
      margin-top: 8px;
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
      margin-top: 19px;
      color: #00000060;
      .address {
        width: 152px;
        font-size: 11px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .distance {
        font-size: 10px;
        flex-shrink: 0;
        white-space: nowrap;
        margin-right: 8px;
      }
    }
  }
}
</style>