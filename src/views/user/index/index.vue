<template>
  <div class="box">
    <Cell is-link class="cell-top cell-top-background" :title="userInfo.nickname?userInfo.nickname:userInfoNull.nickname" center :border='false' to='/user/set/index'>
      <template #icon>
        <VanImage round style="width:68px;height:68px;margin-right:22px" :src="userInfo.headImgUrl?userInfo.headImgUrl:userInfoNull.headImgUrl" fit="cover" />
      </template>
      <template #right-icon>
        <Icon name="arrow" size="20" class="icon" color="#fff"></Icon>
      </template>
      <template #label>
        <span class="c-label">{{userInfo.bindPhone || ''}}</span>
      </template>
    </Cell>
    <div class="inter-big-box">
      <div class="inter-box">
        <div class="top">
          <div class="img-box">总权益</div>
          <div @click="gotoPage('/user/my-integral/index')" class="cash-btn">去提现<Icon style="margin-left:2px" name="arrow" size="13" color="#fff"></Icon>
          </div>
        </div>
        <div class="cash-box"><span class="yuan">￥</span>{{countIntegral || 0}}</div>
      </div>
      <div class="inter-box inter-box2">
        <div class="top">
          <div class="img-box">
            <!-- <img src="@/assets/img/电子加油coupon.png" alt=""> -->
            油卡余额
          </div>
          <div @click="gotoPage('/oilFilling/index?id=oil')" class="cash-btn">去使用<Icon style="margin-left:2px" name="arrow" size="13" color="#fff"></Icon>
          </div>
        </div>
        <div class="cash-box"><span class="yuan">￥</span>{{oilCardBalance || 0}}</div>
      </div>
    </div>
    <div class="order-box">
      <Cell is-link class="cell-top" style="padding-top:10px" :border='false' to='/seniorExecutiveEelect/orderList'>
        <template #title>
          <div class="title">我的订单</div>
        </template>
        <template #default>
          <div class="value">全部订单</div>
        </template>
        <!-- <template #right-icon>
          <Icon name="arrow" id="order-right-icon" size="16" color="#000"/>
        </template> -->
      </Cell>
      <div class="state-box">
        <div v-for="(item,i) in list" :key="item.name" class="state" @click="gotoCoupons(i)">
          <img :src="item.icon"></img>
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
    <!-- 联系我们 -->
    <div class="cell-box">
      <div class="cell" @click="gotoPage('/seniorExecutiveEelect/goodCar')">
        <img class="img" src="@/assets/img/user/shoppingCar.png" alt="">
        <div class="cell-right">
          <Badge :content="total">
            <p>购物车</p>
          </Badge>
          <Icon name="arrow" size="16" color="#969799"></Icon>
        </div>
      </div>
      <div class="cell" @click="overLayshowEvent" v-if="realNameList && realNameList.length">
        <img class="img" src="@/assets/img/user/1.png" alt="">
        <div class="cell-right">
          <p>领取油券<i style="color:#f14f44;margin-left:5px">new</i></p>
          <Icon name="arrow" size="16" color="#969799"></Icon>
        </div>
        <wx-open-launch-weapp id="launch-btn" username="gh_d3cc49c21749" path="" style="height:60px;width:325px;opcity:0;position:absolute;">
          <script type="text/wxtag-template">
            <div style="height:60px;width:325px;opcity:0;position:absolute;"></div>
          </script>
        </wx-open-launch-weapp>
      </div>
      <div class="cell" @click="historyfen">
        <img class="img" src="@/assets/img/equityHistory.png" alt="">
        <div class="cell-right">
          <p>权益历史</p>
          <Icon name="arrow" size="16" color="#969799"></Icon>
        </div>
      </div>
      <div class="cell" @click="gotoPage('/user/getIntegral')" v-if="realNameList2 && realNameList2.length">
        <img class="img" src="@/assets/img/user/5.png" alt="">
        <div class="cell-right">
          <p>工号领取权益</p>
          <Icon name="arrow" size="16" color="#969799"></Icon>
        </div>
      </div>
      <div class="cell">
        <img class="img" src="@/assets/img/user/4.png" alt="">
        <div class="cell-right">
          <p>联系我们</p>
          <div>
            <a href="tel:4006310818" style="color:#000000;margin-right:18px;opacity:0.7">4006310818</a>
            <!-- <Icon name="arrow" size="16" color="#969799"></Icon> -->
          </div>
        </div>
      </div>
      <div class="cell" @click="serviceInfo">
        <img class=" img" src="@/assets/img/user/serveInfo.png" alt="">
        <div class="cell-right">
          <p>服务指南</p>
          <Icon name="arrow" size="16" color="#969799"></Icon>
        </div>
      </div>
      <!-- <div class="cell" @click="showpdf=true">
        <img class=" img" src="@/assets/img/user/2.png" alt="">
        <div class="cell-right">
          <p>用户协议</p>
          <Icon name="arrow" size="16" color="#969799"></Icon>
        </div>
      </div> -->
      <div class="cell" @click="logout">
        <img class="img" src="@/assets/img/user/3.png" alt="">
        <div class="cell-right cell-last">
          <p>退出登录</p>
          <!-- <Icon name="arrow" size="16" color="#969799"></Icon> -->
        </div>
      </div>
    </div>
    <!-- 底部导航条 -->
    <Tabbars :active="1"></Tabbars>
    <Tpopup :show.sync="show" :Itemlist="Item"></Tpopup>
    <DrawalList :show.sync="showDrawalList" :list="drawalList"></DrawalList>
    <Pdftext :showpdf.sync="showpdf"></Pdftext>
    <Overlay :show.sync="overLayshow" @click="overLayClose">
      <div class="wrapper" @click.stop="overLayClose">
        <div class="block">
          <img src="@/assets/img/likeOil.png" alt="">
        </div>
      </div>
    </Overlay>
  </div>
</template>

<script>
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
import { storageGet, storageSet } from '@/utils/utils'
import Tpopup from '@/views/index/components/Popup.vue'
import { Image as VanImage, Form, Field, Cell, CellGroup, Icon, Popup, Dialog, Button, Overlay, Badge } from 'vant'
import Tabbars from '@/components/tabbars.vue'
import Pdftext from '@/components/Pdftext.vue'
import DrawalList from './components/DrawalList.vue'
import { countVouchersInterests, checkOilCardInterests, wxLoginAuthor, rightsAndInterests, getOpenidUserInfo, getIntegralWithdrawalByPhone, checkPhoneExists, getOilCardBalance, getShoppingCartPage } from '@/api/user'
export default {
  name: 'userIndex',
  components: {
    VanImage, Form, Field, Tabbars, Cell, CellGroup, Icon, Popup, Tpopup, Dialog, Button, DrawalList, Pdftext, Overlay, Badge
  },
  props: {},
  data() {
    return {
      list: [
        {
          icon: require('@/assets/img/user/ReceivingING.png'),
          name: '待收货',
          Number: 1
        },
        {
          icon: require('@/assets/img/user/待使用.png'),
          name: '待使用',
          Number: 0
        },
        // {
        //   icon: require('@/assets/img/user/已使用.png'),
        //   name: '已使用',
        //   Number:1
        // },
        {
          icon: require('@/assets/img/user/已赠送.png'),
          name: '已赠送',
          Number: 3
        },
        {
          icon: require('@/assets/img/user/已过期.png'),
          name: '已过期',
          Number: 2
        },
        {
          icon: require('@/assets/img/user/Aftermarket.png'),
          name: '退款/售后',
          Number: 4
        },
      ],
      overLayshow: false,
      showpdf: false,
      real_name: '',
      realNameList: [],
      realNameList2: [],
      userInfoNull: {
        headImgUrl: 'http://pic.616pic.com/ys_bnew_img/00/18/92/MM8TtBRjOv.jpg',
        nickname: '请点击登录'
      },
      userInfo: {},
      countIntegral: 0,  //权益
      countVouchers: 0, // 优惠券
      show: false,
      Item: [],
      drawalList: [],
      showDrawalList: false,
      oilCardBalance: '',
      total: ''
    };
  },
  created() {
    getJsJDK()
    if (!storageGet('openId') || storageGet('openId') == 'null') {
      // wxLoginAuthor()
      return
    }
    // this.userInfo = storageGet("userInfo")
    // 判断用户是否绑定手机号码
    let userInfo = storageGet('userInfo')
    if (storageGet("openId") && userInfo && !userInfo.bindPhone) {
      this.$router.push({ path: '/login/index' })
    } else {
      getOpenidUserInfo({ openid: storageGet("openId") }).then(res => {
        if (res.code == 200) {
          if (!res.data) {//没有查到微信用户信息 需要重新授权并登录
            wxLoginAuthor()
            this.$router.replace({ path: '/login/index' })
            return
          }
          if (!res.data.bindPhone) {//没有绑定手机号跳转登录页
            this.$router.replace({ path: '/login/index' })
            return
          }
          this.userInfo = res.data || {}
          storageSet('userInfo', res.data)
          storageSet("userPhone", res.data.bindPhone);
          this.createdState()
          this.getIntegralWithdrawalList()
          this.getOilCardBalance()
          this.getShoppingCartPage()
        }
      })
    }
  },
  methods: {
    historyfen() {
      this.$router.push({ path: '/user/my-integral/history', query: { countIntegral: this.countIntegral } })
    },
    getShoppingCartPage() {
      let param = {
        pageNum: 1,
        pageSize: 10,
        orderType: 0,
        search: '',
        userId: this.userInfo.id
      }
      getShoppingCartPage(param).then(res => {
        console.log(res.data);
        this.total = res.data.total
        // this.list = res.data.records
      })
    },
    overLayClose() {
      this.overLayshow = false
    },
    overLayshowEvent() {
      this.overLayshow = true
    },
    gotoPage(url) {
      this.$router.push(url)
    },
    gotoCoupons(i) {
      this.$router.push({
        name: 'orderList',
        params: { state: Number(i) + 1 }
      })
    },
    createdState() {
      let userInfo = storageGet('userInfo')
      if (userInfo !== null && userInfo.bindPhone) {
        countVouchersInterests(userInfo.bindPhone).then(res => {
          if (res.code == 200) {
            // 权益和优惠券的存储
            sessionStorage.setItem('my_integral', res.data.countIntegral ? res.data.countIntegral : 0);
            this.countIntegral = sessionStorage.getItem('my_integral')
            sessionStorage.setItem('my_countVouchers', res.data.countVouchers ? res.data.countVouchers : 0);
            this.countVouchers = sessionStorage.getItem('my_countVouchers')
          }
        }).then(res => {
          return rightsAndInterests(userInfo.bindPhone).then(res => {
            for (let I of res.data) {
              this.Item.push(I)
            }
            if (res.data.length !== 0) {
              this.show = true
            }
          })
        })
        this.checkPhone(userInfo.bindPhone)//前三后四
      }
    },

    getIntegralWithdrawalList() {
      if (!this.userInfo.bindPhone) return
      let params = {
        phone: this.userInfo.bindPhone
      }
      getIntegralWithdrawalByPhone(params).then(res => {
        this.drawalList = res.data || []
        this.showDrawalList = this.drawalList.length > 0
      })
    },
    getOilCardBalance() {
      if (!this.userInfo.bindPhone) return
      let params = {
        phone: this.userInfo.bindPhone
      }
      getOilCardBalance(params).then(res => {
        this.oilCardBalance = res.data || 0
        console.log(res)
      })
    },
    checkPhone(e) {
      checkOilCardInterests(e).then((res) => {
        if (res.data && res.data.length) {
          this.realNameList = res.data.map(item => { return { text: item.usedName } })
        }
      })
      checkPhoneExists(e).then((res) => {
        if (res.data && res.data.length) {
          this.realNameList2 = res.data.map(item => { return { text: item.usedName } })
        }
      })
    },
    logout() {
      Dialog.confirm({
        title: '确认退出吗？',
      }).then(() => {
        this.$router.replace('/login/index')
      }).catch(() => {
        // on cancel
      });
    },
    serviceInfo() {
      window.location.href = 'https://mp.weixin.qq.com/mp/homepage?__biz=MzU4ODg5NTE2Ng==&hid=5&sn=937bc8028570920095a49c15313c244f'
    }
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background: #fdfeff;
  padding-top: 10px;
  padding-bottom: 60px;
}
.cell-top {
  padding: 1px 13px;
}
.cell-top-background {
  margin-top: 20px;
  // color: #fff;
  background: #ffffff00;
}
.c-label {
  font-size: 13px;
}
.inter-big-box {
  width: 351px;
  height: 112px;
  background: #ffffff;
  // filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.08));
  margin: 16px auto 10px;
  // padding: 13px 30px;
  display: flex;
  border-radius: 6px;
  justify-content: space-between;
  position: relative;
  .inter-box {
    width: 167px;
    height: 88px;
    background: url(../../../assets/img/totalEquity.png) no-repeat;
    background-size: 100% 100%;
    // background: linear-gradient(139.05deg, #ffaf9b -17.56%, #f14f44 106.75%);
    // filter: blur(4px);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 0 10px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .img-box {
        font-size: 14px;
        // line-height: 20px;
        color: #ffffff;
      }
      .cash-btn {
        font-size: 12px;
        // line-height: 17px;
        color: #ffffff;
        opacity: 0.8;
      }
    }
    .cash-box {
      font-weight: 400;
      font-size: 22px;
      line-height: 31px;
      color: #ffffff;
      .yuan {
        font-size: 15px;
      }
    }
  }
  .inter-box2 {
    background: url(../../../assets/img/oilBalance.png) no-repeat;
    background-size: 100% 100%;
    // background: linear-gradient(140.58deg, #ffa68a -19.95%, #fd772c 105.62%);
  }
}
.order-box {
  background: #fff;
  margin: 0px auto;
  width: 351px;
  height: 103px;
  overflow: hidden;
  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.08));
  background: #fff;
  border-radius: 6px;
  .title {
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
  .value {
    font-weight: normal;
    font-size: 12px;
    color: #00000050;
    line-height: 26px;
  }
  .state-box {
    // padding: 15px 0;
    // padding-bottom: 14px;
    height: 41px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .state {
      // margin-top: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #00000090;
      img {
        width: 24px;
        height: 24px;
        margin: 0px 0 8px;
      }
    }
  }
}
.cell-box {
  margin: 12px auto 0;
  width: 351px;
  // height: 339px;
  // padding-bottom: 40px;
  background: #ffffff;
  box-shadow: 0px 0px 22px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  .cell {
    width: 351px;
    height: 60px;
    padding: 0 9px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    .img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin: 0 5px;
    }
    .cell-right {
      margin-left: 13px;
      height: 60px;
      flex: 1;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      // box-shadow: 0px 0.8px 0px rgba(0, 0, 0, 0.1);
      div {
        display: flex;
        align-items: center;
      }
    }
    .cell-last {
      border: none;
    }
  }
}
::v-deep .van-badge--fixed {
  top: 8px;
  right: -5px;
  background: #fb584d;
  border-radius: 50px;
}
// ::v-deep .van-icon-arrow {
//   padding-left: 5px;
//   color: #fff !important;
//   opacity: 0.8;
// }
::v-deep .van-cell__title {
  color: #000000;
  font-size: 20px;
  opacity: 0.9;
}
.icon {
  color: #000000 !important;
  opacity: 0.8;
}
// #order-right-icon{
//    color: #ccc !important;
//    transform: translateY(5px);
// }
</style>