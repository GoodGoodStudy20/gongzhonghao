<template>
  <div class="box">
    <div class="top-search">
      <div class="box-top">
        <div class="home" @click="toHome">
          <Icon name="arrow-left" size="13" /> 九华保</div>
        <div class="home2" @click="toGoodCar">
          <img src="@/assets/img/user/shoppingCar.png" alt="">
          <div>购物车</div>
        </div>
      </div>
    </div>
    <Search v-model="form.search" @search="search" class="search" placeholder="搜索商品名称"></Search>
    <div class="select-container">
      <div class="select-item" :class="{'active':activeProduct==0}" @click="handleClick(0)">综合</div>
      <div class="select-item" :class="{'active':activeProduct==1}" @click="handleClick(1)">销量</div>
      <div class="select-item" :class="{'active':activeProduct==2}" @click="handleClick(2)">价格 <img class="img" src="@/assets/img/top-bottom.png" alt=""></div>
      <div class="select-item" :class="{'active':activeProduct==3}" @click="handleClick(3)">上新</div>
    </div>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id" @click="toDetail(item)">
        <img class="img" :src="item.imageUrl[0]" alt="">
        <div class="item-title">{{item.shortDescription}}</div>
        <div class="item-content">
          <div><span class="money">￥</span><span class="amount">{{item.price}}</span></div>
          <div class="sales-volume">月销{{item.salesNum}}+</div>
          <img src="@/assets/img/goodsCar.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Search, Cell, Field, RadioGroup, Radio, Dialog, Toast, CellGroup, Popup, Icon } from 'vant';
import CarSelect from '@/components/CarSelect.vue'
import { storageGet, NumberSub } from '@/utils/utils'
import { service_phone, } from '@/utils/http'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getJsJDK, getGoosPage } from '@/api/user'
export default {
  name: 'recharge',
  components: { Search, RadioGroup, Radio, Cell, Field, CarSelect, CellGroup, Popup, Icon },
  data() {
    return {
      item: {},
      radio: 0,
      userInfo: {},
      integral: 0,
      activeProduct: 0,
      account: '',
      product: {},
      productAttributeList: [],
      mid: '',
      productId: '',
      disableBtn: false,
      icon: '',
      isScroll: false,
      service_phone: service_phone,
      pageYOffset: '',
      isLogin: false,
      form: {
        pageNum: 1,
        pageSize: 10,
        orderType: 0,
        search: '',
        orderBy: 'DESC'
      },
      list: [],
      type: ''
    }
  },
  created() {
    this.mid = this.$route.query.id
    this.productId = this.$route.query.productId
    this.userInfo = storageGet('userInfo')
    // this.getInfo()
    this.getGoosPage()
    // getJsJDK()
    this.icon = storageGet('Icon')
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
    window.addEventListener('touchmove', this.handleTouchmove, true)
    window.addEventListener('touchend', this.handleTouchend, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    money() {
      return NumberSub(this.productAttributeList[this.activeProduct].amountPrice, this.integral)
    },
  },
  watch: {
    // activeProduct(val) {
    //   if (Number(this.integral) >= Number(this.productAttributeList[this.activeProduct].integralPrice) && this.product.paymentMode.includes('0')) {
    //     this.radio = '1'
    //   } else if (this.product.paymentMode.includes('1')) {
    //     this.radio = '2'
    //   } else if (this.integral > 0 && Number(this.integral) < Number(this.productAttributeList[this.activeProduct].amountPrice) && this.product.paymentMode.includes('2')) {
    //     this.radio = '3'
    //   }
    // },
  },
  methods: {
    search() {
      this.getGoosPage()
    },
    async handleClick(type) {
      console.log(type);
      this.type = type
      this.form.orderType = type
      if (this.form.orderBy == 'ASC') {
        this.form.orderBy = 'DESC'
      } else if (this.form.orderBy == 'DESC') {
        this.form.orderBy = 'ASC'
      }
      await this.getGoosPage()
      // this.form.orderBy = 'ASC'
      console.log(this.form.orderBy);
      // this.form.orderBy = 'DESC'
      this.activeProduct = type

    },
    toGoodCar() {
      this.$router.push({ path: '/seniorExecutiveEelect/goodCar' })
    },
    toDetail(item) {
      console.log('43321');

      this.$router.push({ path: '/seniorExecutiveEelect/detail', query: { id: item.id } })
    },
    inputChange() {
      if (!this.userInfo.bindPhone) {
        this.isLogin = true
      }
    },
    noLogin() {
      this.isLogin = false
      this.account = ''
    },
    login() {
      this.isLogin = false
      this.$router.push({ path: '/login/index' })
    },
    toHome() {
      this.$router.push({ path: '/index/index' })
    },
    handleScroll() {
      let pageYOffset = window.pageYOffset
      this.pageYOffset = window.pageYOffset
      console.log(this.pageYOffset);

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
    getGoosPage() {
      getGoosPage(this.form).then(res => {
        console.log(res);
        this.list = res.data.records

      })
    },
    getInfo() {
      getProductConfigInfo({ id: this.productId }).then(res => {
        this.product = res.data || {}
        this.product.paymentMode = this.product.paymentMode ? this.product.paymentMode.split(',') : []
        this.productAttributeList = this.product.productAttributeConfigVOList || []
        if (!this.productAttributeList.length) {
          Toast('暂无该充值服务')
          this.$router.go(-1)
          return
        }
        countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
          if (res.code == 200) {
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
            //权益够，默认勾选权益支付
            if (Number(this.integral) > Number(this.productAttributeList[this.activeProduct].integralPrice) && this.product.paymentMode.includes('0')) {
              this.radio = '1'
            } else if (this.product.paymentMode.includes('1')) {
              this.radio = '2'
            }
          }
        })
      })
    },
    submit() {
      let reg = /^1[0-9]{10}$/g
      if (!this.account) {
        Toast('请输入充值账号')
        return
      }
      if (!reg.test(this.account)) {
        Toast('请输入正确的手机号')
        return
      }
      if (!this.radio) {
        Toast('请选择支付方式')
        return
      }
      let dom = ''
      if (this.radio == 1) {
        dom = `<div>确认使用${this.productAttributeList[this.activeProduct].integralPrice}权益充值吗？</div><div>充值账号：<span style='color:red'>${this.account}</span></div>`
      } else if (this.radio == 2) {
        dom = `<div>确认使用${this.productAttributeList[this.activeProduct].amountPrice}元充值吗？</div><div>充值账号：<span style='color:red'>${this.account}</span></div>`
      } else if (this.radio == 3) {
        dom = `<div>确认使用${this.integral}权益及${this.money}元充值吗？</div><div>充值账号：<span style='color:red'>${this.account}</span></div>`
      }


      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let success = async res => {
            await done()
            this.disableBtn = false
            if (res.code != 200) {
              Toast(res.msg || '充值失败')
              return
            }
            if (this.radio != 1) {
              let pay = res.data || {}
              wx.chooseWXPay({  //此方法应放在调用后台统一下单接口成功后回调里面，接口返回  timeStamp，nonceStr，package，paySign等参数
                appId: pay.appId,  //此参数可不用
                timestamp: pay.timeStamp,
                nonceStr: pay.nonceStr,
                package: pay.packageValue || pay.package,
                signType: pay.signType,
                paySign: pay.paySign,
                success: r => {
                  // 支付成功后的回调函数  
                  if (r.errMsg == "chooseWXPay:ok") {
                    //支付成功  
                    Toast('支付成功', 1200);
                    this.$router.replace('/user/my-coupons/index')
                  }
                },
                cancel: r => {
                  //支付取消
                  // this.$router.replace('/oilFilling/list')
                  if (r.errMsg == 'chooseWXPay:cancel') {
                    Toast('取消支付', 1200);
                  } else {
                    Toast('支付关闭', 1200);
                  }
                }
              });
            } else {
              Toast('充值成功')
              this.$router.replace('/user/my-coupons/index')
            }
          }
          let data = {
            actualPrice: this.radio == 1 ? this.productAttributeList[this.activeProduct].integralPrice : this.productAttributeList[this.activeProduct].amountPrice,//实付价格
            payAmount: this.radio == 1 ? 0 : this.radio == 2 ? this.productAttributeList[this.activeProduct].amountPrice : this.radio == 3 ? this.money : 0,//支付金额
            payIntegral: this.radio == 1 ? this.productAttributeList[this.activeProduct].integralPrice : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,//支付权益
            price: this.productAttributeList[this.activeProduct].originalPrice,//售价
            productAttribute: this.productAttributeList[this.activeProduct].id,//产品id
            rechargeAccount: this.account,//充值账户
            rechargeMode: Number(this.radio) - 1,//充值方式(0.权益充值,1.微信充值,2.组合充值)
            userPhone: this.userInfo.bindPhone,//用户手机号
            mid: this.mid//菜单id
          }
          addProductRecharge(data).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '充值确认',
        message: dom,
        beforeClose
      })
    },

  }
}
</script>

<style scoped lang="scss">
@keyframes ainim {
  0% {
    transform: translateX(0);
  }
  0% {
    transform: translateX(25px);
  }
}
::v-deep .van-search__content {
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 6px;
}
.box {
  font-family: "PingFang SC";
  height: 100vh;
  // padding: 0 15px;
  overflow-y: auto;
  font-size: 16px;
  background: #f6f7f9;
  .top-search {
    .box-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0 0;
      background: #fff;
      padding: 10px 20px;
      border-radius: 6px;
      .home {
        font-size: 13px;
        line-height: 18px;
        color: #000000;
        opacity: 0.7;
        // &::before {
        //   display: inline-block;
        //   content: "<";
        //   margin-right: 5px;
        // }
      }
      .home2 {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        font-size: 13px;
        line-height: 18px;
        color: #000000;
        opacity: 0.7;
      }
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
  .select-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    .select-item {
      text-align: center;
      width: 25%;
      font-size: 14px;
      color: #000000;
      opacity: 0.9;
      .img {
        width: 12px;
        height: 12px;
        vertical-align: middle3;
      }
      &.active {
        color: #fb584d;
      }
    }
  }
  .search {
    padding: 0;
    margin: 10px 10px 0;
  }

  .list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;
    padding: 0 15px;
    .item {
      width: 48%;
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 10px;
      .img {
        width: 100%;
        height: 168px;
        border-radius: 10px 10px 0 0;
      }
      .item-title {
        padding: 0 6px;
        margin: 10px 0 6px;
        color: #000;
        opacity: 0.9;
        font-size: 14px;
        font-weight: 600;
        font-style: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .item-content {
        padding: 0 6px;
        display: flex;
        align-items: center;
        .money {
          color: #f14f44;
          line-height: 17px;
          font-size: 12px;
        }
        .amount {
          font-size: 17px;
          color: #f14f44;
          line-height: 24px;
        }
        .sales-volume {
          margin-left: 9px;
          flex: 1;
          color: #000;
          line-height: 17px;
          font-size: 12px;
          opacity: 0.6;
        }
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .title {
    color: #333;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>