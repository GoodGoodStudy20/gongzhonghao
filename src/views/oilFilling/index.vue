<template>
  <div class="box">
    <div class="contennier">
      <div class="fens">
        <div class="top-text1">
          <img class="img" src="@/assets/img/integral.png" alt="">
          您有{{integral}}{{mid == 'oil'?'油卡余额':'权益'}}</div>
        <div class="top-text2">可以兑换<span>{{(city=='hn'||mid == 'oil')?Math.floor(integral):Math.floor(integral*1.05)}}</span>元油</div>
      </div>
      <div class="record" @click="gotoList2" v-if="mid == 'oil'">油卡记录</div>
      <div class="record" @click="gotoList" v-else>充值记录</div>
    </div>
    <div class="top-msg">
      <div class="top-msg-box">
        <img class="img" src="@/assets/img/w18.png" alt="">
        <div>
          <div class="title">中石化官方电子账户充值</div>
          <div class="msg" v-if="city=='gd'||mid == 'oil'">100权益兑换{{(city=='hn'||mid == 'oil')?100:105}}元油券</div>
          <div class="msg" v-if="city=='hn'">河南省中石化直营店通用</div>
        </div>
      </div>
      <div class="note">*{{city=='hn'?'充值到中石化官方小程序“中石化一键加油”':'充值到广东中石化官方小程序“大家来加油”'}}</div>
    </div>
    <div class="banner-box">
      <!-- <div class="title">权益加油</div> -->
      <Field border type="number" v-model="form.chargingPhone" label="充值账号" maxlength="11" placeholder="请输入充值账号" oninput="value=value.replace(/[^\d]/g,'')"></Field>
      <Field border type="number" @input="checkCashnuber" v-model="form.actualAmount" :readonly="city=='hn'" @focus="amountInput" :label="mid == 'oil'?'使用余额':'使用权益'" maxlength="6" placeholder="请输入或选择"></Field>
      <Field border type="number" :value="mid == 'oil'?form.actualAmount:city=='hn'?chargingAmountHn : chargingAmount" error label="到账金额" style="color:red" readonly>
        <template #right-icon>
          <span>元</span>
        </template>
      </Field>
      <div class="list-box">
        <div v-for="(item,i) in list" :key="i" class="item-box" :class="{'disable-box' :item.value > integral,'check':i==checkIndex}" @click="item.value > integral ? '' : checkItem(item,i)">
          <div class="text" :style="{color:item.value > integral?'#D5D5D5':'#333'}">{{item.label}}元</div>
          <div class="text value" :style="{color:item.value > integral?'#D5D5D5':'#666'}">售价{{item.value}}{{mid == 'oil'?'油额':'权益'}}</div>
        </div>
      </div>
      <div class="btn-box">
        <Button class="btn" :disabled="!form.actualAmount || !form.chargingPhone || disableBtn" round block type="primary" @click="submit">确定充值</Button>
      </div>
      <div class="tip-title">权益兑换规则</div>
      <div v-for="(item,i) in tipList" :key="i" class="tips">{{i+1}}. <span v-html="item"></span></div>
      <div class="qrcode-img">
        <div class="hn-code" v-if="city=='hn'">
          <img src="@/assets/img/shiHualogo.png" alt="">
          <wx-open-launch-weapp id="launch-btn" :username="ghId[city]" path="" style="height:65.52px;width:65.52px;opcity:0">
            <template>
              <div style="height:65.52px;width:65.52px;opcity:0"></div>
              <!-- <img src="https://gz.bcebos.com/v1/zhijianche/53dc94e1-2b9c-43ca-b366-9adbe5efd251.png" style="height:32px;width:32px;"></img> -->
            </template>

          </wx-open-launch-weapp>
        </div>
        <div class="gd-code" v-if="city=='gd'">
          <img src="@/assets/img/gotoOil.png" alt="">
          <wx-open-launch-weapp id="launch-btn" :username="ghId[city]" path="" style="height:65.52px;width:65.52px;opcity:0">
            <template>
              <div style="height:65.52px;width:65.52px;opcity:0"></div>
            </template>

            <!-- <button style="height:40px;width:40px;opcity:0;border:none"></button> -->
            <!-- <button style="height:40px;border: 1px solid #4bc557;background:#4bc557">
              <img src="https://gz.bcebos.com/v1/zhijianche/691983a5-1f6c-4f41-8bd8-a5449d4f5293.png" style="height:32px;width:32px;"></img>
            </button> -->
          </wx-open-launch-weapp>
        </div>
        <div>{{topTip}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getOilCardBalance, RechargeOilCard } from '@/api/user'
import { Button, Field, Dialog, Toast } from 'vant'
import { Debounce, storageSet, storageGet } from '@/utils/utils'
export default {
  name: 'oilFilling',
  components: { Button, Field },
  data() {
    return {
      bg: [
        require('@/assets/img/wlyn/qrcodedjljy.png'),
        require('@/assets/img/wlyn/hn.png'),
      ],
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
      disableBtn: false,
      mid: '',
      product: {},
      productAttributeList: [],
      productId: ''
    }
  },
   created() {
    /**
     * this.mid == 'oil' 油卡余额充值油券
     */
    let code = storageGet('CityCode') ? (storageGet('CityCode').substring(0, 2) + '0000') : ''
    this.mid = this.$route.query.id
    this.productId = this.$route.query.productId
    this.city = code == '410000' ? 'hn' : code == '440000' ? 'gd' : ''
    this.getIntegralNum()
     getJsJDK()
  },
  mounted() {
    const btn = document.getElementById('launch-btn');
    btn.addEventListener('launch', function (e) {
      console.log('success');
    });
    btn.addEventListener('error', function (e) {
      console.log('fail', e.detail);
    });
  },
  computed: {
    chargingAmount() {
      return Math.floor(this.form.actualAmount * 1.05)
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
    list() {
      let list = [
        { label: 100, value: 100 },
        { label: 200, value: 200 },
        { label: 300, value: 300 },
        { label: 500, value: 500 },
        { label: 800, value: 800 },
        { label: 1000, value: 1000 },
      ]
      return this.mid == 'oil' ? list : this.productAttributeList
    },
    topTip() {
      return this.city == 'hn' ? "长按至河南中石化小程序 “中石化一键加油”" : "长按至广东中石化小程序 “大家来加油”"
    }
  },
  methods: {
    getIntegralNum() {
      let userInfo = storageGet('userInfo')
      this.bindPhone = userInfo.bindPhone
      this.form.chargingPhone = userInfo.bindPhone
      if (this.mid == 'oil') {
        getOilCardBalance({ phone: this.bindPhone }).then(res => {
          // 油卡余额
          this.integral = res.data || 0
        })
      } else {
        countVouchersInterests(this.bindPhone).then(res => {
          if (res.code == 200) {
            // 权益和优惠券的存储
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
          }
        })
        getProductConfigInfo({ id: this.productId }).then(res => {
          this.product = res.data || {}
          let list = this.product.productAttributeConfigVOList || []
          this.productAttributeList = list.map(item => {
            return {
              label: item.name,
              value: item.integralPrice,
              id: item.id
            }
          })
        })
      }
    },
    checkCashnuber() {
      let exp = /^(\-)*(\d+)\.(\d\d).*$/;
      this.form.actualAmount = this.form.actualAmount.replace(exp, '$1$2.$3');
    },
    amountInput() {
      this.checkIndex = null
      this.productId = ''
    },
    checkItem(item, i) {
      this.checkIndex = i
      this.form.actualAmount = item.value
      this.productId = item.id
      if (this.city == 'hn') {
        this.chargingAmountHn = item.label
      }
      this.submit()
    },
    gotoList() {
      this.$router.push('/oilFilling/list')
    },
    gotoList2() {
      this.$router.push('/oilFilling/oilCard')
    },
    submit() {
      if (!this.form.chargingPhone) {
        Toast('请输入充值账号')
        return
      }
      if (!this.city) {
        Toast('当前只支持广东、河南地区充值')
        return
      }
      if (this.form.actualAmount < 1) {
        Toast('单次至少充值1元')
        return
      }
      if ((Number(this.form.actualAmount) > 953 && this.mid != 'oil') || (Number(this.form.actualAmount) > 1000 && this.mid == 'oil')) {
        Toast('单次至多充值1000元')
        return
      }
      if (Number(this.form.actualAmount) > Number(this.integral)) {
        Toast('权益不足')
        return
      }
      let data = {}
      if (this.mid == 'oil') {//油卡余额充值
        data = {
          rechargeAmount: this.form.actualAmount,//实付价格
          actualPrice: this.form.actualAmount,//售价
          price: this.form.actualAmount,//售价
          phone: this.bindPhone,//用户手机号
          rechargeAccount: this.form.chargingPhone,//充值账户
        }
      } else {//权益充值
        if (this.city == 'hn') {
          data = {
            actualPrice: this.form.actualAmount,//实付价格
            payIntegral: this.form.actualAmount,//支付权益
            price: this.chargingAmountHn,//售价
            productId: this.productId,//产品id
            rechargeAccount: this.form.chargingPhone,//充值账户
            rechargeMode: 0,//充值方式(0.权益充值,1.微信充值,2.组合充值)
            userPhone: this.bindPhone,//用户手机号
            mid: this.mid//菜单id
          }
        } else if (this.city == 'gd') {
          data = {
            actualPrice: this.form.actualAmount,//实付价格
            payIntegral: this.form.actualAmount,//支付权益
            price: this.chargingAmount,//售价
            rechargeAccount: this.form.chargingPhone,//充值账户
            rechargeMode: 0,//充值方式(0.权益充值,1.微信充值,2.组合充值)
            productAttribute: this.productId,//产品id
            userPhone: this.bindPhone,//用户手机号
            mid: this.mid//菜单id
          }
        }
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
            this.$router.push(`/oilFilling/success?amount=${data.price}&msg=${this.mid == 'oil' ? '' : res.data}`)
            Toast('充值成功')
            this.getIntegralNum()
          }
          if (this.mid == 'oil') {//油卡余额充值油
            RechargeOilCard(data).then(success)
          } else {//权益充值油
            addProductRecharge(data).then(success)
          }
        } else {
          done();
        }
      }
      let dom = `<div style="text-align:left;margin-left:51px;font-size:14px;line-height:30px"><div>充值账号：<span style='color:red'>${data.rechargeAccount}</span></div><div style='margin:10px 0'>充值到中石化金额：<span style='color:red'>￥${data.price}</span></div><div>扣除九华保${this.mid == 'oil' ? '油卡余额' : '权益'}：<span style='color:red'>${data.actualPrice}</span></div></div>`
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
  width: 351px;
  margin: 0px auto;
  background: #fff;
  filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
  border-radius: 6px;
}
.contennier {
  @extend .common;
  background-image: url("../../assets/img/bgimg.png");
  background-size: 100% 100%;
  margin-top: 9px;
  height: 86px;
  display: flex;
  padding: 0 11px;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .fens {
    font-size: 16px;
    font-weight: bold;
    .img {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      // margin-left: -11px;
      margin-right: 2px;
    }
    .top-text1 {
      height: 30px;
      border-radius: 2px 0px 0px 2px;
    }
    .top-text2 {
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      border-radius: 2px 0px 0px 2px;
      span {
        font-size: 18px;
        margin: 0 5px;
      }
    }
  }
  .record {
    // padding: 10px;
    width: 90px;
    text-align: center;
    height: 34px;
    line-height: 35px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    box-shadow: 0px 3px 10px rgba(188, 0, 0, 0.2);
    border-radius: 57px;
    font-weight: bold;
    font-size: 14px;
  }
}
.top-msg {
  @extend .common;
  background: #ffffff;
  margin-top: 12px;
  height: 130px;
  .top-msg-box {
    display: flex;
    padding-bottom: 8px;
    // justify-content: center;
    align-items: center;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
    .img {
      width: 80px;
      height: 80px;
      margin-right: 16px;
    }
  }
  .title {
    font-weight: bold;
    font-size: 15px;
    line-height: 19px;
    color: #000000;
  }
  .msg {
    margin-top: 15px;
    font-size: 13px;
    line-height: 10px;
    color: #f14f44;
    opacity: 0.8;
  }
  .note {
    margin-top: 9px;
    text-align: center;
    font-weight: normal;
    font-size: 12px;
    line-height: 17px;
    color: #000000;
    opacity: 0.7;
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
    margin: 35px 0 12px 21px;
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
  .btn-box {
    margin: 16px 0;
    display: flex;
    justify-content: center;
    .btn {
      text-align: center;
      padding: 10px;
      width: 134px;
      height: 38px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      opacity: 0.6;
      box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
      border-radius: 57px;
      color: #fff;
      font-weight: bold;
      font-size: 15px;
      border: none;
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
  .check {
    // background: #03a84f;
    // background: linear-gradient(145.43deg, #ffaf9b 10.56%, #ff6055 91.33%);
    border: 1px solid #f14f44;
    .text {
      color: #f14f44 !important;
    }
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
</style>