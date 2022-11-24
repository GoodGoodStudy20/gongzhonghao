<template>
  <div class="home-box">

    <div class="search-box">
      <div class="city-box" @click="addresspage">
        <div class="text-ellipsis">{{city}}</div>
        <Icon name="arrow-down" style="margin-left:5px"></Icon>
      </div>
      <NoticeBar :scrollable="false" class="notice-box" background="#fdfeff" color="#999">
        <template #left-icon>
          <img class="img" src="@/assets/img/notice.png" alt="">
        </template>
        <Swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
          <SwipeItem v-for="item in newsList" :key="item.uniquekey">
            <div class="text-ellipsis notice-swipe" @click="jumpUrl({path:'/index/newsInfo?uniquekey='+item.uniquekey})">{{item.title}}</div>
          </SwipeItem>
        </Swipe>
      </NoticeBar>
      <div class="more-box" @click="jumpUrl({path:'/index/newsList'})">
        更多
        <Icon name="arrow"></Icon>
      </div>
    </div>
    <div class="swipe-box">
      <Swipe :autoplay="3000" indicator-color="white" class="swipe" indicatorColor="#F46356">
        <SwipeItem v-if="!home1.childrenList || !home1.childrenList.length">
          <img style="height:100%;width:100%;" src="@/assets/img/swipe.png" />
        </SwipeItem>
        <SwipeItem v-for="item in home1.childrenList" :key="item.id">
          <img style="height:100%;width:100%;" :src="item.icon" @click="jumpUrl(item)" />
        </SwipeItem>
      </Swipe>
    </div>
    <!-- 菜单 -->
    <!-- <div class="product-box" v-if="home2.childrenList && home2.childrenList.length">
      <div class="product" v-for="(item,i) in home2.childrenList" :key="i" @click="jumpUrl(item)">
        <img class="img" v-lazy="item.icon" alt="">
        <p class="title">{{item.label}}</p>
      </div>
    </div> -->
    <lazy-component>
      <div v-if="home3.childrenList && home3.childrenList.length">
        <p class="title-box">{{home3.label}}</p>
        <div class="home3-box">
          <div class="home3-itemL">
            <img :src="home3.childrenList[0].icon" class="img" @click="jumpUrl(home3.childrenList[0])" />
            <button class="home3-itemL-Btn">立即购买</button>
          </div>
          <div class="home3-itemR">
            <img :src="home3.childrenList[1].icon" class="img" @click="jumpUrl(home3.childrenList[1])" />
            <img :src="home3.childrenList[2].icon" class="img" @click="jumpUrl(home3.childrenList[2])" />
          </div>
        </div>
      </div>
      <!-- 特惠洗车 -->
      <div v-if="home4.childrenList && home4.childrenList.length">
        <p class="title-box">{{home4.label}}</p>
        <div class="home4-box">
          <img v-for="item in home4.childrenList" :key="item.id" :src="item.icon" class="img" @click="jumpUrl(item)" />
        </div>
      </div>
      <!-- 影音 -->
      <div v-if="home5.childrenList && home5.childrenList.length">
        <p class="title-box">{{home5.label}} <i class="more" @click="toGoodList">查看更多<Icon name="arrow" style="margin-left:5px"></Icon></i></p>
        <div class="home5-box">
          <div v-for="item in home5.childrenList" :key="item.id" @click="jumpGoodUrl(item)">
            <img :src="item.icon" class="img" />
            <span class="title">{{item.label | title}}</span>
            <span class="money"><i>￥</i><b>{{item.label|moneyNumOne}}.</b><em>{{item.label|moneyNumTwo}}</em></span>
          </div>
        </div>
      </div>
      <!-- 洗车店 -->
      <div v-if="home6.childrenList && home6.childrenList.length">
        <div class="home6-box">
          <p v-for="item in home6.childrenList" :key="item.id" class="title-box" :class="{active:item.code==tabActive}" @click="tabActive=item.code">{{item.label}}</p>
        </div>
        <SelectShop :distance="0" :couponType="4" v-if="regionCode && lat && lng && tabActive=='shop1'" :regionCode="regionCode" @shopClick="shopClick"></SelectShop>
        <OilStation v-if="lat && lng && tabActive=='shop2'"></OilStation>
        <!-- <checkStation v-if="lat && lng && tabActive=='shop3'"></checkStation> -->
        <div style="width:100%;text-align:center;font-size:16px;padding:25px 0px;color:#afafaf" v-if="!lat || !lng || !regionCode">
          当前位置找不到服务网点，
          <div @click="reload" style="display:inline-block;color:#2a9dff;">点击刷新试试？</div>
        </div>
      </div>
    </lazy-component>

    <Tpopup :show.sync="show" :Itemlist="Item"></Tpopup>
    <Tabbars :active="0"></Tabbars>
  </div>
</template>
<script>
import { storageGet, storageSet, storageRemove } from '@/utils/utils'
import { getOpenidUserInfo, rightsAndInterests, countVouchersInterests, getAllMobileMenuList, wxLoginAuthor, getJournalismTouTiAoList, getJsJDK } from '@/api/user'
import Tpopup from './components/Popup'
import SelectShop from '@/components/SelectShop'
import OilStation from '@/components/OilStation'
import checkStation from '@/components/checkStation'
import { Swipe, SwipeItem, Lazyload, Toast, Tabs, Tab, Field, Icon, NoticeBar } from 'vant';
import Tabbars from '@/components/tabbars.vue'
export default {
  components: {
    Tabs, Tab, Tabbars, Swipe, SwipeItem, Lazyload, Tpopup, SelectShop, OilStation, Field, Icon, NoticeBar, checkStation
  },
  props: ['nCity', 'nCityCode'],
  name: 'home',
  data() {
    return {
      home1: {},//轮播图
      home2: {},//菜单区
      home3: {},//活动一区
      home4: {},//活动二区
      home5: {},//活动三区
      home6: {},//门店
      tabActive: 'shop1',
      show: false,
      Item: [],
      openId: storageGet('openId'),
      lat: storageGet('lat'),
      lng: storageGet('lng'),
      regionCode: '',
      city: '',
      search: '',
      newsList: [],
      moneyNumOne: '',
      moneyNumTwo: ''
    }
  },
  created() {
    getJsJDK()
    let selectCity = storageGet('selectCity');//选择的城市
    if (selectCity) {
      this.$store.commit('hasLocation', true)
      storageSet('City', selectCity)
      storageRemove('selectCity');
      this.SeachKeyCode(selectCity);  //获取城市的编码经纬度
    } else {
      this.city = storageGet('City')
      this.regionCode = storageGet('CityCode')
    }
    this.onload()
  },
  watch: {
    nCityCode(val) {
      this.regionCode = val
    },
    nCity(val) {
      this.city = val
      this.getAllMobileMenuList()
    },
    menuActive(val) {//让菜单滚动到屏幕内
      let element = document.querySelector(`#p${val}`)
      element.scrollIntoView(false)
    }
  },
  filters: {
    title(e) {
      if ((e ?? '') !== '') {
        return e.split('￥')[0]
      }
    },
    moneyNumOne(e) {
      if ((e ?? '') !== '') {
        return e.split('￥') && e.split('￥')[1].split('.')[0]
      }
    },
    moneyNumTwo(e) {
      if ((e ?? '') !== '') {
        return e.split('￥') && e.split('￥')[1].split('.')[1]
      }

    }
  },
  computed: {
    provinceCode() {
      let code = this.regionCode ? (this.regionCode.substring(0, 2) + '0000') : ''

      return code
    },
  },
  methods: {
    getAllMobileMenuList() {
      getAllMobileMenuList({ type: 1, isDisable: 0 }).then(res => {
        this.menuList = res.data || []
        let arr = res.data || []
        arr.forEach(item => {
          let obj = JSON.parse(JSON.stringify(item))
          if (!obj.childrenList) return
          obj.childrenList = obj.childrenList.filter(item => {
            let regionCode
            if ((item.regionCode ?? '') !== '') {
              regionCode = item.regionCode ? item.regionCode.split(',') : ''
            } else {
              regionCode = ''
            }
            return ((!regionCode || regionCode.includes(this.provinceCode)) && item.isDisable == 0)
          })
          if (!obj.childrenList) return
          let regionCode2
          if ((item.regionCode ?? '') !== '') {
            regionCode2 = item.regionCode ? item.regionCode.split(',') : ''
          } else {
            regionCode2 = ''
          }
          // let regionCode2 = item.regionCode ? item.regionCode.split(',') : ''
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
    },
    onload() {
      //查询首页菜单
      getAllMobileMenuList({ type: 1, isDisable: 0 }).then(res => {
        this.menuList = res.data || []
        let arr = res.data || []
        arr.forEach(item => {
          let obj = JSON.parse(JSON.stringify(item))
          if (!obj.childrenList) return
          obj.childrenList = obj.childrenList.filter(item => {
            let regionCode
            if ((item.regionCode ?? '') !== '') {
              regionCode = item.regionCode ? item.regionCode.split(',') : ''
            } else {
              regionCode = ''
            }
            return ((!regionCode || regionCode.includes(this.provinceCode)) && item.isDisable == 0)
          })
          if (!obj.childrenList) return
          let regionCode2
          if ((item.regionCode ?? '') !== '') {
            //  regionCode = item.regionCode ? item.regionCode.split(',') : ''
            regionCode2 = item.regionCode ? item.regionCode.split(',') : ''
          } else {
            regionCode2 = ''
          }
          // let regionCode2 = item.regionCode ? item.regionCode.split(',') : ''
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
    reload() {
      location.reload()
    },
    toGoodList() {
      let userInfo = storageGet('userInfo') || {}
      if (storageGet("openId") && userInfo && userInfo.bindPhone) {
        this.$router.push({ path: '/seniorExecutiveEelect/index' })
        return
      }
      if (storageGet("openId") && userInfo && !userInfo.bindPhone) {
        this.$router.push({ path: '/login/index' })
        return
      }
    },
    jumpGoodUrl(item) {
      let userInfo = storageGet('userInfo') || {}
      if (storageGet("openId") && userInfo && userInfo.bindPhone) {
        if (item.path) {
          let pathId = item.path.split('?')[1].split('=')[1]
          this.$router.push({ path: '/seniorExecutiveEelect/detail', query: { id: pathId } })
          return
        }
      }
      if (storageGet("openId") && userInfo && !userInfo.bindPhone) {
        this.$router.push({ path: '/login/index' })
        return
      }
    },
    jumpUrl(item) {
      if (item.label === "年检代办") {
        let lat = storageGet('lat')
        let lng = storageGet('lng')
        let path = item.path + `?lat=${lat}&lng=${lng}`
        // console.log('ios', navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));
        if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          //  let nextPage = document.createElement('a');
          //  nextPage.setAttribute('href','https://zjctestapp.gongxingtech.com/#/');
          //  nextPage.click();
          //  $('body').append('<meta http-equiv="refresh" content="1;url=https://www.baidu.com/">');
          location.href = path;//此处判断是否为ios后,使用location.href跳转
        } else {
          window.location.href = path;//安卓跳转
        }
        // window.location.href=path
        return
      }
      let userInfo = storageGet('userInfo') || {}
      if (item.label === "话费充值") {
        // console.log('nologin',userInfo);
      } else {
        if (storageGet("openId") && userInfo && !userInfo.bindPhone) {
          this.$router.push({ path: '/login/index' })
          return
        }
      }
      if (item.path == '#') {
        Toast('敬请期待')
      } else {
        if (item.path.indexOf('http') != -1) {
          window.location.href = item.path
        } else {
          // let path = item.path.indexOf('?') != -1 ? `${item.path}&id=${item.id}` : `${item.path}?id=${item.id}`
          // this.$router.push(path)
          storageSet('Icon', item.icon)
          let path = item.path.indexOf('?') != -1 ? `${item.path}&id=${item.id}` : `${item.path}?id=${item.id}`
          if (path.indexOf(',') > -1) {
            let productIdList = []
            let mid = path.split('&')[1]
            storageSet('M_mid', mid.split('=')[1])
            path.split(',').forEach(it => {
              let a = it.split('&')[0].split('=')[1]
              productIdList.push(a)
            })
            storageSet('productIdList', productIdList)
            let path1 = path.split(',')[1]
            this.$router.push(path1)
          } else {
            let productIdList = []
            let c = path.split('?')[1].split('&')[0].split('=')[1]
            productIdList.push(c)
            storageSet('productIdList', productIdList)
            this.$router.push(path)
          }
        }
      }
    },
    addresspage() {
      this.$router.push({ path: '/Address' })
    },
    searchClick() {
      this.menuList.forEach((item, i) => {
        let index = item.childrenList.findIndex(child => child.label.includes(this.search))
        if (index > -1) {
          this.menuActive = i
          return
        }
      });
    },
    SeachKeyCode(city) {
      var that = this
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        })
        geocoder.getLocation(city, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 删除首次定位数据
            storageSet('City', city)
            storageSet('CityCode', result.geocodes[0].adcode)
            that.city = city
            that.regionCode = result.geocodes[0].adcode
          }
        })
      })
    },
    shopClick(item) {
      let userInfo = storageGet('userInfo') || {}
      if (storageGet("openId") && userInfo && !userInfo.bindPhone) {
        this.$router.push({ path: '/login/index' })
        return
      }
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
};
</script>
<style scoped lang="scss">
.home-box {
  background: #fdfeff;
  padding: 5px 12px 80px;
}
.title-box {
  height: 16px;
  padding: 0;
  margin: 20px 0 14px;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
  opacity: 0.9;
  .more {
    font-size: 12px;
    font-style: normal;
    color: #000;
    opacity: 0.7;
    float: right;
    margin-right: 8px;
  }
}
.swipe-box {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transform: translateY(0);
  .swipe {
    height: 100%;
    border-radius: 8px;
  }
}
.search-box {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  // margin-top: 10px;
  .city-box {
    display: flex;
    align-items: center;
    padding: 2px;
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
  .notice-box {
    flex: 1;
    display: flex;
    align-items: center;
    .img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
    .notice-swipe {
      height: 20px;
      font-weight: normal;
      font-size: 11px;
      line-height: 20px;
      color: #999 !important;
    }
  }
  .more-box {
    display: flex;
    align-items: center;
    white-space: nowrap; /*规定段落中的文本不进行换行 */
    flex-wrap: nowrap;
    margin-left: 12px;
    font-size: 12px;
    height: 20px;
    color: #999;
  }
}
.product-box {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .product {
    width: 48px;
    height: 72px;
    // margin-right: 20px;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    text-align: center;
    flex-shrink: 0;
    .img {
      width: 48px;
      height: 48px;
    }
    .title {
      padding: 0;
      margin: 0;
      margin-top: 8px;
      width: 48px;
      height: 16px;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      color: #00000090;
      white-space: nowrap; /*规定段落中的文本不进行换行 */
    }
  }
}
.home3-box {
  height: 158px;
  width: 100%;
  display: flex;
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  .home3-itemL {
    width: 168px;
    height: 158px;
    position: relative;
    &-Btn {
      width: 80px;
      height: 32px;
      border-radius: 40px;
      font-size: 13px;
      border: none;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      color: #fff;
      font-weight: 400;
      position: absolute;
      left: 12px;
      bottom: 22px;
    }
  }
  .home3-itemR {
    margin-left: 10px;
    width: 168px;
    display: flex;
    flex-direction: column;
    img {
      width: 100%;
      height: 74px;
    }
    img:nth-child(1) {
      margin-bottom: 10px;
    }
  }
}
.home4-box {
  width: 100%;
  height: 100px;
  display: flex;
  .img {
    width: 108px;
    height: 100%;
    border-radius: 8px;
  }
  .img:nth-child(2) {
    margin: 0 10px;
    width: 109px;
  }
}
.home5-box {
  width: 100%;
  display: flex;
  overflow-x: scroll;
  padding-bottom: 18px;
  div {
    width: 29%;
    height: 187px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    margin-right: 10px;
    img {
      width: 100%;
      height: 110px;
    }
    .title {
      margin-top: 10px;
      font-size: 14px;
      line-height: 20px;
      color: #000;
      opacity: 0.9;
    }
    .money {
      color: #f14f44;
      i {
        font-style: normal;
        font-size: 12px;
      }
      b {
        font-size: 18px;
        font-weight: 400;
      }
      em {
        font-style: normal;
        font-size: 16px;
      }
    }
  }
  // div:nth-child(2) {
  //   margin: 0 10px;
  // }
}
.home5-box::-webkit-scrollbar {
  display: none;
}
.home6-box {
  display: flex;
  .title-box {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #00000050;
    margin-right: 20px;
  }
  .active {
    text-align: center;
    font-size: 16px;
    color: #000000;
    &::after {
      content: " ";
      display: block;
      width: 25px;
      height: 3px;
      background: #f46356;
      border-radius: 31px;
      margin: 6px auto 0;
    }
  }
}
</style>