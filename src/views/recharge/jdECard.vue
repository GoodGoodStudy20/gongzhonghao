<template>
  <div class="box">
    <div class="top-msg">
      <div class="top-msg-box">
        <!-- <img src="@/assets/img/w18.png" alt=""> -->
        <div>
          <div class="title">{{product.name}}</div>
          <div class="msg">您有{{integral}}权益</div>
        </div>
        <div class="cont-right">
          <div class="record" @click="gotoList">充值记录</div>
        </div>
      </div>
      <!-- <div class="note">*充值到中石化官方小程序“中石化一键加油”</div> -->
    </div>
    <div class="banner-box">
      <div class="title">充值信息</div>
      <Field border type="number" v-model="form.chargingPhone" label="接收账号" maxlength="11" placeholder="请输入接收账号" oninput="value=value.replace(/[^\d]/g,'')"></Field>
      <Field border type="number" @input="checkCashnuber" v-model="actualAmount" @focus="amountInput" :readonly="!customList||!customList.length" label="充值金额" maxlength="4" placeholder="请输入或选择使用权益"></Field>
      <Field border type="number" :value="chargingAmount" error label="到账金额" style="color:red" readonly>
        <template #right-icon>
          <span>元</span>
        </template>
      </Field>
      <div class="list-box">
        <div v-for="(item,i) in productAttributeList" :key="i" class="item-box" :class="{'check':i==checkIndex}" @click="checkItem(item,i)">
          <div class="text text2" style="color:#333">{{item.name}}元</div>
          <div class="text" style="color:#666">售价{{Math.ceil(item.name * (radio==1 ? (product.integralDiscount||100) : (product.amountDiscount||100)) / 100)}}权益</div>
        </div>

      </div>
      <div class="msg-box3">
        <div class="title">支付方式</div>
        <!-- <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
          <Radio name="1" v-if="Number(integral)>=Number(actualAmount) && product.paymentMode.includes('0')">
            <div>权益支付</div>
            <div class="notes">(剩余权益{{integral}}）</div>
          </Radio>
          <Radio name="2" style="margin:10px 0" v-if="product.paymentMode.includes('1')">微信支付</Radio>
          <Radio name="3" v-if="integral>0 && Number(integral)<Number(actualAmount) && product.paymentMode.includes('2')">
            <div>组合支付</div>
            <div class="notes">(微信￥{{money}}+权益{{integral}})</div>
          </Radio>
        </RadioGroup> -->
        <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
          <CellGroup :border="false">
            <Cell clickable @click="item.integralPrice < integral?radio = '1':''" :border="false" v-if="item.integralPrice < integral && product.paymentMode && product.paymentMode.includes('0')" class="equity-payment-cell">
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
      <div style="margin: 16px 58px;">
        <Button class="btn" :disabled="!actualAmount || !form.chargingPhone || disableBtn" round block type="primary" @click="submit">确定充值</Button>
      </div>
      <div class="tip-title">温馨提示</div>
      <div v-html="product.notes" class="note-box"></div>
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
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge } from '@/api/user'
import { Button, Field, Dialog, Toast, RadioGroup, Radio, Cell, CellGroup, Popup } from 'vant'
import { Debounce, storageSet, storageGet, NumberSub } from '@/utils/utils'
export default {
  name: 'jdECard',
  components: { Button, Field, RadioGroup, Radio, Cell, CellGroup, Popup },
  data() {
    return {
      integral: 0,
      bindPhone: '',
      actualAmount: '',
      form: {
        actualAmount: '',
        chargingPhone: ''
      },
      city: '',
      checkIndex: null,
      radio: 0,
      disableBtn: false,
      mid: '',
      pathProductId: '',
      product: {},
      productAttributeList: [],
      customList: [],
      productId: '',
      item: {},
      isLogin: false
    }
  },
  created() {
    this.mid = this.$route.query.id
    this.pathProductId = this.$route.query.productId
    this.getIntegralNum()
    getJsJDK()
  },
  computed: {
    chargingAmount() {//到账金额
      let money = Math.floor(this.actualAmount / (this.radio == 1 ? (this.product.integralDiscount || 100) : (this.product.amountDiscount || 100)) * 100)
      if (Number(money) > 5000 || Number(money) < 1) {
        if (Number(money) > 5000) {
          Toast('到账金额仅支持1-5000元')
        }
        this.actualAmount = ''
        return 0
      }
      return money
    },
    money() {//组合支付金额
      return NumberSub(this.actualAmount, this.integral)
    },
  },
  watch: {
    actualAmount(val) {
      if (Number(this.integral) >= Number(val) && this.product.paymentMode.includes('0') && this.radio != '2') {
        this.radio = '1'
      } else if (this.product.paymentMode.includes('1')) {
        this.radio = '2'
      } else if (this.integral > 0 && Number(this.integral) < Number(val) && this.product.paymentMode.includes('2')) {
        this.radio = '3'
      }
    },
    radio(val) {
      if (!this.checkIndex && this.checkIndex != 0) return
      let item = this.productAttributeList[this.checkIndex]
    }
  },
  methods: {
    getIntegralNum() {
      let userInfo = storageGet('userInfo')
      this.userInfo = userInfo || {}
      this.form.chargingPhone = userInfo.bindPhone
      getProductConfigInfo({ id: this.pathProductId }).then(res => {
        this.product = res.data || {}
        this.product.paymentMode = this.product.paymentMode ? this.product.paymentMode.split(',') : []
        let list = this.product.productAttributeConfigVOList || []
        this.productAttributeList = list.filter(item => !item.isCustom)
        this.customList = list.filter(item => item.isCustom)

        // this.productAttributeList = this.product.productAttributeConfigVOList || []
        countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
          if (res.code == 200) {
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
            //权益够，默认勾选权益支付
            if (Number(this.integral) >= Number(this.item.integralPrice)) {
              this.radio = '1'
            } else {
              this.radio = ''
            }
          }
        })
      })
    },
    checkCashnuber() {
      let exp = /^(\-)*(\d+)\.(\d\d).*$/;
      this.actualAmount = this.actualAmount.replace(exp, '$1$2.$3');
    },
    amountInput() {
      if (!this.customList || !this.customList.length) return
      this.checkIndex = null
      this.productId = this.customList[0].id
    },
    checkItem(item, i) {
      console.log(item, i);
      this.item = item
      this.checkIndex = i
      this.actualAmount = Math.ceil(item.name * (this.radio == 1 ? (this.product.integralDiscount || 100) : (this.product.amountDiscount || 100)) / 100)
      this.productId = item.id
    },
    gotoList() {
      this.$router.push('/oilFilling/list')
    },
    noLogin() {
      this.isLogin = false
    },
    login() {
      this.isLogin = false
      this.$router.push({ path: '/login/index' })
    },
    submit() {
      if (!this.form.chargingPhone) {
        Toast('请输入接收账号')
        return
      }
      if (this.actualAmount < 1) {
        Toast('单次至少充值1元')
        return
      }
      if (!this.userInfo.bindPhone) {
        this.isLogin = true
        return
      }
      let data = {
        actualPrice: this.actualAmount,//实付价格
        payAmount: this.radio == 1 ? 0 : this.radio == 2 ? this.actualAmount : this.radio == 3 ? this.money : 0,//支付金额
        payIntegral: this.radio == 1 ? this.actualAmount : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,//支付权益
        price: this.chargingAmount,//售价
        productAttribute: this.productId,//产品id
        rechargeAccount: this.form.chargingPhone,//充值账户
        rechargeMode: Number(this.radio) - 1,//充值方式(0.权益充值,1.微信充值,2.组合充值)
        userPhone: this.userInfo.bindPhone,//用户手机号
        mid: this.mid//菜单id
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
                package: pay.packageValue,
                signType: pay.signType,
                paySign: pay.paySign,
                success: r => {
                  // 支付成功后的回调函数  
                  if (r.errMsg == "chooseWXPay:ok") {
                    //支付成功  
                    Toast('支付成功', 1200);
                    this.$router.replace('/oilFilling/list')
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
              this.$router.replace('/oilFilling/list')
            }
          }
          addProductRecharge(data).then(success)
        } else {
          done();
        }
      }
      let dom = `<div style="text-align:left;margin-left:51px;font-size:14px;line-height:30px"><div>充值账号：<span style='color:red'>${data.rechargeAccount}</span></div><div style='margin:10px 0'>充值到帐金额：<span style='color:red'>￥${data.price}</span></div></div>`
      Dialog.confirm({
        title: '充值确认',
        message: dom,
        confirmButtonColor: '#F14F44',
        beforeClose,
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 10px 0;
  background: #fdfeff;
}
.msg-text {
  color: #bbb;
  font-size: 14px;
  line-height: 30px;
}
.common {
  padding: 5px;
  width: 353px;
  margin: 0px auto;
  background: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.09);
  border-radius: 6px;
}
.top-msg {
  @extend .common;
  background: #ffffff;
  // margin-top: 15px;
  padding: 0 20px;
  .top-msg-box {
    display: flex;
    // justify-content: center;
    align-items: center;
    font-size: 16px;
    padding: 10px 0;
    // border-bottom: 1px solid #ccc;
    img {
      width: 53px;
      height: 53px;
      margin-right: 10px;
      border-radius: 50%;
    }
    .cont-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
    .record {
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 10px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      padding: 5px 10px;
    }
  }
  .title {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    margin: 4px 0;
  }
  .msg {
    font-size: 11px;
    color: #fb2e2e;
  }
  .note {
    font-weight: bold;
    font-size: 10px;
    line-height: 20px;
    color: #999999;
  }
}
.banner-box {
  margin-top: 9px;
  @extend .common;
  .title {
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    color: #333333;
    margin: 16px 0 30px;
  }
  .tip-title {
    margin-top: 35px;
    margin-left: 21px;
    font-weight: bold;
    font-size: 13px;
    color: #333333;
  }
  .tips {
    margin-left: 21px;
    font-size: 12px;
    line-height: 20px;
    color: #666666;
  }
}
.list-box {
  margin-left: 4px;
  .item-box {
    display: inline-block;
    margin-top: 10px;
    margin-left: 8px;
    text-align: center;
    font-size: 14px;
    width: 100px;
    height: 62px;
    // background: #f1ffdd;
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 6px;
    // color: #1eb049;
    padding-top: 9px;
  }
  .text2 {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .check {
    // background: #03a84f;
    border: 1px solid #f14f44;
    .text {
      color: #f14f44 !important;
    }
  }
  .disable-box {
    color: #ddd;
    background: #f7f7f7;
    border: none;
  }
}
.note-box {
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
.msg-box {
  background: #fff;
  box-sizing: border-box;
  // height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin: 10px 15px;
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
  .notes {
    font-size: 12px;
    color: #999;
  }
}
.msg-box3 {
  margin: 0 10px;
  padding: 20px 0;
  background: #fff;
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

.btn {
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border: none;
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