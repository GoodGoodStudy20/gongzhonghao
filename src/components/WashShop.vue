<template>
  <div class="box">
    <div class="img-box">
      <VanImage class="img" :src="shopInfo.logo" style="width:100%;height:100%">
        <template v-slot:error>
          <Icon name="warning" size="48" />
          <div style="margin-top:20px">暂无图片</div>
        </template>
      </VanImage>
    </div>
    <div class="content-box">
      <slot name="coupons"></slot>
      <div class="shop-name">{{shopInfo.name}}</div>
      <div class="shop-state">
        <Icon name="clock-o" size="16px" style="margin-right:8px" color="#666" />
        营业时间 : {{shopInfo.tradeTime}}
      </div>

      <div class="address-box">
        <div class="shop-address" @click="showSheet = true">
          <Icon name="location-o" size="17px" style="margin-right:4px" color="#666" />
          <div>
          <span>{{shopInfo.address}}</span>
          <div class="bar-box">
        <div class="address-distance" v-if="shopInfo.distance">距您 {{shopInfo.distance}}{{['M','m'].includes(shopInfo.distance[shopInfo.distance.length-1])?'':'km'}}</div>
        <div class="select-other-shop" @click="showSelectShop = true" v-if="showCheckOther">选择其他门店
          <Icon name="arrow" size="14px" color="#666" />
        </div>
          </div>
      </div>
        </div>
        <div class="btn-box">
          <div class="navigation-btn" @click="showSheet = true">
            <Icon name="guide-o" size="25px" color="#666" />
            <!-- <p>导航</p> -->
          </div>
          <div class="vertical_moulding">
            |
          </div>
          <a :href="'tel:'+shopInfo.phone" class="phone-btn">
            <Icon name="phone-o" size="25px" color="#666" />
            <!-- <p>电话</p> -->
          </a>
        </div>
      </div>
      <!-- <div class="bar-box">
        <div class="address-distance" v-if="shopInfo.distance">距您 {{shopInfo.distance}}{{['M','m'].includes(shopInfo.distance[shopInfo.distance.length-1])?'':'km'}}</div>
        <div class="select-other-shop" @click="showSelectShop = true" v-if="showCheckOther">选择其他门店
          <Icon name="arrow" size="14px" color="#666" />
        </div>
      </div> -->
    </div>
    <ActionSheet v-model="showSelectShop" title="选择其他门店">
      <div class="list-box">
        <SelectShop :showBtn="true" @selectShopFn="changeShop" v-bind="$attrs"></SelectShop>
      </div>
    </ActionSheet>
    <ActionSheet cancel-text="关闭" v-model="showSheet">
      <a class="map-jump-btn" :href="gaodeMap">高德地图</a>
      <a class="map-jump-btn" :href="baiduMap">百度地图</a>
    </ActionSheet>
  </div>
</template>

<script>
import { Toast, Swipe, SwipeItem, Popup, DropdownMenu, DropdownItem, ActionSheet, Image as VanImage, Icon } from 'vant';
import { storageSet, storageGet, bd_encrypt } from '@/utils/utils'
import SelectShop from './SelectShop.vue'
export default {
  name: 'WashShop',
  props: ['shopInfo', 'showCheckOther', 'isUsed'],
  components: {
    SelectShop, Swipe, SwipeItem, Popup, DropdownMenu, DropdownItem, ActionSheet, VanImage, Icon
  },
  data() {
    return {
      showSelectShop: false,
      showSheet: false,
      value1: 0,
      value2: '4',
      option1: [
        { text: '由近到远', value: 0 },
        { text: '由远到近', value: 1 },
      ],
      option2: [
        { text: '标准洗车', value: '4' },
        { text: '机油保养(全合成)', value: '8' },
        { text: '机油保养(半合成)', value: '19' },
        { text: '机油保养(矿物质)', value: '20' },
      ],
    }
  },
  computed: {
    gaodeMap() {
      return 'https://uri.amap.com/marker?position=' + this.shopInfo["lng"] + ',' + this.shopInfo["lat"] + '&name=' + this.shopInfo["name"] + '-' + this.shopInfo["address"]
    },
    baiduMap() {
      let item = bd_encrypt(this.shopInfo["lng"], this.shopInfo["lat"])
      return 'https://api.map.baidu.com/marker?location=' + item["lat"] + ',' + item["lng"] + '&title=' + this.shopInfo["name"] + '&content=' + this.shopInfo["address"] + '&output=html'
    },
  },
  methods: {
    changeShop(item) {
      this.showSelectShop = false
      this.$emit('changeShop', item)
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  padding-top: 10px;
  .img-box {
    width: 351px;
    height: 140px;
    margin: 0px auto;
    border-radius: 8px;
    overflow: hidden;
  }
  .content-box {
    transform: translateY(-25px);
    // box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    padding: 0 10px 13px;
    width: 351px;
    margin: 0 auto;
    background-color: #ffffff;
    overflow: hidden;
    .shop-name {
      padding-top: 12px;
      font-weight: bold;
      font-size: 16px;
      color: #333333;
    }
    .shop-state {
      width: 100%;
      font-size: 13px;
      color: #666;
      padding: 14px 0;
      display: flex;
      align-items: center;
      // box-shadow: 0px 0.5px 0px #dddddd;
    }
    .address-box {
      display: flex;
      justify-content: space-between;
      padding-top: 12px ;
      // box-shadow: 0px 0.5px 0px #dddddd;
        border-top: 1px solid #eee;
      .shop-address {
        display: flex;
        width: 238px;
        font-size: 12px;
        margin-right: 10px;
      }
      .vertical_moulding{
        color: #000;
        font-size: 25px;
        line-height: 25px;
        opacity: .2;
      }
      .btn-box {
        display: flex;
        text-align: center;
        padding-top: 6px ;
        // width: 68px;
        .navigation-btn {
          text-align: center;
          padding-right: 10px;
          // border-right: 1px solid #dddddd;
          font-size: 10px;
          color: #333333;
        }
        .phone-btn {
          padding-left: 10px;
          color: #333333;
          font-size: 11px;
        }
        p {
          padding: 0;
          margin: 0;
        }
      }
    }
    .bar-box {
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      .address-distance {
        font-size: 12px;
        color: #666666;
      }
      .select-other-shop {
        font-size: 12px;
        color: #666666;
        display: flex;
        align-items: center;
      }
    }
  }
}
.list-box {
  padding: 0 12px;
  width: 100%;
}
.Title-text {
  font-size: 18px;
  text-align: center;
  margin: 15px 0px 10px;
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