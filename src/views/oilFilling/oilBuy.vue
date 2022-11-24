<template>
  <div class="box">
    <div class="coupons-box2">
      <img class="bg-img" src="@/assets/img/coupons.png" alt="">
      <p class="title">加油券</p>
      <div class="bottom-info">
        <img src="@/assets/img/shiYoulogo.png" alt="">
        <div>
          <div class="tips">{{item.name}}</div>
          <div class="mark">中石油官方直营店可使用</div>
        </div>
      </div>
    </div>
    <div class="msg-box">
      <div class="font-color">有效期</div>
      <div class="font-color">180天</div>
    </div>
    <div class="msg-box">
      <div class="font-color">订单金额</div>
      <div class="font-color" style="font-weight:700"><span>￥</span>{{radio==1?item.integralPrice:item.amountPrice}}</div>
    </div>
    <div class="msg-box3">
      <div class="font-color" style="margin-left:10px">支付方式</div>
      <!-- <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <Radio name="1" v-if="Number(integral)<=Number(item.integralPrice)" label-position="left">
          <div class="equity-payment">权益支付</div>
          <div class="notes">(剩余权益{{integral}}）</div>
        </Radio>

        <Radio name="2" style="margin:10px 0" class="wechat-pay-outer" label-position="left"><span class="wechat-pay">微信支付</span></Radio>
        <Radio name="3" v-if="integral>0 && Number(integral)<Number(item.amountPrice)" label-position="left">
          <div class="combined-payment">组合支付</div>
          <div class="notes">(微信￥{{money}}+权益{{integral}}）</div>
        </Radio>
      </RadioGroup> -->
      <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <CellGroup :border="false">
          <Cell clickable @click="item.integralPrice < integral?radio = '1':''" :border="false" v-if="item.integralPrice < integral &&product.paymentMode && product.paymentMode.includes('0')" class="equity-payment-cell">
            <div class="equity-payment">权益支付</div>
            <div class="notes">(剩余权益{{integral}}）</div>
            <template #right-icon>
              <Radio name="1" :disabled="item.integralPrice > integral">
              </Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '2'" v-if="product.paymentMode && product.paymentMode.includes('1')" :border="false" class="wechat-pay-cell">
            <div class="wechat-pay">微信支付</div>
            <template #right-icon>
              <Radio name="2" style="margin:10px 0" class="wechat-pay-outer"></Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '3'" :border="false" v-if="item.integralPrice > integral && product.paymentMode && product.paymentMode.includes('2')" class="combined-payment-cell">
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
    <div class="bottom-box rich-text">
      <div style="margin-left:10px">使用说明</div>
      <div style="margin-left:10px" v-html="product.notes"></div>
    </div>
    <div class="btn-box">
      <Button class="btn" :style="{'opacity':radio!=0?'1':'0.5'}" @click="submit" :disabled='disableBtn'>立即支付</Button>
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
import { mapState } from 'vuex'
import wx from 'weixin-js-sdk'
import { Cell, RadioGroup, Radio, Dialog, Toast, Button, CellGroup, Popup } from 'vant';
import { storageGet, NumberSub } from '@/utils/utils'
import { countVouchersInterests, addProductRecharge, getVouchersInfo, getJsJDK } from '@/api/user'
export default {
  name: 'oilBuy',
  components: { RadioGroup, Radio, Cell, Button, CellGroup, Popup },
  data() {
    return {
      item: {},
      radio: 0,
      userInfo: {},
      integral: 0,
      regionCode: '',
      city: '',
      vouchersId: '',
      disableBtn: false,
      product: {},
      mid: '',
      isLogin: false
    }
  },
  async created() {
    this.item = storageGet('Item')
    this.mid = this.$route.query.id
    this.product = storageGet('Product')
    this.regionCode = this.$route.query.regionCode
    this.city = this.$route.query.city
    this.vouchersId = this.$route.query.vouchersId
    this.userInfo = storageGet('userInfo')
    this.getInfo()
    getJsJDK()
  },
  computed: {
    money() {
      return NumberSub((this.radio == 1 ? this.item.integralPrice : this.item.amountPrice), this.integral)
    },
  },
  methods: {
    getInfo() {
      countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
        if (res.code == 200) {
          this.integral = res.data.countIntegral ? res.data.countIntegral : 0
          if (Number(this.integral) >= Number(this.item.integralPrice)) {
            this.radio = '1'
          } else {
            this.radio = ''
          }
        }
      })
    },
    noLogin() {
      this.isLogin = false
    },
    login() {
      this.isLogin = false
      this.$router.push({ path: '/login/index' })
    },
    submit() {
      if (!this.radio) {
        Toast('请选择支付方式')
        return
      }
      // if (!this.userInfo.bindPhone) {
      //   Toast('请先登录')
      //   this.$router.push({ path: '/login/index' })
      // }
      if (!this.userInfo.bindPhone) {
        this.isLogin = true
        return
      }
      let dom = ''
      if (this.radio == 1) {
        dom = `确认使用${this.item.integralPrice}权益兑换该优惠券吗？`
      } else if (this.radio == 2) {
        dom = `确认使用${this.item.amountPrice}元购买该优惠券吗？`
      } else if (this.radio == 3) {
        dom = `确认使用${this.integral}权益及${this.money}元购买该优惠券吗？`
      }
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let success = async res => {
            await done()
            this.disableBtn = false
            if (res.code != 200) {
              Toast(res.msg || '兑换失败')
              return
            }
            console.log(res);

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
                    this.$router.push(`/oilFilling/successOil?amount=${this.amount}&msg=${this.mid == 'oil' ? '' : res.data}`)
                  }

                },
                cancel: r => {
                  //支付取消
                  // this.$router.replace('/user/my-coupons/index')
                  if (r.errMsg == 'chooseWXPay:cancel') {
                    Toast('取消支付', 1200);
                  } else {
                    Toast('支付关闭', 1200);
                  }
                }
              });
            } else {
              Toast('兑换成功')
              // this.$router.replace('/user/my-coupons/index')
              this.$router.replace(`/oilFilling/successOil?amount=${this.item.originalPrice}`)
            }
          }
          let data = {
            actualPrice: this.radio == 1 ? this.item.integralPrice : this.radio == 2 ? this.item.amountPrice : this.radio == 3 ? NumberSub(this.money, this.integral) : 0,
            price: this.item.originalPrice,
            payAmount: this.radio == 1 ? 0 : this.radio == 2 ? this.item.amountPrice : this.radio == 3 ? this.money : 0,
            payIntegral: this.radio == 1 ? this.item.integralPrice : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,
            rechargeMode: this.radio - 1,
            userPhone: this.userInfo.bindPhone,
            productAttribute: this.item.id,
            rechargeAccount: this.userInfo.bindPhone,
            mid: this.mid
          }
          addProductRecharge(data).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '兑换确认',
        message: dom,
        // confirmButtonColor: '#F14F44',
        beforeClose
      })
    },

  }
}
</script>

<style scoped lang="scss">
.box {
  padding: 0px 0 60px;
  font-size: 16px;
}
.msg-box {
  margin: 0 10px;
  box-sizing: border-box;
  padding: 10px;
  box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .notes {
    font-size: 12px;
    color: #999;
  }
}
.msg-box2 {
  margin: 0 10px;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
}
.msg-box3 {
  margin: 0 10px;
  padding: 20px 0;
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
  box-sizing: border-box;
  padding: 20px 10px 10px;
  overflow: hidden;
  div {
    line-height: 30px;
  }
  img {
    width: 100%;
  }
}
.btn-box {
  width: 100%;
  position: fixed;
  bottom: 0;
  background: #fff;
  padding: 10px 0;
  text-align: center;
  .btn {
    color: #fff;
    width: 331px;
    height: 40px;
    margin: 0px auto;
    text-align: center;
    line-height: 40px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 50px;
  }
}
.coupons-box2 {
  width: 350px;
  height: 119px;
  position: relative;
  background: #ecb654;
  margin: 0 auto;
  border-radius: 6px;
  .bg-img {
    position: absolute;
    width: 100px;
    bottom: -30px;
    right: -10px;
    // transform: rotate(-30deg);
  }
  .title {
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    color: #f9f9f9;
    padding: 7px 14px;
    border-bottom: 1px dashed #fff;
    position: relative;

    &::after {
      position: absolute;
      content: " ";
      display: block;
      height: 16px;
      width: 8px;
      border-radius: 8px 0 0 8px;
      background: #fff;
      bottom: -8px;
      right: 0px;
    }

    &::before {
      position: absolute;
      content: " ";
      display: block;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      height: 16px;
      width: 8px;
      border-radius: 0 8px 8px 0;
      background: #fff;
      bottom: -8px;
      left: 0px;
    }
  }
  .bottom-info {
    display: flex;
    padding-left: 6px;
    align-items: center;
    color: #fff;
    img {
      width: 60px;
      height: 60px;
      margin-right: 14px;
    }
    .tips {
      font-weight: bold;
      font-size: 16px;
      line-height: 15px;
    }
    .mark {
      margin-top: 15px;
      font-size: 13px;
      color: #f8f8f8;
    }
  }
}
.font-color {
  color: #333;
  font-weight: 700;
  font-size: 17px;
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
::v-deep .equity-payment-cell .van-radio__icon.van-radio__icon--round {
  margin-top: 16px !important;
}
::v-deep .wechat-pay-cell .van-radio__icon.van-radio__icon--round {
  margin-top: 2px !important;
}
::v-deep .combined-payment-cell .van-radio__icon.van-radio__icon--round {
  margin-top: 16px !important;
}
</style>