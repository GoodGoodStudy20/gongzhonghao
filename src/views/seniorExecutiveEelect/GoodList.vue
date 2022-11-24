<template>
  <div class="list">
    <!-- <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
    <div class="item" v-for="(item,index) in list" @click="toDetail(item)">
      <img class="img" :src="item.imageUrl" alt="">
      <div class="item-title">{{item.shortDescription}}</div>
      <div class="item-content">
        <div><span class="money">￥</span><span class="amount">{{item.price}}</span></div>
        <div class="sales-volume">月销{{item.salesNum
          }}+</div>
        <img src="@/assets/img/goodsCar.png" alt="">
      </div>
    </div>
    <!-- </List> -->
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Search, Cell, Field, RadioGroup, Radio, Dialog, Toast, CellGroup, Popup } from 'vant';
import CarSelect from '@/components/CarSelect.vue'
import { storageGet, NumberSub } from '@/utils/utils'
import { service_phone, } from '@/utils/http'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getJsJDK, getGoosPage } from '@/api/user'
export default {
  name: 'recharge',
  components: { Search, RadioGroup, Radio, Cell, Field, CarSelect, CellGroup, Popup },
  data() {
    return {
      search: '',
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
      loading: false,
      finished: false,
      list: [],
      form: {
        pageNum: 1,
        pageSize: 10,
        orderType: 0,
        search: ''
      },
    }
  },
  created() {
    this.mid = this.$route.query.id
    this.productId = this.$route.query.productId
    this.userInfo = storageGet('userInfo')
    // this.getInfo()
    this.getGoosPage()
    getJsJDK()
    this.icon = storageGet('Icon')
  },
  mounted() {
  },
  computed: {
    money() {
      return NumberSub(this.productAttributeList[this.activeProduct].amountPrice, this.integral)
    },
  },
  watch: {
    activeProduct(val) {
      if (Number(this.integral) >= Number(this.productAttributeList[this.activeProduct].integralPrice) && this.product.paymentMode.includes('0')) {
        this.radio = '1'
      } else if (this.product.paymentMode.includes('1')) {
        this.radio = '2'
      } else if (this.integral > 0 && Number(this.integral) < Number(this.productAttributeList[this.activeProduct].amountPrice) && this.product.paymentMode.includes('2')) {
        this.radio = '3'
      }
    }
  },
  methods: {
    getGoosPage() {
      getGoosPage(this.form).then(res => {
        console.log(res);
        this.list = res.data.records
      })
    },
    onLoad() { },
    toDetail(item) {
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
    handleTouchmove() {
      this.isScroll = true
      // console.log(this.pageYOffset)
    },
    handleTouchend() {
      this.isScroll = false
      // console.log(this.pageYOffset)
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
    gotoList() {
      this.$router.push('/oilFilling/list')
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

.list {
  font-family: "PingFang SC";
  // height: 100vh;
  // overflow-y: auto;
  font-size: 16px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 10px 0 50px;
  .item {
    width: 48%;
    margin-bottom: 10px;
    .img {
      width: 168px;
      height: 168px;
      border-radius: 10px;
    }
    .item-title {
      margin: 10px 0 6px 5px;
      color: #000;
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .money {
        color: #f14f44;
        line-height: 17px;
        font-size: 12px;
        margin-left: 5px;
      }
      .amount {
        font-size: 17px;
        color: #f14f44;
        line-height: 24px;
      }
      .sales-volume {
        color: #000;
        line-height: 17px;
        font-size: 12px;
        opacity: 0.6;
      }
      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
    }
  }
}
</style>