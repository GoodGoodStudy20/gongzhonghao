<template>
  <div class="box">
    <Tabs v-model="tabActive" swipeable title-active-color="#F14F44" color="#F14F44">
      <Tab v-for="(item,i) in tabList" :title="item" :key="i"></Tab>
    </Tabs>
    <div class="input-box">
      <Field :border="false" type="number" v-model="form.chargingPhone" @change="checkMobile" label="充值账号" maxlength="11" placeholder="请输入充值账号" oninput="value=value.replace(/[^\d]/g,'')"></Field>
    </div>
    <div class="banner-box">
      <!-- <div class="top">
        <div class="top-left">特惠充值</div>
        <div @click="gotoList" style="color:#0099ff;font-size:15px;margin:5px 20px">充值记录</div>
      </div> -->
      <div class="type-text">慢充94折<span>（1-72小时到账）</span></div>
      <div class="list-box">
        <div v-for="(item,i) in list" :key="i" class="item-box" :class="{'disable-box' :item.value > integral,'check':i==checkIndex}" @click="item.value > integral ? '' : checkItem(item,i,1)">
          <div class="text" :style="{color:item.value > integral?'#D5D5D5':'#333'}">{{item.label}}元</div>
          <div class="text msg-text" :style="{color:item.value > integral?'#D5D5D5':'#666'}">售价{{item.value}}权益</div>
        </div>
      </div>
      <div class="type-text">快充98折<span>（10分钟-3小时到账）</span></div>
      <div class="list-box">
        <div v-for="(item,i) in list2" :key="i" class="item-box" :class="{'disable-box' :item.value > integral,'check':i==checkIndex2}" @click="item.value > integral ? '' : checkItem(item,i,2)">
          <div class="text" :style="{color:item.value > integral?'#D5D5D5':'#333'}">{{item.label}}元</div>
          <div class="textmsg-text" :style="{color:item.value > integral?'#D5D5D5':'#666'}">售价{{item.value}}权益</div>
        </div>
      </div>
      <div class="rich-box">
        <p v-html="item" v-for="(item,i) in textList" :key="i"></p>
      </div>
    </div>
    <SubmitDialog :show.sync="show" :item="buyItem"></SubmitDialog>
  </div>
</template>

<script>
import { countVouchersInterests, addGdOilCouponRecharge, addGHnOilCouponRecharge } from '@/api/user'
import { Tabs, Tab, Button, Field, Dialog, Toast } from 'vant'
import SubmitDialog from './components/SubmitDialog'
import { Debounce, storageSet, storageGet } from '@/utils/utils'
export default {
  name: 'oilFilling',
  components: { Tabs, Tab, Button, Field, SubmitDialog },
  data() {
    return {
      tabList: ["移动", "联通", "电信"],
      tabActive: 0,
      integral: 0,
      bindPhone: '',
      form: {
        actualAmount: '',
        chargingPhone: ''
      },
      checkIndex: null,
      checkIndex2: null,
      list: [
        { label: 50, value: 47 },
        { label: 100, value: 94 },
        { label: 200, value: 188 },
        { label: 200, value: 188 },
        { label: 200, value: 188 },
      ],
      list2: [
        { label: 50, value: 49 },
        { label: 100, value: 98 },
        { label: 200, value: 196 },
      ],
      textList: [
        '1.折扣充值均不是及时到账，急用请勿充值',
        '2.充值不成功将原路退回',
        '3.请确认好号码，号码错误不能退款',
        '4.代充渠道不提供发票，如需发票请向运营商索取',
        "5.客服电话：<a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"
      ],
      show: false,
      buyItem: {}
    }
  },
  created() {
    this.getIntegralNum()
  },
  methods: {
    checkMobile() { //大运营商（联通、电信、移动）的手机号正则判断
      let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/; //移动
      let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|18[56])\d{8}$/; //联通
      let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199)\d{8}$/; //电信
      if (this.form.chargingPhone.length !== 11) {
        Toast('请输入正确的手机号')
        return false
      }
      if (isChinaMobile.test(this.form.chargingPhone)) {
        this.tabActive = 0
        console.log('移动')
      } else if (isChinaUnion.test(this.form.chargingPhone)) {
        this.tabActive = 1
        console.log('联通')
      } else if (isChinaTelcom.test(this.form.chargingPhone)) {
        this.tabActive = 2
        console.log('电信')
      } else {
        this.tabActive = 3
        Toast('请输入正确的手机号')
        return false
      }
      return true
    },
    getIntegralNum() {
      let userInfo = storageGet('userInfo')
      this.bindPhone = userInfo.bindPhone
      this.form.chargingPhone = userInfo.bindPhone
      this.checkMobile()
      countVouchersInterests(this.bindPhone).then(res => {
        if (res.code == 200) {
          // 权益和优惠券的存储
          this.integral = res.data.countIntegral ? res.data.countIntegral : 0
        }
      })
    },
    async checkItem(item, i, type) {
      if (type == 1) {
        this.checkIndex = i
        this.checkIndex2 = null
      } else {
        this.checkIndex = null
        this.checkIndex2 = i
      }
      let isOk = await this.checkMobile()
      this.show = isOk
      this.buyItem = { ...item, ...{ type, phone: this.form.chargingPhone, integral: this.integral } }
      // this.submit(item)
    },
    gotoList() {
      console.log(123)
      this.$router.push('/prepaidRefill/list')
    },
  }
}
</script>

<style lang="scss" scoped>
.box {
  min-height: 100vh;
  padding-bottom: 10px;
}
.common {
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.05);
  padding: 5px;
  width: 351px;
  margin: 0px auto;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
}
.input-box {
  margin: 8px auto;
  width: 351px;
  height: 48px;
  background: #ffffff;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
.contennier {
  @extend .common;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .fens {
    font-size: 16px;
    margin-left: 10px;
    .top-text {
      font-size: 17px;
      margin-top: 10px;
      span {
        font-size: 18px;
        color: red;
        margin: 0 5px;
      }
    }
  }
}
.top-msg {
  @extend .common;
  margin-top: 20px;
  padding: 0 20px;
  .top-msg-box {
    display: flex;
    // justify-content: center;
    align-items: center;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
    img {
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }
  }
}
.banner-box {
  @extend .common;
  margin-top: 8px;
  padding: 0 0 20px 0;
  .top {
    display: flex;
    justify-content: space-between;
    .top-left {
      width: 77px;
      height: 33px;
      line-height: 33px;
      border-radius: 0px 0px 14px 0px;
      background-color: rgba(172, 73, 73, 100);
      color: rgba(255, 255, 255, 100);
      font-size: 14px;
      text-align: center;
      border: 1px solid rgba(187, 187, 187, 100);
    }
  }
  .type-text {
    font-weight: bold;
    font-size: 15px;
    color: #000000;
    margin: 20px;
    span {
      font-weight: normal;
      font-size: 13px;
      color: #f14f44;
    }
  }
}
.list-box {
  padding-right: 10px;
  .item-box {
    display: inline-block;
    border: 1px solid #f1f1f1;
    border-radius: 6px;
    width: 108px;
    height: 60px;
    margin-bottom: 10px;
    margin-left: 5px;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    box-sizing: border-box !important;
  }
  .text {
    font-weight: bold;
    font-size: 15px;
  }
  .msg-text {
    color: #bbb;
    font-weight: normal;
    font-size: 12px;
    margin-top: 2px;
  }
  .check {
    border: 1px solid #f14f44 !important;
    .text {
      color: #f14f44 !important ;
    }
  }
  .disable-box {
    color: #ddd;
  }
}
.rich-box {
  margin-top: 40px;
  p {
    font-weight: normal;
    font-size: 12px;
    line-height: 19px;
    color: #000000;
    margin: 0 0 6px 11px;
  }
}
.bottom-box {
  margin-top: 20px;
  padding: 20px;
  @extend .common;
  div {
    font-size: 13px;
    line-height: 30px;
  }
}
</style>