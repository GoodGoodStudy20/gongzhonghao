<template>
  <div class="box">
    <div class="coupons-box" v-for="v in item.infoList" :key="v.infoId">
      <div class="coupons">
        <div class="top">
          <span>{{v.vouchersTitle}}</span>
          <p><span>x</span>{{v.vouchersNumber}}张</p>
        </div>
        <p class="middle"><i>￥</i>{{radio==1?item.integralPrice:[2,3,'2','3'].includes(radio)?item.amountPrice:item.integralPrice}}/{{v.vouchersNumber}}张<span>￥{{item.packagePrice}}/{{v.vouchersNumber}}张</span></p>
        <p class="middle"><i>￥</i>{{Math.round((radio==1?item.integralPrice:[2,3,'2','3'].includes(radio)?item.amountPrice:item.integralPrice)/v.vouchersNumber)}}/张<span>￥{{v.vouchersPrice}}/张</span></p>
      </div>
      <!-- <div class="title">洗车套餐</div> -->
      <!-- <Cell v-for="v in item.infoList" :key="v.infoId" :title="v.vouchersTitle" :value="`原价${v.vouchersPrice}`">
        <template #right-icon>
          <div style="margin-left:10px">{{v.vouchersNumber}}张</div>
        </template>
      </Cell> -->
    </div>
    <div class="msg-box">
      <div class="title">订单金额</div>
      <div style="font-weight:700">￥{{radio==1?item.integralPrice:[2,3,'2','3'].includes(radio)?item.amountPrice:item.integralPrice}}</div>
    </div>
    <div class="msg-box3">
      <div class="title">支付方式</div>
      <!-- <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <Radio name="1" v-if="Number(integral)>=Number(item.integralPrice)">
          <div>权益支付</div>
          <div class="notes">(剩余权益{{integral}}）</div>
        </Radio>
        <Radio name="2" style="margin:10px 0">微信支付</Radio>
        <Radio name="3" v-if="integral>0 && Number(integral)<Number(item.amountPrice)">
          <div>组合支付</div>
          <div class="notes">(微信￥{{money}}+权益{{integral}}）</div>
        </Radio>
      </RadioGroup> -->
      <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <CellGroup :border="false">
          <Cell clickable @click="radio = '1'" :border="false" v-if="Number(integral)>=Number(item.integralPrice)" class="equity-payment-cell">
            <div class="equity-payment">权益支付</div>
            <div class="notes">(剩余权益{{integral}}）</div>
            <template #right-icon>
              <Radio name="1">
              </Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '2'" :border="false" class="wechat-pay-cell">
            <div class="wechat-pay">微信支付</div>
            <template #right-icon>
              <Radio name="2" style="margin:10px 0" class="wechat-pay-outer"></Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '3'" :border="false" v-if="integral>0 && Number(integral)<Number(item.amountPrice)" class="combined-payment-cell">
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
      <div>使用说明</div>
      <div v-html="item.ruleContent"></div>
    </div>
    <div class="btn-box">
      <Button class="btn" @click="submit" :disabled='disableBtn || !radio'>立即支付</Button>
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
import { countVouchersInterests, vouchersPackageRecharge, getPackageByPackageNumber, getJsJDK } from '@/api/user'
export default {
  name: 'rechargeSetMeal',
  components: { RadioGroup, Radio, Cell, Button, CellGroup, Popup },
  data() {
    return {
      item: {},
      radio: 0,
      userInfo: {},
      integral: 0,
      code: '',
      city: '',
      vouchersId: '',
      disableBtn: false,
      isLogin: false
    }
  },
  created() {
    this.code = this.$route.query.code
    this.userInfo = storageGet('userInfo')
    this.getInfo()
    getJsJDK()
    console.log(NumberSub(20, 19.99), '结果', this.item)
  },
  computed: {
    money() {
      return NumberSub((this.radio == 1 ? this.item.integralPrice : this.item.amountPrice), this.integral)
    },
  },
  methods: {
    getInfo() {
      getPackageByPackageNumber({ packageNumber: this.code }).then(res => {//查套餐优惠券详情
        this.item = res.data || {}
        countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
          if (res.code == 200) {
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
            if (Number(this.integral) >= Number(this.item.integralPrice)) {
              this.radio = '1'
            }
          }
        })
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
      if (!this.userInfo.bindPhone) {
        Toast('请先登录')
        this.$router.push({ path: '/login/index' })
      }
      if (!this.userInfo.bindPhone) {
        this.isLogin = true
        return
      }
      let dom = ''
      if (this.radio == 1) {
        dom = `确认使用${this.item.integralPrice}权益兑换该优惠券套餐吗？`
      } else if (this.radio == 2) {
        dom = `确认使用${this.item.amountPrice}元购买该优惠券套餐吗？`
      } else if (this.radio == 3) {
        dom = `确认使用${this.integral}权益及${this.money}元购买该优惠券套餐吗？`
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
            if (this.radio != 1) {
              let pay = res.data || {}
              wx.chooseWXPay({  //此方法应放在调用后台统一下单接口成功后回调里面，接口返回  timeStamp，nonceStr，package，paySign等参数
                appId: pay.appId,  //此参数可不用
                timestamp: pay.timeStamp,
                nonceStr: pay.nonceStr,
                package: pay.packageValue,
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
              this.$router.replace('/user/my-coupons/index')
            }
          }
          let data = {
            amount: this.radio == 1 ? 0 : this.radio == 2 ? this.item.amountPrice : this.radio == 3 ? this.money : 0,
            integral: this.radio == 1 ? this.item.integralPrice : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,
            payMode: this.radio - 1,
            phone: this.userInfo.bindPhone,
            usedArea: storageGet('CityCode'),
            pid: this.item.pid,
          }
          vouchersPackageRecharge(data).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '兑换确认',
        message: dom,
        confirmButtonColor: '#F14F44',
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
  // border-bottom: 1px solid #ccc;
  box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .notes {
    font-size: 12px;
    color: #999;
  }
  .title {
    color: #333;
    font-size: 16px;
    font-weight: 700;
  }
}
.msg-box3 {
  box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
  box-sizing: border-box;
  padding: 10px;
  min-height: 80px;
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
  .title {
    color: #333;
    font-size: 16px;
    font-weight: 700;
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
.msg-box2 {
  margin: 0 10px;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
}
.bottom-box {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 10px 10px;
  overflow: hidden;
  img {
    width: 100%;
  }
  p {
    margin: 2px !important;
    padding: 2px !important;
  }
}
.btn-box {
  width: 100%;
  position: fixed;
  bottom: 0;
  background: #fff;
  padding: 10px 0;
  text-align: center;
}
.btn {
  color: #fff;
  width: 331px;
  height: 40px;
  margin: 0px auto;
  text-align: center;
  line-height: 40px;
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border-radius: 50px;
  font-weight: bold;
  font-size: 16px;
}

.coupons-box {
  background: url("../../assets/img/bg.png");
  background-size: 100% 100%;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: 10px auto;
  width: 351px;
  height: 137px;
  border-radius: 8px;
  .coupons {
    width: 100%;
    height: 100%;
    padding: 24px 21px;
    color: #fff;
    .top {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      span:nth-child(1) {
        font-weight: bold;
        font-size: 18px;
      }
      p:nth-child(2) {
        padding: 0;
        margin: 0;
        text-align: center;
        font-weight: 700;
        font-size: 22px;
        padding: 5px 10px;
        width: 95px;
        background: #ffffff;
        border-radius: 67px;
        color: #387dff;
        i {
          font-style: normal;
          font-weight: 900;
          font-size: 16px;
        }
      }
    }
    .middle {
      font-size: 14px;
      font-weight: bold;
      margin: 10px 0;
      i {
        font-size: 10px;
        font-weight: normal;
        font-style: normal;
      }
      span {
        font-size: 12px;
        font-weight: normal;
        text-decoration: line-through;
        color: #ffffff;
        margin-left: 15px;
        opacity: 0.5;
      }
    }
  }
  .title {
    font-size: 18px;
    color: #000000;
    font-weight: bolder;
    line-height: 25px;
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