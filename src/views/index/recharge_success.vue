<!--
 * @Author: your name
 * @Date: 2021-02-20 09:52:02
 * @LastEditTime: 2021-02-20 14:09:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \weilaiyouni_mobile\src\views\index\index.vue
-->
<template>
  <div style="float:left">
    <div class="success-icons">
      <img :src="bg[0]">
    </div>
    <div class="status-title">
      恭喜您，获得<div class="status-amount">{{Number(amount)}}</div>元加油券
    </div>
    <div class="policy_tips">
      1.长按或扫描页面下方“大家来加油”二维码即可查看使用您的权益及余额
    </div>
    <div class="policy_tips">
      2.应用商店搜索下载“加油广东”APP，通过手机号登录后，即可查看使用您的权益及余额
    </div>

    <div class="qrcode-img">
      <div class="gd-code">
        <img src="https://gz.bcebos.com/v1/zhijianche/691983a5-1f6c-4f41-8bd8-a5449d4f5293.png" alt="">
        <wx-open-launch-weapp id="launch-btn" username="gh_85d236dfcbaa" path="">
          <script type="text/wxtag-template">
            <div style="height:150px;width:150px;opcity:0"></div>
          </script>
        </wx-open-launch-weapp>
      </div>
      <div style="font-size:14px;text-align:center;margin-top:10px">大家来加油</div>
    </div>
  </div>

</template>

<script>
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
export default {
  name: 'rechargeSuccess',
  data() {
    return {
      amount: 0,
      bg: [
        require('@/assets/img/wlyn/tix_icon_ok@3x.png'),
        require('@/assets/img/wlyn/qrcodedjljy.png'),
      ],
    }
  },
  created() {
    getJsJDK()
  },
  mounted() {
    this.amount = this.$route.query.amount
    var btn = document.getElementById('launch-btn');
    btn.addEventListener('launch', function (e) {
      console.log('success');
    });
    btn.addEventListener('error', function (e) {
      console.log('fail', e.detail);
    });
  }
};
</script>
<style scoped lang="scss">
.status-title {
  font-size: 22px;
  width: 80%;
  margin: 10px 10% 20px;
  text-align: center;
  font-weight: bold;
  color: #000;
  z-index: 2;
}
.status-amount {
  display: inline-block;
  color: red;
  font-size: 24px;
}
.sub-button {
  position: relative;
  width: 90%;
  line-height: 45px;
  margin: 20px 5% 120px;
  font-size: 16px;
  text-align: center;
  letter-spacing: 4px;
  border-radius: 5px;
  text-decoration: none;
  color: #ffffff;
  background-image: linear-gradient(
    90deg,
    rgb(0, 167, 79),
    rgba(0, 167, 79, 0.884) 73%,
    rgba(0, 167, 79, 0.822)
  );
}
.tip-box-wr {
  position: relative;
  width: 76%;
  margin: 40px 12%;
}
.tip-box-title {
  font-size: 16px;
  text-align: left;
  color: #000;
}
.tip-box-text {
  font-size: 14px;
  text-align: left;
  color: #ccc;
}
.success-icons {
  position: relative;
  display: flex;
  width: 50%;
  margin: 70px 25% 10px;
  justify-content: center;
}
.success-icons img {
  width: 90px;
  height: 90px;
  margin: 2px 0;
}
.policy_tips {
  position: relative;
  width: 70%;
  text-indent: -10px;
  line-height: 20px;
  letter-spacing: 1px;
  margin: 0 15% 5px;
  text-align: left;
  font-size: 14px;
  color: rgb(138, 138, 138);
  align-self: flex-end;
  word-wrap: normal;
  user-select: none;
}
.common {
  padding: 5px;
  width: 96%;
  margin: 0px auto;
  background-color: #ffffff;
}
.qrcode-img {
  @extend .common;
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .hn-code {
    background: url("https://gz.bcebos.com/v1/zhijianche/53dc94e1-2b9c-43ca-b366-9adbe5efd251.png");
  }
 
  .hn-code,
  .gd-code {
    height: 150px;
    width: 150px;
    background-size: 100% 100%;
    border-radius: 15px;
  }
  img {
    // border: 1px solid #f0f0f0;
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
  }
}
</style>