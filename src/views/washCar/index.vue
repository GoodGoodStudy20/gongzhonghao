<template>
  <div id="scroll">
    <div class="top-box">
      <div @click="addresspage" class="adresstext">
        <!-- <svg t="1617783947756" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2175" width="200" height="200">
          <path d="M512 959.47c-10.7 0-16.605-1.284-20.366-5.69-2.261-2.65-229.644-272.535-290.237-403.233-21.89-46.818-33.443-97.655-33.443-147.265 0-187.09 154.332-339.226 344.046-339.226s344.046 153.188 344.046 341.43c0 56.87-10.661 99.841-36.79 148.3-72.25 133.89-284.46 396.833-286.58 399.456-2.533 3.167-7.056 6.228-20.146 6.228H512z m0-687.067c-72.96 0-132.326 59.365-132.326 132.326S439.04 537.055 512 537.055s132.326-59.365 132.326-132.326S584.96 272.403 512 272.403z" fill="#3BA9F6" p-id="2176" />
        </svg> -->
        <span>{{city}}</span>
        <Icon name="arrow-down" style="margin-left:5px"></Icon>
      </div>
      <!-- <div @click="gotoMyCuopons" class="btn">{{type==1?'我的洗车券':'我的保养券'}}</div> -->
      <div @click="gotoMyCuopons" class="btn">
        <img src="../../assets/img/coupon.png" alt="">
        <span>我的</span>
      </div>
    </div>
    <div class="serve-bg">
      <img :src="serveImg" alt="" class="serve_Img">
      <!-- <div class="serve-title">
        <img class="serve-img" src="../../assets/img/serviceDescription.png" alt="">
        <div>服务说明：</div>
      </div>
      <div class="serve-text">
        <p>九华保汇聚全国优质洗车门店，为百万车主提供低价优质洗车服务，因全国门店众多，个别地区门店存在动态变化出现无法提供服务情况，如遇此情况烦请前往其他优质门店。</p>
      </div> -->
    </div>
    <div class="title-bar" v-if="list && list.length">{{type==1?'洗车券':'保养券'}}</div>
    <div class="banner-box" v-if="list && list.length">
      <WashCoupons :list="list" :city="city" :regionCode="regionCode"></WashCoupons>
    </div>
    <div class="title-bar1">优质服务店铺</div>
    <div style="padding:0 12px">
      <SelectShop :distance="0" :couponType="4" v-if="regionCode" :regionCode="regionCode" @shopClick="shopClick"></SelectShop>
    </div>
    <div class="fixed-right" :class="{'fixed-right-scroll':isScroll}">
      <div class="fixed-item" @click="toHome">
        <img class="fixed-img" src="../../assets/img/home.png" alt="">
        <div class="fixed-text">首页</div>
      </div>
      <div class="fixed-item">
        <img class="fixed-img" src="../../assets/img/serve.png" alt="">
        <div class="fixed-text"><a :href="'tel:'+service_phone">客服</a></div>
      </div>
      <div class="fixed-item" v-show="isShowTop" @click="returnTop">
        <img class="fixed-img" src="../../assets/img/top.png" alt="">
        <div class="fixed-text">顶部</div>
      </div>
    </div>
  </div>
</template>

<script>

import SelectShop from '@/components/SelectShop'
import WashCoupons from '@/components/WashCoupons'
import { Button, Toast, Empty, Icon } from 'vant';
import { getVouchers } from '@/api/user'
import { storageGet, storageSet, storageRemove } from '@/utils/utils'
import { service_phone, } from '@/utils/http'
export default {
  name: 'washCar',
  components: {
    SelectShop, WashCoupons, Button, Empty, Icon
  },
  data() {
    return {
      serveImg: require('@/assets/img/image six.png'),
      city: '',
      regionCode: '',
      list: [],
      isShowTop: false,
      service_phone: service_phone,
      pageYOffset: '',
      isScroll: false
    }
  },
  created() {
    let selectCity = storageGet('selectCity');//选择的城市
    if (selectCity) {
      this.city = selectCity;
      storageRemove('selectCity');
      this.SeachKeyCode(selectCity);  //获取城市的编码经纬度
    } else {
      this.city = storageGet('City');
      this.regionCode = storageGet('CityCode')
      this.getList()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
    window.addEventListener('touchmove', this.handleTouchmove, true)
    window.addEventListener('touchend', this.handleTouchend, true)
    // this.pageYOffset = window.pageYOffset
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    type() {
      return this.$route.meta.type
    },
  },
  methods: {
    toHome() {
      this.$router.push({ path: '/index/index' })
    },
    handleScroll() {
      let pageYOffset = window.pageYOffset
      this.pageYOffset = window.pageYOffset
      if (pageYOffset > 0) {
        this.isShowTop = true
      } else {
        this.isShowTop = false
      }
    },
    handleTouchmove() {
      this.isScroll = true
      // console.log(this.pageYOffset)
    },
    handleTouchend() {
      this.isScroll = false
      // console.log(this.pageYOffset)
    },
    returnTop() {
      window.scroll(0, 0)
    },
    getList() {
      let params = {
        pageNum: 1,
        pageSize: 10,
        vouchersType: this.type,
        regionCode: this.regionCode
      }
      getVouchers(params).then(res => {
        this.list = res.data.records
      })
    },
    addresspage() {
      this.$router.push('/Address')
    },
    gotoMyCuopons() {
      this.$router.push('/user/my-coupons/index')
    },
    SeachKeyCode(city) {
      AMap.plugin('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        })
        geocoder.getLocation(city, (status, result) => {
          console.log('定位,', status, result)
          if (status === 'complete' && result.info === 'OK') {
            this.regionCode = result.geocodes[0].adcode
            console.log(11111, this.regionCode)
            this.getList()
          }
        })
      })
    },
    gotoBuy(item) {
      this.$router.push(`/washCar/purchase?city=${this.city}&regionCode=${this.regionCode}&vouchersId=${item.vouchersId}`)
    },
    shopClick(item) {
      this.$router.push({
        path: '/washCar/shop',
        query: {
          id: item.id,
          shopCode: item.shopCode,
          type: item.type
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#scroll {
  background-color: #f6f7f9;
}
@keyframes ainim {
  0% {
    transform: translateX(0);
  }
  0% {
    transform: translateX(25px);
  }
}
.title-bar {
  margin: 20px 12px 14px 12px;
  padding: 0px 8px;
  font-weight: 700;
  color: #151515;
  font-size: 16px;
  width: 94%;
  // border-left: 6px solid #1e7efe;
}
.title-bar1 {
  margin: 20px 12px 14px 12px;
  padding: 0px 8px;
  font-weight: 700;
  color: #151515;
  font-size: 16px;
  width: 94%;
  // border-left: 6px solid #1e7efe;
}
.top-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  .adresstext {
    height: 30px;
    width: 100%;
    font-size: 14px;
    margin-top: 5px;
    margin-left: 15px;
    // text-indent: 1.8em;
    // svg {
    //   width: 5%;
    //   height: 5%;
    //   position: absolute;
    //   left: 5px;
    //   top: 5px;
    // }
  }
  .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 28px;
    margin: 10px;
    img {
      width: 20px;
      height: 20px;
    }
    span {
      display: inline-block;
      width: 28px;
      text-align: center;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #000;
      opacity: 0.8;
    }
    // line-height: 24px;
    // border-radius: 4px;
    // color: rgba(16, 16, 16, 100);
    // font-size: 12px;
    // text-align: center;
    // border: 1px solid rgba(187, 187, 187, 100);
  }
}
.serve-bg {
  width: 351px;
  height: 120px;
  margin: 9px auto;
  // background: url("../../assets/img/explainBack.png") no-repeat center;
  background-color: pink;
  background-size: 100% 100%;
  font-size: 12px;
  position: relative;
  color: #4b4b4c;
  border-radius: 8px;
  .serve_Img {
    // border-radius: 8px;
    width: 351px;
    height: 120px;
    border-radius: 8px;
  }
  .serve-title {
    position: absolute;
    top: 5px;
    display: flex;
    font-weight: 700;
    .serve-img {
      width: 16px;
      height: 16px;
      margin: 0 6px 0 5px;
    }
  }
  .serve-text {
    position: absolute;
    top: 25px;
    p {
      margin: 10px 10px 13px;
      font-weight: 400;
      line-height: 18px;
    }
  }
}
.banner-box {
  width: 96%;
  margin: 0 auto;
  .coupons-box {
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    width: 96%;
    margin: 20px auto;
    .coupons-box2 {
      padding: 5px 0;
      display: flex;
      .coupons-img {
        background: no-repeat center;
        background-size: 70px 70px;
        width: 95px;
        height: 70px;
      }
      .right-info {
        .title {
          font-size: 18px;
          color: #000000;
          font-weight: bolder;
          line-height: 25px;
        }
        .mark {
          font-size: 14px;
          color: #929292;
          line-height: 28px;
          height: 28px;
        }
        .tips {
          font-size: 14px;
          color: #333333;
          line-height: 20px;
        }
      }
    }

    .operation-bar {
      border-top: 1px solid #f1f1f1;
      width: 94%;
      margin: 0px 3%;
      padding: 5px 0px;
      display: flex;
      justify-content: space-between;
      p {
        margin: 0px;
        font-size: 18px;
        color: rgba(219, 33, 33, 0.671);
      }
      .button {
        width: 80px;
        height: 30px;
        border-radius: 4px;
        // color: rgba(16, 16, 16, 100);
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        background: rgba(219, 33, 33, 0.671);
        // border: 1px solid rgba(187, 187, 187, 100);
      }
    }
  }
}
.fixed-right {
  width: 50px;
  height: 168px;
  position: fixed;
  right: 0;
  transform: translateX(0);
  transition: transform 1s;
  bottom: 50px;
  color: #4b4b4c;
  .fixed-item {
    width: 50px;
    height: 48px;
    font-weight: 400;
    font-size: 12px;
    filter: drop-shadow(0px 2px 12px rgba(2, 10, 38, 0.08));
    border-radius: 50px 0px 0px 50px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    .fixed-img {
      width: 18px;
      height: 19px;
    }
    .fixed-text {
      font-weight: 400;
      a {
        color: #4b4b4c;
      }
    }
  }
  &.fixed-right-scroll {
    // right: -25px;
    transform: translateX(25px);
    transition: transform 0.4s;
    // animation: ainim 3s linear;
  }
}
</style>