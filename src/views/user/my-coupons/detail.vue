<template>
  <div class="box">
    <div class="coupons-box2">
      <img class="bg-img" src="@/assets/img/coupons.png" alt="">
      <p class="title">{{items.vouchersTitle}}</p>
      <div class="bottom-info">
        <img :src="items.vouchersPic" alt="">
        <div>
          <div class="tips">{{items.vouchersExplain}}</div>
          <div class="mark">限制{{items.regionName}}使用</div>
        </div>
      </div>
    </div>
    <div class="phone-verf-box" v-if="items.isUsed == 0">
      <!-- <div class="img" src="" alt=""></div> -->
      <img class="img" src="@/assets/img/czhm.png" alt="">
      <div>
        <!-- <div class="phone-title">手机号</div> -->
        <div class="phone">{{form.phone}}</div>
      </div>
    </div>

    <div class="phone-verf-box" v-if="items.isUsed==3 && rid">
      <!-- <div class="img" src="" alt=""></div> -->
      <!-- <img class="img" src="@/assets/img/czzs.png" alt=""> -->
      <div>
        <!-- <div class="phone-title">已赠送</div> -->
        <div class="name">姓名:{{items.giveName}}</div>
        <div class="phone">手机号:{{items.givePhone}}</div>
      </div>
    </div>
    <div class="phone-verf-box" v-if="items.isUsed==1 && rid">
      <!-- <div class="phone-verf-box" v-if="items.isUsed!=1 && !rid"> -->
      <!-- <div class="img" src="" alt=""></div> -->
      <!-- <img class="img" src="@/assets/img/czhm.png" alt=""> -->
      <div class="right-info">
        <div class="phone-title">充值信息</div>
        <div class="pay-no" v-if="isUsedItem.payNo ||true">订单号:{{isUsedItem.payNo}}</div>
        <div v-if="isUsedItem.usedPhone ||true">手机号:{{isUsedItem.usedPhone}}</div>
        <div>充值时间:{{isUsedItem.createTime || items.usedTime}}</div>
        <div>充值金额:{{ items.vouchersPrice ||isUsedItem.actualAmount}}元</div>
        <div v-if="isUsedItem.payAmount ||true">实付金额:{{isUsedItem.payAmount}}元</div>
      </div>
    </div>
    <div class="coupons-tip-box">
      <div class="title common-title">使用规则</div>
      <div v-html="items.ruleContent"></div>
    </div>
    <!-- <div class="qrcode-img">
      <p>去加油</p>
      <img :src="bg[items.usedArea == 410000?1:0]">
    </div> -->
    <div class="btn-box">
      <div class="submit-use" v-if="items.isUsed == 0 && items.usedArea == 410000" @click="giveShow=true">赠送他人</div>
      <div class="submit-use" v-if="items.isUsed == 0" @click="submit" :style="form.phone && (String(form.phone).length > 10) ? 'opacity:1;':'opacity:.5;'">确定充值</div>
    </div>
    <Give :id="idList" :show.sync="giveShow" :phone="form.phone" v-if="giveShow" :total="total"></Give>
  </div>
</template>
<script>
import { Toast, Dialog, Cell, Col, Row } from 'vant';
import Give from './components/Give.vue';
import { getH5VouchersInfo, weChatPayNow, closeOrder, hnWeChatPayNow, getSMSCode, oilCouponRecharge, getJsJDK, getVouchersListByVouchersId, getVouchersPayInfoByRId } from '@/api/user'
import { storageSet, storageGet, Debounce } from '@/utils/utils'
import wx from 'weixin-js-sdk'

export default {
  components: {
    Give, Cell, Col, Row
  },
  name: 'myCouponsDetail',
  data() {
    return {
      items: {
        ruleContent: '',
        vouchersTitle: '',
        vouchersExplain: '',
        expireDate: '',
      },
      bg: [
        require('@/assets/img/wlyn/qrcodedjljy.png'),
        require('@/assets/img/wlyn/hn.png'),
      ],
      total: 0,
      rid: '',
      idList: [],
      isUsed: '',
      vouchersId: '',
      // phone verf code
      islogin: false,
      form: {
        phone: storageGet('userPhone'),
      },
      verfText: '发送验证码',   //验证码按钮文本
      wait: 60,                //验证码倒计时
      verfThrottling: false,   //验证码节流控制
      giveShow: false,
      isUsedItem: {}
    }
  },
  computed: {
    buttonName() {
      let name = this.items.usedArea == '410000' ? '确定使用' : this.items.usedArea == '440000' ? '确定充值' : '确定充值'
      return name
    }
  },
  created() {
    getJsJDK()
    this.rid = this.$route.query.rid
    this.isUsed = this.$route.query.isUsed
    this.vouchersId = this.$route.query.vouchersId
    this.form.phone = storageGet('userPhone')
    this.onload()
  },
  methods: {
    onload() {
      if (this.rid) {
        this.idList = this.rid.split(',')
        getH5VouchersInfo({ rId: this.rid }).then((response) => {
          if (response.code == 200) {
            this.items = response.data;
            this.total = 1
            console.log(1121211, this.items)
            if (this.items.isUsed == 1) {
              getVouchersPayInfoByRId({ rId: this.rid }).then(res => {
                this.isUsedItem = res.data || {}
              })
            }
          }
        })
      }
      if (this.vouchersId) {
        let params = {
          isUsed: this.isUsed,
          vouchersId: this.vouchersId,
          phone: this.form.phone,
          pageNum: 1,
          pageSize: 1
        }
        getVouchersListByVouchersId(params).then(res => {
          if (res.code != 200) return
          if (!res.data.records || !res.data.records.length) {
            this.$router.replace('/user/my-coupons/index')
          }
          this.items = res.data.records[0]
          this.total = res.data.total
          this.$nextTick(() => {
            params.pageSize = this.total
            getVouchersListByVouchersId(params).then(res => {
              if (res.code != 200) return
              this.idList = res.data.records.map(item => item.rid)
            })
          })
        })
      }
    },
    time() {
      if (this.wait == 0) {
        this.verfThrottling = false;
        this.verfText = "获取验证码";
        this.wait = 60;
      } else {
        this.verfThrottling = true;
        this.verfText = "重新发送(" + this.wait + "S)";
        this.wait--;
        setTimeout(() => {
          this.time();
        }, 1000)
      }
    },
    subVerf() {
      if (this.verfThrottling == false && this.form.phone && this.form.phone.length >= 11) {
        getSMSCode(this.form.phone)
          .then((response) => {
            if (response.code == 200) {
              this.islogin = true
            }
          })
        this.time();
      } else {
        if (!this.form.phone || this.form.phone.length < 11) {
          Toast('请填写正确手机号', 1200);
          return false;
        }
      }

    },
    submit: Debounce(function () {
      if (!this.form.phone || String(this.form.phone).length < 11) {
        Toast('请填写正确手机号', 1200);
        return false;
      }
      if (this.items.isUsed == 1) {
        Toast('该券已被使用', 1200);
        return false
      }

      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          if (this.items.usedArea == "410000") {//河南油券
            this.requestPay('hn', done)
          } else if (this.items.usedArea == "440000") {//广东油券
            this.requestPay('gd', done)
          } else {
            Toast('暂只支持广东、河南地区', 1200);
          }
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: `确定充值到手机号${this.form.phone}？`,
        beforeClose
      })
    }, 3000),
    requestPay(city, done) {
      let that = this;
      let params = {
        openId: storageGet('openId'),
        rid: this.items.rid,
        usedPhone: this.form.phone,
        // userId:storageGet('userId'),
        vouchersId: this.items.vouchersId,
        vouchersNumber: this.items.vouchersNumber,
      }
      let success = async response => {
        await done()
        if (response.code == 200) {
          let data = response.data;
          // 
          if (!data) {
            that.$router.replace('/user/my-coupons/use_success?area=' + city)
            return
          }
          wx.chooseWXPay({  //此方法应放在调用后台统一下单接口成功后回调里面，接口返回  timeStamp，nonceStr，package，paySign等参数
            appId: data.appId,  //此参数可不用
            timestamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function (r) {

              // 支付成功后的回调函数  
              if (r.errMsg == "chooseWXPay:ok") {
                //支付成功  
                that.$router.replace('/user/my-coupons/use_success?area=' + city)
              } else {
                location.reload();//支付失败 刷新界面
              }
            },
            cancel: function (r) {
              // 支付订单关闭后通知后端
              closeOrder(data.out_trade_no).then((response) => {

              })
              //支付取消
              if (r.errMsg == 'chooseWXPay:cancel') {
                Toast('取消支付', 1200);
              } else {
                Toast('支付关闭', 1200);
              }
            }
          });

        } else {
          console.log(response)
          Toast(response.msg || response.error_msg || response.message || '充值失败', 1200);
        }
      }
      let fail = error => {
        done()
        Toast(error.msg || error.error_msg || error.message, 1200);
      }
      if (city == 'gd') {
        weChatPayNow(params).then(success).catch(fail)
      } else if (city == 'hn') {
        hnWeChatPayNow(params).then(success).catch(fail)
      }
    },


  }
};
</script>
<style scoped lang="scss">
.box {
  height: 100vh;
  padding: 0px 0 70px;
  background: #fff;
  overflow: auto;
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
.tab-item-box {
  padding: 5px;
  width: 353px;
  margin: 9px auto;
  border-radius: 6px;
  box-shadow: inset 0px 0px 4px rgba(30, 176, 73, 0.28);
  background-image: url("../../../assets/img/bgimg.png");
  background-size: 100% 100%;
  height: 72px;
  display: flex;
  justify-content: space-between;
  .img {
    width: 65px;
    height: 60px;
    margin-left: 14px;
    margin-top: 4px;
  }
  .fens {
    font-size: 16px;
    margin-left: 10px;
    .top-text1 {
      padding: 0 10px;
      margin: 8px 0;
      height: 30px;
      line-height: 30px;
      background: #fbf6f0;
      border: 1px solid #fff7dc;
      box-sizing: border-box;
      border-radius: 2px 0px 0px 2px;
      text-align: center;
      color: #fbb03b;
    }
    .top-text2 {
      font-size: 10px;
      line-height: 17px;
      color: #bebebe;
    }
  }
  .record {
    justify-self: end;
    border-radius: 3px;
    font-size: 10px;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .list {
      color: #1eb049;
    }
    .total {
      background: #e3f9de;
      color: #1eb049;
      padding: 3px 8px;
    }
  }
}
.phone-verf-box {
  margin: 6px auto;
  width: 353px;
  background: #fff;
  border-radius: 6px;
  display: flex;
  // height: 92px;
  padding: 7px 0;
  align-items: center;
  font-size: 14px;
  color: #333333;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  .img {
    width: 56px;
    height: 67px;
    margin: 0 18px 0 11px;
  }
  .phone-title {
    font-weight: bold;
    margin-bottom: 2px;
  }
  .name {
    margin-bottom: 22px;
  }
  .phone {
    font-weight: bold;
    font-size: 15px;
    color: #333333;
  }
  .right-info {
    div {
      margin-bottom: 5px;
      margin-left: 10px;
    }
    .pay-no {
      word-break: break-all;
      line-height: 25px;
      white-space: pre-wrap;
      margin-bottom: 5px;
    }
  }
}
.coupons-tip-box {
  margin: 6px auto;
  width: 353px;
  // max-height: 359px;
  // overflow-y: auto;
  // background: #fff;
  border-radius: 6px;
  font-size: 11px;
  line-height: 20px;
  color: #333333;
  padding: 13px 29px;
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
}
.btn-box {
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0px;
  // background: #4bc557;
  .submit-use {
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    flex: 1;
    line-height: 45px;
    font-size: 17px;
    margin: 5px 20px;
    border-radius: 5px;
    text-align: center;
    color: #fff;
    // background: #fff;
  }
}
</style>