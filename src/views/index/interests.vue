<!--
 * @Author: your name
 * @Date: 2021-02-20 09:52:02
 * @LastEditTime: 2021-02-20 14:09:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \weilaiyouni_mobile\src\views\index\index.vue
-->
<template>
  <div>
    <div class="main-box" :style="`background-image: url(`+ bg[0] +`);`">
      <div class="input-box">
        <input type="text" maxlength="16" v-model="verfcode" placeholder="请输入16位核销码" />
      </div>
      <!-- <div class="type-select-box">
                <RadioGroup v-model="type" direction="horizontal">
                    <Radio name="1" checked-color="rgb(18, 120, 85)">核销码</Radio>
                    <Radio name="2" checked-color="rgb(18, 120, 85)">兑换码</Radio>
                </RadioGroup>
            </div>-->
      <div class="sub-button" :style="`background-image: url(`+ bg[1] +`);`" @click="submit">领取权益</div>

      <div class="tip-box-wr">
        <div class="tip-box-title" :style="`background-image: url(`+ bg[2] +`);`">活动说明</div>
        <div class="tip-box-text">
          <span class="important-tips">温馨提示</span>
          <br />
          <span>1.请输入您从其他渠道或者平台获取的兑换码</span>
          <br />
          <span>2.兑换码只能使用一次</span>
          <br />
          <span>3.请在有效期内进行兑换</span>
          <br />
          <a :href="'tel:'+service_phone">客服电话：{{service_phone}}</a>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, RadioGroup, Radio } from 'vant';
import { service_phone, } from '@/utils/http'
import { Debounce, storageSet, storageGet } from '@/utils/utils'
import { getIntegralCodeExchange, usedRecharge, checkCode, getVouchersCodeExchange,getJsJDK } from '@/api/user'

export default {
  components: {
    RadioGroup, Radio
  },
  name: 'interests',
  data() {
    return {
      type: '1',
      service_phone: service_phone,
      verfcode: '',
      phone: storageGet('userPhone'),
      bg: [
        require('@/assets/img/wlyn/img_bg@3x.png'),
        require('@/assets/img/wlyn/quanyi_btn_bg@3x.png'),
        require('@/assets/img/wlyn/quanyi_lv_bg@3x.png'),
      ],
      disabled: false
    }
  },
  created() {
    getJsJDK()
  },
  methods: {
    submit: Debounce(function () {
      if (!this.verfcode || this.verfcode.length != 16) {
        Toast('请输入16位核销码')
        return
      }
      if (this.disabled) return
      this.disabled = true
      checkCode({ 'code': this.verfcode })
        .then((response) => {
          if (response.code == 200) {
            if (response.data == 0) {
              this.submitIntegral();
            } else if (response.data == 1) {
              this.submitCode();
            } else if (response.data == 2) {
              this.submitVouchers()
            } else {
              Toast('领取失败,权益码不存在请核对权益码！')
            }
          } else {
            Toast(response.msg || response.error_msg, 1200);
          }
          this.disabled = false
        })
      /// 0 兑换码  权益   1 核销码   加油券     2 河南核销码加油券
    }, 2000),
    submitIntegral() {
      let userInfo = storageGet('userInfo')
      getIntegralCodeExchange({ exchangeCode: this.verfcode, phone: userInfo.bindPhone }).then(res => {
        if (res.code == 200) {
          Toast('领取权益成功，请到个人中心查看权益领取情况', 2000)
          this.$router.push('/user/index');
        } else {
          Toast('领取失败或重复领取,请稍后再试', 2000)
        }
      })
    },
    submitCode() {
      let userInfo = storageGet('userInfo')
      let params = { 'codeType': 0, 'phone': userInfo.bindPhone, 'code': this.verfcode };
      usedRecharge(params)
        .then((response) => {
          if (response.code == 200) {
            this.$router.push('/recharge_success?amount=' + response.data);
          } else {
            Toast(response.msg || response.error_msg, 1200);
          }
        }).catch((response) => {
          if (response.state === "0") {
            Toast(response.msg, 1000)
          }
        })

    },
    submitVouchers() {
      let userInfo = storageGet('userInfo')
      let params = {
        phone: userInfo.bindPhone,
        exchangeCode: this.verfcode
      };
      getVouchersCodeExchange(params)
        .then((response) => {
          if (response.code == 200) {
            Toast('领取优惠券成功，请到我的优惠券查看领取情况', 2000)
            this.$router.push('/user/my-coupons/index');
          } else {
            Toast(response.msg || response.error_msg, 1200);
          }
        }).catch((response) => {
          if (response.state === "0") {
            Toast(response.msg, 1000)
          }
        })
    }
  }
};
</script>
<style scoped>
.main-box {
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 680px;
  overflow-y: hidden;
  overflow-x: hidden;
  padding-top: 250px;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  background-position: top;
  background-size: 100%;
  background-repeat: no-repeat;
}

.input-box {
  position: relative;
  width: 70%;
  padding: 0;
  box-sizing: border-box;
  margin: 0 15% 10px;
  position: relative;
  display: flex;
  display: -webkit-flex;
  align-items: center;

  border: 0;
  vertical-align: baseline;
}
.input-box input {
  border: none;
  margin: 50px 0 0;
  padding: 10px 20px;
  outline: none;
  border-radius: 30px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  font-size: 17px;
  letter-spacing: 1px;
  box-sizing: border-box;
}
.input-box input::placeholder {
  color: rgb(199, 199, 199);
  font-size: 17px;
  letter-spacing: 1px;
  text-align: center;
}
.sub-button {
  position: relative;
  display: inline-block;
  width: 70%;
  float: left;
  line-height: 46px;
  margin: 10px 15% 15px;
  font-size: 18px;
  text-align: center;
  letter-spacing: 4px;
  border-radius: 25px;
  color: #ffffff;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  /* background-image: url(./img/quanyi_btn_bg@3x.png); */
}
.tip-box-wr {
  position: relative;
  background-color: rgb(246, 251, 249);
  width: 92%;
  margin: 10px 4%;
  border-radius: 30px;
  box-sizing: border-box;
  padding: 50px 30px 30px;

  box-shadow: 0 1px 4px 1px rgba(186, 241, 208, 1);
}
.tip-box-title {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  line-height: 34px;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  /* background-image: url(./img/quanyi_lv_bg@3x.png); */
}
.important-tips {
  font-weight: bolder;
  font-size: 16px;
}
.tip-box-text,
.tip-box-text a {
  font-size: 14px;
  text-align: left;
  text-decoration: none;
  user-select: none;
  color: rgb(18, 120, 85);
}
.type-select-box {
  position: relative;
  margin: 10px auto;
  text-align: center;
  font-size: 16px;
}
</style>