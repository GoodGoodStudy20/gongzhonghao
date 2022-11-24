<template>
  <div class="box">
    <div class="box-top">
      <div class="city-box" @click="addresspage1">
        <div class="text-ellipsis">{{city}}</div>
        <!-- <Icon name="arrow-down" style="margin-left:3px"></Icon> -->
      </div>
      <div class="today-oil">
        <span class="today-oil-title">今日油价</span>
        <Swipe vertical :autoplay="2000" style="height:16px" loop :show-indicators="false" height="20">
          <SwipeItem v-for="(item,key) in oilPriceList" :key="item" class="swipe-item-oil">
            <span class="oil-type">{{key}}</span>
            <span class="oil-price">￥{{item}}</span>
          </SwipeItem>
        </Swipe>
      </div>
    </div>
    <!-- 展示图 -->
    <div class="oil-banner"><img src="@/assets/img/banner1.png" alt=""></div>
    <div class="oil-tab" :style="{width:productIdList.length>1?'250px':'150px'}">
      <Tabs v-model="active">
        <!-- <div class="petroChina-coupon" v-if="product.name">9.4折</div>
        <div class="petroChina-recharage" v-if="product2.name">9.4折</div> -->
        <!-- <Tab :title="product.name" class="oil-tab-item" v-if="product && product.name" badge="9.4折"> -->
        <Tab class="oil-tab-item" v-if="product && product.name" badge="9.4折">
          <template #title> {{product.name}} </template>
        </Tab>
        <Tab :title="product2.name" class="oil-tab-item" v-if="product2 && product2.name" badge="9.4折"></Tab>
      </Tabs>
    </div>
    <div v-if="active==0 && product && product.name">
      <ElectronicVoupons :list="vouchersList" :mid="mid" :product="product" :city="city"></ElectronicVoupons>
      <div class="title-bar">精选门店</div>
      <OilStation v-if="lat && lng" :type="1"></OilStation>
      <div style="width:100%;text-align:center;font-size:16px;padding:25px 0px;color:#afafaf" v-if="!lat || !lng || !regionCode">
        当前位置找不到服务网点，
        <div @click="reload" style="display:inline-block;color:#2a9dff;">点击刷新试试？</div>
      </div>
    </div>
    <div v-show="(active==1 || active2==1) && product2 && product2.name">
      <Recharge :mid="mid" :list="vouchersList2" :product='product2' :city="city"></Recharge>
      <div class=" title-bar">附近门店
      </div>
      <OilStation v-if="lat && lng" :type="0"></OilStation>
      <div style="width:100%;text-align:center;font-size:16px;padding:25px 0px;color:#afafaf" v-if="!lat || !lng || !regionCode">
        当前位置找不到服务网点，
        <div @click="reload" style="display:inline-block;color:#2a9dff;">点击刷新试试？</div>
      </div>
      <!-- <div style="padding:0 12px">
        <SelectShop :distance="0" :couponType="4" v-if="regionCode" :regionCode="regionCode" @shopClick="shopClick"></SelectShop>
      </div> -->
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
    <!-- <div v-if="active==2">
      <OilFilling></OilFilling>
    </div> -->

  </div>
</template>

<script>
import { getJsJDK, getOilPrice, getVouchers } from '@/api/user'
import wx from 'weixin-js-sdk'
import { getAllMobileMenuList, getOpenidUserInfo, getJournalismTouTiAoList, getOilCardBalance, RechargeOilCard, getProductConfigInfo } from '@/api/user'
import { Button, Field, Dialog, Toast, Icon, Tabs, Tab, Swipe, SwipeItem } from 'vant'
import { Debounce, storageSet, storageGet, storageRemove } from '@/utils/utils'
import { service_phone } from '@/utils/http'
import ElectronicVoupons from './electronicVoupons.vue'
import Recharge from './recharge.vue'
// import OilFilling from './index.vue'
import SelectShop from '@/components/SelectShop.vue'
import OilStation from '@/components/OilStation.vue'
export default {
  name: 'oilFingHome',
  components: { Button, Field, Icon, Tabs, Tab, ElectronicVoupons, SelectShop, Recharge, Swipe, SwipeItem, OilStation },
  data() {
    return {
      bg: [
        require('@/assets/img/wlyn/qrcodedjljy.png'),
        require('@/assets/img/wlyn/hn.png'),
      ],
      active: 0,
      active2: 0,
      integral: 0,
      bindPhone: '',
      form: {
        actualAmount: '',
        chargingPhone: ''
      },
      chargingAmountHn: '',
      city: '',
      checkIndex: null,
      ghId: {
        gd: 'gh_85d236dfcbaa',
        hn: 'gh_641fc8ab19f9'
      },
      mid: '',
      productId: '',
      product: {},
      product2: {},
      oilPriceList: {},//油价列表
      province: '',
      regionCode: '',
      vouchersList: [],//券列表
      vouchersList2: [],//券列表
      lat: storageGet('lat'),
      lng: storageGet('lng'),
      service_phone: service_phone,
      isShowTop: false,
      pageYOffset: '',
      isScroll: false,
      productIdList: []
    }
  },
  watch: {
    active() {
      this.$store.commit('setActive', this.active)
    },
    active2() {
      this.$store.commit('setActive2', this.active2)
    }
  },
  created() {
    this.oilPriceList = storageGet('PriceList')
    this.$store.commit('setActive', this.active)
    let selectCity = storageGet('selectCity');//选择的城市
    if (selectCity) {
      this.$store.commit('hasLocation', true)
      storageSet('City', selectCity)
      storageRemove('selectCity');
      // console.log(selectCity);
      this.city = selectCity
      this.$store.commit('setCity', this.city)
      this.SeachKeyCode(selectCity);  //获取城市的编码经纬度
    } else {
      this.city = storageGet('City')
      this.$store.commit('setCity', this.city)
      this.regionCode = storageGet('CityCode')
      console.log(this.city);
    }
    if (storageGet('productIdList')) {//
      this.productIdList = storageGet('productIdList')
    }
    if (storageGet('Province')) {
      this.province = storageGet('Province')
      this.province = this.province.substring(0, this.province.length - 1)
    }
    if (this.$route.query.id) {
      this.mid = this.$route.query.id
      this.$store.commit('setMid', this.$route.query.id)
    }
    // this.productId = this.$route.query.productId ? this.$route.query.productId : ''
    this.$nextTick(() => {
      this.getOilPrice()
      this.getList()
    })
    this.onload()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
    window.addEventListener('touchmove', this.handleTouchmove, true)
    window.addEventListener('touchend', this.handleTouchend, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    reload() {
      location.reload()
    },
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
    },
    handleTouchend() {
      this.isScroll = false
    },
    returnTop() {
      window.scroll(0, 0)
    },
    //获取兑换券
    async getList() {

      console.log(this.productIdList);
      if (this.productIdList.length > 1) {
        await getProductConfigInfo({ id: this.productIdList[0] }).then(res => {
          res.data.name = '中石油加油'
          this.product = res.data || {}
          console.log('product', this.product);
          this.$store.commit('setProduct', this.product)
          this.vouchersList = res.data.productAttributeConfigVOList || []
          // console.log('获取兑换券',res);
          this.$store.commit('setVouchersList', res.data.productAttributeConfigVOList)
        })
        if (this.productIdList[1]) {
          await getProductConfigInfo({ id: this.productIdList[1] }).then(res => {
            res.data.name = '中石化加油'
            this.product2 = res.data || {}
            this.$store.commit('setProduct2', this.product2)
            this.vouchersList2 = res.data.productAttributeConfigVOList || []
            this.$store.commit('setVouchersList2', this.vouchersList2)
          })
        }
        if (this.vouchersList[0].oilCouponType != 2) {
          let product3 = this.product
          this.product = this.product2
          this.$store.commit('setProduct', this.product)
          this.product2 = product3
          this.$store.commit('setProduct2', this.product2)
          let vouchersList3 = this.vouchersList
          this.vouchersList = this.vouchersList2
          this.vouchersList2 = vouchersList3
          this.$store.commit('setVouchersList2', this.vouchersList2)
        }
      } else {
        if (this.productIdList[0]) {
          const res = await getProductConfigInfo({ id: this.productIdList[0] })
          if (res.data.productAttributeConfigVOList[0].oilCouponType == 2) {
            this.product = res.data || {}
            this.$store.commit('setProduct', this.product)
            this.vouchersList = res.data && res.data.productAttributeConfigVOList || []
          } else {
            this.active = 1;
            this.$store.commit('setActive', 1)
            this.active2 = 1;
            this.$store.commit('setActive2', 1)
            this.product2 = res.data || {}
            this.$store.commit('setProduct2', this.product2)
            this.vouchersList2 = res.data && res.data.productAttributeConfigVOList || []
            this.$store.commit('setVouchersList2', this.vouchersList2)
          }
          console.log(this.vouchersList);
          console.log(this.active);
        } else {
          // console.log('333111');
          // console.log(window.location.href.split('?')[1].split('&')[0].split('=')[1]);
          let id = window.location.href.split('?')[1].split('&')[0].split('=')[1]
          this.mid = window.location.href.split('?')[1].split('&')[1].split('=')[1]
          this.$store.commit('setMid', this.mid)
          console.log(this.mid);
          const res = await getProductConfigInfo({ id: id })
          if (res.data.productAttributeConfigVOList[0].oilCouponType == 2) {
            this.product = res.data || {}
            this.$store.commit('setProduct', this.product)
            this.vouchersList = res.data && res.data.productAttributeConfigVOList || []
          } else {
            this.active = 1;
            this.$store.commit('setActive', 1)
            this.active2 = 1;
            this.$store.commit('setActive2', 1)
            this.product2 = res.data || {}
            this.$store.commit('setProduct2', this.product2)
            this.vouchersList2 = res.data && res.data.productAttributeConfigVOList || []
            this.$store.commit('setVouchersList2', this.vouchersList2)
          }
        }
      }

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
            // this.getList()
          }
        })
      })
    },
    async getOilPrice() {
      let param = {
        province: this.province
      }
      await getOilPrice(param).then(res => {
        if (res.code === 200) {
          console.log(this.oilPriceList);

          // console.log('55555',storageGet('PriceList'));
          // console.log('',this.oilPriceList);
          if (this.oilPriceList && this.oilPriceList.city) {
            this.oilPriceList = storageGet('PriceList')
          } else {
            this.oilPriceList = res.data || {}
            storageSet('PriceList', this.oilPriceList)
          }
          this.oilPriceList = res.data || {}
          storageSet('PriceList', this.oilPriceList)
          delete this.oilPriceList.city
        }

      })
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
    },
    addresspage1() { },
    addresspage() {
      this.$router.push({ path: '/Address' })
    },
    onload() {
      //查询首页菜单
      getAllMobileMenuList({ type: 1, isDisable: 0 }).then(res => {
        console.log(res)
        this.menuList = res.data || []
        let arr = res.data || []
        arr.forEach(item => {
          let obj = JSON.parse(JSON.stringify(item))
          if (!obj.childrenList) return
          obj.childrenList = obj.childrenList.filter(item => {
            let regionCode = item.regionCode ? item.regionCode.split(',') : ''
            return ((!regionCode || regionCode.includes(this.provinceCode)) && item.isDisable == 0)
          })
          if (!obj.childrenList) return

          let regionCode2 = item.regionCode ? item.regionCode.split(',') : ''
          if (!regionCode2 || regionCode2.includes(this.provinceCode)) {
            this[item.code] = obj
          }
          // if (item.code == 'home1') {
          //   this.home1 = obj
          // } else if (item.code == 'home2') {
          //   this.home2 = obj
          // } else if (item.code == 'home3') {
          //   this.home3 = obj
          // } else if (item.code == 'home4') {
          //   this.list4 = obj
          // } else if (item.code == 'home5') {
          //   this.list5 = obj
          // } else if (item.code == 'home6') {
          //   this.list6 = obj
          // }
          if (item.code == 'home6') {
            this.tabActive = obj.childrenList[0] ? obj.childrenList[0].code : ''
          }
        });
      })
      //查询微信用户信息
      getOpenidUserInfo({ openid: storageGet('openId') }).then(res => {
        if (res.code == 200) {
          if (!res.data) {//没有查到微信用户信息 需要重新授权并登录
            wxLoginAuthor()
            console.log('无效openid')
            return
          }
          if (!res.data.bindPhone) {//没有绑定手机号跳转登录页
            return
          }
          storageSet('userInfo', res.data)
          storageSet("userPhone", res.data.bindPhone);
          //查询是否有领取的权益
          rightsAndInterests(res.data.bindPhone).then(res => {
            for (let I of res.data) {
              this.Item.push(I)
            }
            if (res.data.length !== 0) {
              this.show = true
            }
          })
          //查询权益
          countVouchersInterests(res.data.bindPhone).then(res => {
            if (res.code == 200) {
              // 权益和优惠券的存储
              sessionStorage.setItem('my_integral', res.data.countIntegral ? res.data.countIntegral : 0);
            }
          })
        }
      })
      getJournalismTouTiAoList({ pageNum: 1, pageSize: 5 }).then(res => {
        this.newsList = res.data.data || []
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 10px 0;
  background: #fdfeff;
  // margin: 0 10px;
}
.box-top {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
  .city-box {
    display: flex;
    align-items: center;
    padding: 2px;
    margin-left: 10px;
    margin-bottom: 10px;
    width: 73px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #000;
    font-size: 14px;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
  }
  .today-oil {
    display: flex;
    align-items: center;
    font-weight: 400;
    .today-oil-title {
      font-size: 14px;
      color: #000000;
      opacity: 0.9;
    }
    .swipe-item-oil {
      line-height: 5px;
    }
    .oil-type {
      font-size: 13px;
      color: #403c36;
      opacity: 0.8;
      margin: 0 5px;
    }
    .oil-price {
      font-size: 13px;
      color: #f14f44;
      opacity: 0.8;
    }
  }
}
.oil-tab {
  // width: 200px;
  margin-bottom: 20px;
  position: relative;
  .petroChina-coupon {
    width: 34px;
    height: 14px;
    text-align: center;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 6px 2px;
    // padding: 0px 6px;
    font-weight: 400;
    font-size: 10px;
    line-height: 14px;
    color: #ffffff;
    position: absolute;
    top: 0;
    left: 65px;
  }
  .petroChina-recharage {
    width: 34px;
    height: 14px;
    text-align: center;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 6px 2px;
    // padding: 0px 6px;
    font-weight: 400;
    font-size: 10px;
    line-height: 14px;
    color: #ffffff;
    position: absolute;
    top: 0;
    left: 170px;
  }

  ::v-deep .van-info {
    top: -5px;
    right: -2px;
    font-weight: 400;
    font-size: 10px;
    border-radius: 6px 2px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  }
}
.title-bar {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: #000;
  margin: 16px 10px 14px;
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
.oil-banner {
  width: 351px;
  height: 150px;
  margin: 0 12px 14px;
  img {
    width: 100%;
    border-radius: 8px;
  }
}
// 设置切换导航字体效果
::v-deep .van-tab--active {
  font-size: 15px;
  font-weight: 700;
}
</style>