<template>
  <div class="box">
    <div class="banner-box">
      <div class="tips">
        <img src="../../assets/img/tips.png" alt="">
        <span>因电子账户结算，故月初第一天与月末最后一天无法充值</span>
      </div>
      <Field border type="number" v-model="form.chargingPhone" label="充值账号：" maxlength="11" placeholder="请输入充值账号" oninput="value=value.replace(/[^\d]/g,'')"></Field>
      <!-- <Field border type="number" @input="checkCashnuber" v-model="form.actualAmount" :readonly="city=='hn'" @focus="amountInput" :label="mid == 'oil'?'使用余额':'使用权益'" maxlength="6" placeholder="请输入或选择"></Field> -->
      <!-- 隐藏使用权益 -->
      <!-- <Field  border type="number" v-model="form.checkCashnuber" @change="changeIntegral" label="使用权益：" :readonly="city!='gd'" maxlength="11" placeholder="请输入或选择面额" oninput="value=value.replace(/[^\d]/g,'')"></Field> -->
      <!-- 直接使用 双向绑定form.checkCashnuber-->
      <!-- <Field border type="number" v-model="form.chargingAmount" readonly error label="充值金额：" style="color:red"> -->
      <!-- <Field border type="number" placeholder="请输入或选择充值金额" :value="Math.floor(this.form.checkCashnuber * 1.06)?Math.floor(this.form.checkCashnuber * 1.06):''" readonly error label="充值金额："> -->
      <Field type="number" placeholder="请输入或选择充值金额" @change="changeIntegral" v-model="form.chargingAmount" label="充值金额：">
        <!-- <Field  type="number" placeholder="请输入或选择充值金额" @change="changeIntegral" :value="Math.floor(this.form.checkCashnuber * 1.06)?Math.floor(this.form.checkCashnuber * 1.06)+'元':''"  label="充值金额："> -->
        <!-- <Field border type="number" :value="chargingAmount" readonly error label="充值金额" style="color:red"> -->
        <!-- <template #right-icon> -->
        <template #right-icon>
          <span>元</span>
        </template>
      </Field>
      <div class="list-box">
        <!-- <div v-for="(item,i) in product.productAttributeConfigVOList" :key="i" class="item-box" :class="{'disable-box':item.integralPrice > integral,'check':i==checkIndex}" @click="checkItem(item,i)"> -->
        <div v-for="(item,i) in product.productAttributeConfigVOList" :key="i" class="item-box" :class="{'check':i==checkIndex}" @click="(item.integralPrice < integral ||  noPay)?checkItem(item,i):'' ">
          <div class="text new-price" style="color:'#D5D5D5'">{{item.originalPrice> integral ?item.originalPrice:item.originalPrice}}元</div>
          <!-- <div class="text new-price" style="color:'#D5D5D5'">{{item.originalPrice}}元</div> -->
          <!-- <div class="text under-line value old-price" style="color:'#D5D5D5'">售价￥{{item.originalPrice}}元</div> -->
          <div class="text value old-price" style="color:'#D5D5D5'">售价￥{{item.integralPrice> integral ?item.amountPrice:item.integralPrice}}元</div>
          <!-- <div class="text value old-price" style="color:'#D5D5D5'">售价￥{{item.integralPrice> integral ?item.amountPrice*0.94:item.integralPrice*0.94}}元</div> -->
          <!-- <div class="text value old-price" style="color:'#D5D5D5'">售价￥{{item.integralPrice> integral ?item.amountPrice:item.integralPrice}}元</div> -->
        </div>
        <!-- :style="{color:item.originalPrice > integral?'#D5D5D5':'#666'}" -->
        <!-- <div v-for="(item,i) in list" :key="i" class="item-box" :class="{'disable-box' :item.value > integral,'check':i==checkIndex}" @click="item.value > integral ? '' : checkItem(item,i)">
          <div class="text" :style="{color:item.value > integral?'#D5D5D5':'#333'}">{{item.label}}元</div>
          <div class="text value" :style="{color:item.value > integral?'#D5D5D5':'#666'}">原价￥{{item.value}}元</div>
        </div> -->
      </div>
      <div class="btn-box">
        <!-- <Button class="btn" :style="{opacity:form.chargingAmount && form.checkCashnuber && form.chargingPhone?'1':'0.6'}" :disabled="!form.chargingAmount || !form.checkCashnuber || !form.chargingPhone || disableBtn" round block type="primary" @click="submit1"><i v-if='form.checkCashnuber' class="btn-money">￥{{item.integralPrice> integral ?form.checkCashnuber.toFixed(2):item.integralPrice.toFixed(2)}} </i> 确定充值</Button> -->
        <Button class="btn" :style="{opacity:form.chargingAmount && form.checkCashnuber && form.chargingPhone?'1':'0.6'}" :disabled="!form.chargingAmount || !form.checkCashnuber || !form.chargingPhone || disableBtn" round block type="primary" @click="submit1"><i v-if='form.checkCashnuber' class="btn-money">￥{{form.checkCashnuber.toFixed(2)}} </i> 确定充值</Button>
      </div>
    </div>
    <van-dialog v-model="show" class="box3" :showConfirmButton="false">
      <Icon class="close" size="20" name="cross" @click="closeDialog"></Icon>
      <!-- <div class="close" >x</div> -->
      <div class="title">中石化充值</div>
      <!-- <div class="price">￥<span>{{chargingAmount}}</span></div> -->
      <div class="price">￥<span>{{city == 'hn' ? chargingAmountHn:form.checkCashnuber}}</span></div>
      <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <CellGroup :border="false">
          <Cell clickable @click="radio = '1'" :border="false" v-if="(Number(form.checkCashnuber) < Number(integral)) && product.paymentMode && product.paymentMode.includes('0')" class="equity-payment-cell">
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
          <Cell clickable @click="radio = '3'" :border="false" v-if="(Number(form.checkCashnuber) > Number(integral) ) && product.paymentMode && product.paymentMode.includes('2')" class="combined-payment-cell">
            <div class="combined-payment">组合支付</div>
            <div class="notes">(微信￥{{money}}+权益{{integral}}）</div>
            <template #right-icon>
              <Radio name="3">
              </Radio>
            </template>
          </Cell>
        </CellGroup>
      </RadioGroup>
      <div class="btn-box">
        <div class="btn" @click="submit" :disabled='disableBtn'>确认支付</div>
      </div>
    </van-dialog>
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
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getOilCardBalance, RechargeOilCard } from '@/api/user'
import { Button, Field, Dialog, Toast, RadioGroup, CellGroup, Cell, Radio, Icon, Popup } from 'vant'
import { Debounce, storageSet, storageGet, NumberSub, NumberMul } from '@/utils/utils'
export default {
  name: 'Recharge',
  components: { Button, Field, CellGroup, RadioGroup, Radio, Icon, Cell, Dialog, [Dialog.Component.name]: Dialog.Component, Popup },
  data() {
    return {
      bg: [
        require('@/assets/img/wlyn/qrcodedjljy.png'),
        require('@/assets/img/wlyn/hn.png'),
      ],
      integral: 0,
      bindPhone: '',
      form: {
        actualAmount: 0,
        chargingPhone: '',
        chargingAmount: '',
        checkCashnuber: ''
      },
      chargingAmountHn: '',
      city: '',
      checkIndex: null,
      ghId: {
        gd: 'gh_85d236dfcbaa',
        hn: 'gh_641fc8ab19f9'
      },
      disableBtn: false,
      // product: {},
      productAttributeList: [],
      productId: '',
      show: false,
      radio: 0,
      productAttribute: '',
      item: {},
      isLogin: false,
      userInfo: {}
    }
  },
  props: ['mid', 'product', 'list'],
  created() {
    /**
     * this.mid == 'oil' 油卡余额充值油券
     */
    let code = storageGet('CityCode') ? (storageGet('CityCode').substring(0, 2) + '0000') : ''
    // this.mid = this.$route.query.id
    console.log(this.mid);
    console.log(storageGet('CityCode'));

    console.log(code);

    this.productId = this.$route.query.productId
    this.city = code == '440000' ? 'gd' : 'hn'
    this.$nextTick(() => {
      this.getIntegralNum()
      getJsJDK()
    })

  },
  // watch:{
  //   form:{
  //     handler(value){
  //       console.log('value',value);
  //       // this.form.checkCashnuber= value.checkCashnuber
  //     },
  //     deep:true
  //   }
  // },
  mounted() {
    // console.log(this.noPay);
  },
  computed: {
    OPrice() {
      // return this.form.checkCashnuber = NumberMul(this.form.chargingAmount,0.94)
    },
    disable() {
      return !this.form.chargingPhone || !this.form.actualAmount
    },
    noPay() {
      return (this.product.paymentMode && this.product.paymentMode.includes('2')) || (this.product.paymentMode && this.product.paymentMode.includes('1'))
    },
    money() {
      return NumberSub(this.form.checkCashnuber, this.integral)
    },
    tipList() {
      let list = [
        `单次最大充值1000，消耗${this.mid == 'oil' ? '1000油卡余额' : '953权益'}，不支持小数`,
        '请核对好账号和金额，充值之后不能撤销',
        '充值成功之后3分钟之内到账',
        '在中石化官方小程序“大家来加油”中使用',
        '月初第一天和月底最后一天不能使用',
        "客服电话：<a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"],
        list2 = [
          '请核对好账号和金额，充值之后不能撤销',
          '充值成功之后3分钟之内到账',
          '在中石化官方小程序“中石化一键加油”中使用',
          '月初第一天和月底最后一天不能使用',
          "客服电话：<a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"]
      return this.city == 'hn' ? list2 : list
    },
    // list() {
    //   let list = [
    //     { label: 100, value: 100 },
    //     { label: 200, value: 200 },
    //     { label: 300, value: 300 },
    //     { label: 500, value: 500 },
    //     { label: 800, value: 800 },
    //     { label: 1000, value: 1000 },
    //   ]
    //   // return this.mid == 'oil' ? list : this.productAttributeList
    //   return list
    // },
    topTip() {
      return this.city == 'hn' ? "长按至河南中石化小程序 “中石化一键加油”" : "长按至广东中石化小程序 “大家来加油”"
    }
  },
  methods: {
    NumberAdd(list) {//加法
      let length = list.length; //获得传入参数数组长度
      if (!length) return 0;
      if (length == 1) return list[0];
      let arg1 = 0; //初始值
      for (let i = 0; i < length; i++) {
        let arg2 = list[i] || 0; //加数
        let r1, r2, m;
        try {
          r1 = String(arg1).split(".")[1].length;
        } catch (e) {
          r1 = 0;
        }
        try {
          r2 = String(arg2).split(".")[1].length;
        } catch (e) {
          r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        arg1 = (arg1 * m + arg2 * m) / m;
      }
      return arg1;
    },
    NumberDiv(arg1 = 0, arg2 = 0) {
      let t1 = 0,
        t2 = 0,
        r1,
        r2;
      arg1 = arg1 ? arg1 : 0;
      arg2 = arg2 ? arg2 : 0;
      try {
        t1 = arg1.toString().split(".")[1].length;
      } catch (e) { }
      try {
        t2 = arg2.toString().split(".")[1].length;
      } catch (e) { }

      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
      return (r1 / r2) * Math.pow(10, t2 - t1);
    },
    changeIntegral(value) {

      // console.log(this.item.integralPrice);
      // this.item.integralPrice = 0
      // this.form.chargingAmount = Math.floor(this.form.checkCashnuber * 1.06)
      // this.form.chargingAmount = Math.floor(this.form.checkCashnuber * 1.06)
      // this.form.checkCashnuber = 
      let res = NumberMul(this.form.chargingAmount, 0.94)
      // console.log('res',res);
      this.form.checkCashnuber = NumberMul(this.form.chargingAmount, 0.94)
      // console.log('value',value);
      this.checkIndex = null
      // console.log(this.checkIndex);

      // this.checkItem(this.form.checkCashnuber,-1)
    },
    closeDialog() {
      this.show = false
    },
    noLogin() {
      this.isLogin = false
    },
    login() {
      this.isLogin = false
      this.$router.push({ path: '/login/index' })
    },
    submit1() {


      if (!this.form.chargingPhone) {
        Toast('请输入充值账号')
        return
      }
      console.log(this.form.chargingAmount);
      if (!this.form.chargingAmount || this.form.chargingAmount == 0) {
        Toast('请输入充值金额')
        return
      }
      if (this.form.chargingAmount < 1) {
        Toast('单次至少充值1元')
        return
      }
      if (!this.userInfo.bindPhone) {
        this.isLogin = true
        return
      }
      this.show = true
    },
    getIntegralNum() {
      this.userInfo = storageGet('userInfo')
      this.bindPhone = this.userInfo.bindPhone
      this.form.chargingPhone = this.userInfo.bindPhone
      if (this.mid == 'oil') {
        getOilCardBalance({ phone: this.bindPhone }).then(res => {
          // 油卡余额
          this.integral = res.data || 0
          // console.log(this.integral);

        })
      } else {
        countVouchersInterests(this.bindPhone).then(res => {
          if (res.code == 200) {
            // 权益和优惠券的存储
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
            // console.log(this.integral);

          }
        })
        // getProductConfigInfo({ id: this.productId }).then(res => {
        //   this.product = res.data || {}
        //   let list = this.product.productAttributeConfigVOList || []
        //   // this.productAttributeList = list.map(item => {
        //   //   return {
        //   //     label: item.name,
        //   //     value: item.integralPrice,
        //   //     id: item.id
        //   //   }
        //   // })
        //   console.log(this.product);

        // })
      }
    },
    checkCashnuber() {
      let exp = /^(\-)*(\d+)\.(\d\d).*$/;
      this.form.actualAmount = this.form.actualAmount.replace(exp, '$1$2.$3');
    },

    checkItem(item, i) {
      this.checkIndex = i
      this.item = item
      console.log(item);
      this.chargingAmountHn = item.integralPrice > this.integral ? item.amountPrice : item.integralPrice
      // this.form.chargingAmount = item.integralPrice > this.integral ? item.amountPrice : item.integralPrice
      this.form.chargingAmount = item.originalPrice
      console.log(this.form.chargingAmount);

      this.form.checkCashnuber = item.integralPrice > this.integral ? item.amountPrice : item.integralPrice
      this.productAttribute = item.id
      console.log(this.integral, item.integralPrice);

      if (Number(this.integral) >= Number(item.integralPrice)) {
        this.radio = '1'
        console.log(this.radio);

      } else {
        this.radio = ''
      }
      if (this.city == 'hn') {
        this.submit1()
      }
    },
    submit() {
      console.log(this.radio, this.NumberDiv(this.form.chargingAmount, 1.06).toFixed(2));
      if (!this.form.chargingPhone) {
        Toast('请输入充值账号')
        return
      }
      if (Number(this.form.actualAmount) > Number(this.integral)) {
        Toast('权益不足')
        return
      }
      console.log(this.radio);
      if (this.radio == 0) {
        Toast('请选择支付方式')
        return
      }
      let data = {
        // actualPrice: this.NumberDiv(this.form.chargingAmount, 1.06).toFixed(2),//实付价格
        // actualPrice: this.radio == 1 ? this.form.checkCashnuber : this.radio == 2 ? this.NumberDiv(this.form.chargingAmount, 1.06).toFixed(2) : this.radio == 3 ? this.NumberAdd([this.money, this.integral]) : 0,//实付价格
        actualPrice: this.radio == 1 ? this.form.checkCashnuber : this.radio == 2 ? this.form.checkCashnuber : this.radio == 3 ? this.NumberAdd([this.money, this.integral]) : 0,//实付价格
        payAmount: this.radio == 1 ? 0 : this.radio == 2 ? this.form.checkCashnuber : this.radio == 3 ? this.money : 0,//支付金额
        payIntegral: this.radio == 1 ? this.form.checkCashnuber : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,//支付权益
        price: this.form.chargingAmount,//售价
        productAttribute: this.productAttribute,//产品id
        rechargeAccount: this.form.chargingPhone,//充值账户
        rechargeMode: Number(this.radio) - 1,//充值方式(0.权益充值,1.微信充值,2.组合充值)
        userPhone: this.bindPhone,//用户手机号
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
                    this.$router.replace(`/oilFilling/success?amount=${this.form.chargingAmount}`)
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
              this.$router.replace(`/oilFilling/success?amount=${this.form.chargingAmount}`)
            }
          }
          addProductRecharge(data).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '兑换确认',
        confirmButtonColor: '#F14F44',
        beforeClose
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 0 0 10px;
  background: #fdfeff;
}
.common {
  padding: 5px;
  width: 351px;
  margin: 0px auto;
  background: #fff;
  filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
  border-radius: 6px;
}
.banner-box {
  // margin-top: 9px;
  @extend .common;
  .title {
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    color: #333333;
    margin: 16px 0 30px;
  }
  .tip-title {
    margin: 35px 0 12px 21px;
    font-weight: bold;
    font-size: 13px;
    color: #333333;
  }
  .tips {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #ef8e46;
    padding-top: 5px;
    margin-left: 10px;
    display: flex;
    // margin-top: 10px;
    img {
      width: 13px;
      height: 13px;
      margin-right: 5px;
    }
  }
  .btn-box {
    margin: 16px 0;
    display: flex;
    justify-content: center;
    .btn {
      text-align: center;
      padding: 10px;
      width: 280px;
      height: 44px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      opacity: 0.6;
      box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
      border-radius: 57px;
      color: #fff;
      font-weight: bold;
      font-size: 15px;
      border: none;
      &-money {
        font-style: normal;
        margin-right: 4px;
      }
    }
  }
}
.list-box {
  margin-left: 4px;
  .item-box {
    display: inline-block;
    margin-top: 10px;
    margin-left: 8px;
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    width: 100px;
    height: 62px;
    // background: #f1ffdd;
    border: 1px solid #dddddd;
    box-sizing: border-box;
    border-radius: 6px;
    color: #00000090;
    padding-top: 9px;
    line-height: 19px;
    .value {
      font-weight: 300;
      font-size: 12px;
      margin-top: 5px;
    }
  }
  .under-line {
    text-decoration-line: line-through;
  }
  ::v-deep .check {
    // background: #03a84f;
    background-color: #ffeded;
    border: none;
    // .text {
    //   color: #f14f44 !important;
    // }
  }
  .new-price {
    color: #000;
    opacity: 0.8;
    font-weight: 700;
  }
  .old-price {
    color: #000;
    opacity: 0.6;
    font-weight: 500;
  }
  .disable-box {
    color: #ddd;
    // background: #f7f7f7;
    // border: none;
  }
}
.qrcode-img {
  // @extend .common;
  // background: none;
  padding: 5px;
  width: 353px;
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 13px;
  color: #f14f44;
  .hn-code {
    background: url("https://gz.bcebos.com/v1/zhijianche/53dc94e1-2b9c-43ca-b366-9adbe5efd251.png");
  }
  .gd-code {
    background: url("https://gz.bcebos.com/v1/zhijianche/691983a5-1f6c-4f41-8bd8-a5449d4f5293.png");
  }
  .hn-code,
  .gd-code {
    height: 63px;
    width: 63px;
    background-size: 100% 100%;
    margin-right: 10px;
    border-radius: 5px;
  }
  img {
    width: 63px;
    height: 63px;
  }
}
.box3 {
  text-align: center;
  .close {
    display: flex;

    margin: 20px 0 20px 20px;
    color: #999999;
  }
  .title {
    font-weight: 700;
    font-size: 15px;
    color: #333333;
  }
  .price {
    font-weight: 700;
    font-size: 20px;
    color: #000000;
    margin: 10px 0;
    span {
      font-size: 34px;
    }
  }
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
      margin: 10px auto 20px;
      text-align: center;
      line-height: 40px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 50px;
    }
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
::v-deep .van-field__control {
  color: #000 !important;
}
</style>