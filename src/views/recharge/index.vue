<template>
  <div class="box">
    <div class="msg-box2">
      <Field v-model="product.name" :border="false" readonly class="msg-title">
        <template #left-icon>
          <img class="icon-img" :src="icon" alt="">
        </template>
        <!-- <template #right-icon>
          <div class="record" @click="gotoList">充值记录</div>
        </template> -->
      </Field>
      <!-- /^(1[0-9]\d{10}$/ -->
      <div class="account-container">
        <div class="tips"><img src="../../assets/img/tips.png" alt=""><span>请确保账号无误，充值成功后不支持退换</span></div>
        <!-- <Field class="text-num" v-model="account" maxlength="11" oninput="value=value.replace(/^1\d{10}$/g,'')" type="number" :placeholder="product.accountType==0?'请输入手机号码':'请输入QQ号码'"></Field> -->
        <Field class="text-num" v-model="account" maxlength="11" @input="inputChange" type="number" :placeholder="product.accountType==0?'请输入手机号码':'请输入QQ号码'"></Field>
      </div>

    </div>
    <div class="product-box">
      <div class="title">套餐购买</div>
      <div class="product-list">
        <div v-for="(item,i) in productAttributeList" class="product" @click="activeProduct=i" :class="{active:activeProduct==i,'no-checked':activeProduct!=i}">
          <span class="recommend" v-if="i==0">推荐</span>
          <div class="product-container">
            <div class="product-name" :class="{'active-name':activeProduct==i}"> {{item.name}}VIP</div>
            <!-- <div class="product-price"><span class="price-type">￥</span>{{radio == 1?item.integralPrice:item.amountPrice}}</div> -->
            <div class="product-price" :class="{'active-price':activeProduct==i}"><span class="price-type">￥</span>{{radio == 1?item.integralPrice:item.amountPrice}}</div>
            <!-- <div class="product-price"><span class="price-type">￥</span>{{radio == 1 ? productAttributeList[activeProduct].integralPrice : productAttributeList[activeProduct].amountPrice}}</div> -->
            <!-- <div class="official-price">官方价:￥{{radio == 1?item.originalPrice:item.amountPrice}}</div> -->
            <div class="official-price" :class="{'active-official':activeProduct==i}">官方价:￥{{item.originalPrice}}</div>
            <!-- <div class="official-price">￥{{productAttributeList[activeProduct].originalPrice}}</div> -->
          </div>

        </div>
      </div>
      <!-- <div class="money" v-if="productAttributeList[activeProduct]">优惠充值价格：<span>{{radio == 1 ? productAttributeList[activeProduct].integralPrice : productAttributeList[activeProduct].amountPrice}}</span>元 <span class="originalPrice">￥{{productAttributeList[activeProduct].originalPrice}}</span></div> -->
    </div>
    <div class="msg-box3">
      <div class="title">支付方式</div>
      <!-- <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <Radio name="1" v-if=" productAttributeList[activeProduct] && Number(integral)>=Number(productAttributeList[activeProduct].integralPrice) && (product.paymentMode && product.paymentMode.includes('0'))">
          <div>权益支付 </div>
          <div class="notes">(剩余权益{{integral}}）</div>
        </Radio>
        <Radio name="2" style="margin:10px 0" v-if="product.paymentMode && product.paymentMode.includes('1')">微信支付</Radio>
        <Radio name="3" v-if="integral>0 && Number(integral)<Number(productAttributeList[activeProduct].amountPrice) && product.paymentMode && product.paymentMode.includes('2')">
          <div>组合支付</div>
          <div class="notes">(微信￥{{money}}+权益{{integral}}）</div>
        </Radio>
      </RadioGroup> -->
      <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <CellGroup :border="false">
          <Cell clickable @click="radio = '1'" :border="false" v-if="productAttributeList[activeProduct] && Number(integral)>=Number(productAttributeList[activeProduct].integralPrice) && (product.paymentMode && product.paymentMode.includes('0'))" class="equity-payment-cell">
            <div class="equity-payment">权益支付</div>
            <div class="notes">(剩余权益{{integral}}）</div>
            <template #right-icon>
              <Radio name="1">
              </Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '2'" v-if="product.paymentMode && product.paymentMode.includes('1')" :border="false" class="wechat-pay-cell">
            <div class="wechat-pay">微信支付</div>
            <template #right-icon>
              <Radio name="2" style="margin:10px 0" class="wechat-pay-outer"></Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '3'" :border="false" v-if="integral>0 && Number(integral)<Number(productAttributeList[activeProduct].amountPrice) && product.paymentMode && product.paymentMode.includes('2')" class="combined-payment-cell">
            <div class="combined-payment">组合支付</div>
            <div class="notes">(微信￥{{money}}+权益{{integral}}）</div>
            <template #right-icon>
              <Radio name="3">
              </Radio>
            </template>
          </Cell>
        </CellGroup>
      </RadioGroup>
    </div>
    <div class="btn-box">
      <div class="btn" @click="submit" :disabled='disableBtn'>确认支付</div>
    </div>
    <div class="channel-comparison">{{product.propaganda}}</div>
    <div class="bottom-box">
      <div class="title">温馨提示</div>
      <div v-html="product.notes" class="note-box"></div>
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
      <!-- <div class="fixed-item" v-show="isShowTop" @click="returnTop">
        <img class="fixed-img" src="../../assets/img/top.png" alt="">
        <div class="fixed-text">顶部</div>
      </div> -->
    </div>
    <Popup v-model="isLogin" class="popup-login" :style="{ height: '200px',width: '80%',overflow:'hidden','text-align':'center' }" :close-on-click-overlay="true">
      <div class="title">您还未登录九华保</div>
      <div class="is-login">是否登录九华保公众号 体验更多优惠活动？</div>
      <div class="login-btn">
        <div class="btn" @click="noLogin">否</div>
        <div class="btn" @click="login">是</div>
      </div>
    </Popup>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Cell, Field, RadioGroup, Radio, Dialog, Toast, CellGroup, Popup } from 'vant';
import CarSelect from '@/components/CarSelect.vue'
import { storageGet, NumberSub } from '@/utils/utils'
import { service_phone, } from '@/utils/http'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getJsJDK } from '@/api/user'
export default {
  name: 'recharge',
  components: { RadioGroup, Radio, Cell, Field, CarSelect, CellGroup, Popup },
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
      isLogin: false
    }
  },
  created() {
    this.mid = this.$route.query.id
    this.productId = this.$route.query.productId
    this.userInfo = storageGet('userInfo')
    this.getInfo()
    getJsJDK()
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
.box {
  height: 100vh;
  padding: 10px 0 10px;
  overflow-y: auto;
  font-size: 16px;
  background: #fff;
  .title {
    color: #333;
    font-size: 16px;
    font-weight: 700;
  }
}
.record {
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border-radius: 10px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  padding: 0px 10px;
}
.product-box {
  background: #fff;
  margin: 10px;
  padding: 10px 20px;
  box-shadow: 2px 2px 12px rgba(2, 10, 38, 0.08);
  border-radius: 6px;
  .product-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .product {
      position: relative;
      background: linear-gradient(
        180deg,
        rgba(255, 240, 225, 0.4) -11.16%,
        #ffe0c0 109.21%
      );
      margin-right: 2%;
      border: 1px solid #ef8e46;
      box-sizing: border-box;
      border-radius: 7.5px;
      width: 31%;
      // width: 100px;
      height: 112px;
      flex-shrink: 0;
      // height: 40px;
      // border-radius: 15px;
      // border: 1px solid #eee;
      text-align: center;
      // line-height: 40px;
      font-size: 14px;
      margin-top: 20px;
      // margin-left: 3%;
      color: #777;
      .recommend {
        width: 34px;
        height: 14px;
        line-height: 14px;
        font-size: 9px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(
          281.3deg,
          #ffcd9b 1.78%,
          rgba(255, 205, 155, 0.4) 104.76%
        );
        border-radius: 6px 0px;
      }
      // .product-container {
      // margin: 15px 10px 0 14px;
      // // background: #fff;
      // display: flex;
      // flex-direction: column;
      .product-name {
        text-align: left;
        margin-top: 18px;
        text-align: center;
        &.active-name {
          color: #8e4611;
          opacity: 0.9;
        }
      }
      .product-price {
        font-weight: 900;
        font-size: 22px;
        line-height: 30px;
        text-align: center;
        margin: 4px 0;
        .price-type {
          font-weight: 400;
          font-size: 15px;
          line-height: 16px;
        }
        &.active-price {
          color: #7d3e10;
        }
      }
      .official-price {
        font-weight: 400;
        font-size: 12px;
        text-align: left;
        text-align: center;
        // line-height: 17px;
        opacity: 0.8;
        text-decoration-line: line-through;
        &.active-official {
          color: #7d3e10;
          opacity: 0.8;
        }
      }
      // }
      &.no-checked {
        width: 97px;
        height: 96px;
        border: 0.5px solid rgba(0, 0, 0, 0.1);
        background: #fff;
        .product-name {
          font-weight: 400;
          font-size: 13px;
          line-height: 18px;
          color: #000;
          opacity: 0.7;
        }
        .product-price {
          font-weight: 800;
          font-size: 19px;
          line-height: 24px;
          color: #000;
          opacity: 0.9;
          .product-type {
            font-weight: 400;
            font-size: 12px;
          }
        }
        .official-price {
          font-weight: 400;
          font-size: 12px;
          color: #000;
          opacity: 0.8;
        }
      }
    }
    .active {
      color: #f14f44;
      border: 1px solid #f14f44;
    }
  }
  .money {
    margin-top: 20px;
    font-size: 13px;
    color: #555;
    span {
      color: red;
      margin: 0 5px;
    }
    .originalPrice {
      color: #aaa;
      text-decoration: line-through;
      font-size: 10px;
    }
  }
}
.msg-box {
  background: #fff;
  box-sizing: border-box;
  // height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  // margin: 10px 0;
  .notes {
    font-size: 12px;
    color: #999;
  }
}
.msg-box2 {
  background: #fff;
  .account-container {
    box-shadow: 2px 2px 12px rgba(2, 10, 38, 0.08);
    border-radius: 6px;
    margin: 0 10px;
    padding: 10px 0;
    .text-num {
      font-weight: 700;
      font-size: 20px;
      color: #000000;
      opacity: 0.8;
      ::placeholder {
        font-size: 16px !important;
        opacity: 0.6 !important;
        font-weight: 400 !important;
      }
      ::-webkit-input-placeholder {
        font-size: 16px !important;
        opacity: 0.6 !important;
        font-weight: 400 !important;
      }
      ::-moz-placeholder {
        font-size: 16px !important;
        opacity: 0.6 !important;
        font-weight: 400 !important;
      }
    }
  }
  .tips {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    color: #ef8e46;
    margin-left: 20px;
    display: flex;
    // margin-top: 10px;
    img {
      width: 13px;
      height: 13px;
      margin-right: 5px;
    }
  }
  .msg-title {
    display: flex;
    align-items: center;
    .icon-img {
      width: 48px;
      height: 48px;
      margin-top: 10px;
      margin-right: 10px;
    }
  }
}
.msg-title ::v-deep .van-field__control {
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  opacity: 0.9;
}
.msg-box3 {
  background: #fff;
  // margin: 10px 0;
  padding: 20px;
  box-sizing: border-box;
  // border-bottom: 1px solid #ccc;
  .equity-payment {
    position: relative;
    margin-left: 30px;
    &::before {
      display: inline-block;
      content: "";
      width: 20px;
      height: 20px;
      background: url("../../assets/img/equityPay.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 15px;
      left: -30px;
    }
  }
  .notes {
    margin-left: 30px;
    font-size: 12px;
    color: #999;
  }
  .wechat-pay {
    position: relative;
    margin-left: 30px;
    margin-top: 8px;
    &::before {
      display: inline-block;
      content: "";
      width: 20px;
      height: 20px;
      background: url("../../assets/img/wxpay.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 2px;
      left: -30px;
    }
  }
  .combined-payment {
    position: relative;
    margin-left: 30px;
    &::before {
      display: inline-block;
      content: "";
      width: 20px;
      height: 20px;
      background: url("../../assets/img/portfolioPayment.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 15px;
      left: -30px;
    }
  }
}
.bottom-box {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 10px 20px;
  margin-bottom: 60px;
  overflow: hidden;
  font-size: 13px;
  color: #777;
  img {
    width: 100%;
  }
}
.btn-box {
  width: 100%;
  // position: fixed;
  // bottom: 0;
  background: #fff;
  padding: 10px 0;
  .btn {
    color: #fff;
    width: 80%;
    height: 40px;
    margin: 0px auto;
    text-align: center;
    line-height: 40px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 50px;
  }
}
.channel-comparison {
  margin: 10px 30px;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  color: #000000;
  opacity: 0.6;
}

::v-deep .equity-payment-cell .van-radio__icon.van-radio__icon--round {
  margin-top: 16px !important;
}
::v-deep .wechat-pay-cell .van-radio__icon.van-radio__icon--round {
  margin-top: 2px !important;
}
::v-deep .combined-payment-cell .van-radio__icon.van-radio__icon--round {
  margin-top: 16px !important;
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
.popup-login {
  border-radius: 8px;
  .title {
    font-weight: 500;
    font-size: 17px;
    color: #000;
    opacity: 0.9;
    margin: 30px auto 16px;
  }
  .is-login {
    width: 160px;
    margin: 0 auto 32px;
    font-weight: 500;
    font-size: 16px;
    // line-height: 24px;
    color: #000;
    opacity: 0.5;
  }
  .login-btn {
    width: 100%;
    // height: auto;
    height: 45px;
    display: flex;
    justify-content: space-around;
    // align-items: center;
    border-top: 0.5px solid rgba(0, 0, 0, 0.1);
    .btn {
      width: 50%;
      height: 100%;
      font-weight: 500;
      font-size: 17px;
      color: #000000;
      opacity: 0.9;
      line-height: 45px;
      border-right: 0.5px solid rgba(0, 0, 0, 0.1);
    }
    .btn:last-of-type {
      width: 50%;
      // height: 50px;
      font-weight: 500;
      font-size: 17px;
      color: #576b95;
      opacity: 0.9;
      line-height: 45px;
      border-right: 0.5px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>