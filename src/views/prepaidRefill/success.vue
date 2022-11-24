<template>
  <div class="box">
    <div class="contennier">
      恭喜您！充值到账成功 <span>{{amount}}元</span>
    </div>
    <Tabbars :active="0"></Tabbars>
  </div>
</template>



<script>
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
import Tabbars from '@/components/tabbars.vue'
import { Dialog, Toast } from 'vant'
import { countVouchersInterests, addGdOilCouponRecharge, addGHnOilCouponRecharge } from '@/api/user'
import { Debounce, storageSet, storageGet } from '@/utils/utils'

export default {
  name: 'oilFilling',
  components: { Tabbars },
  data() {
    return {
      city: '',
      amount: 0
    }
  },
  mounted() {
    this.amount = this.$route.query.amount || 0
    let msg = this.$route.query.msg || ''
    if (msg && msg != 'true') {
      let dom = `<span style='color:red'>${msg}</span>`
      Dialog.confirm({
        title: '充值成功并赠送您',
        message: dom,
        cancelButtonText: '关闭',
        confirmButtonText: '去查看'
      }).then(() => {
        this.$router.replace('/user/my-coupons/index')
      }).catch(() => {

      });
    }
    let code = storageGet('CityCode') ? (storageGet('CityCode').substring(0, 2) + '0000') : ''
    this.city = code == '410000' ? 'hn' : code == '440000' ? 'gd' : ''
    getJsJDK()
  },
  computed: {
    tipList() {
      let list = [
        '前往广东省内中石化直营加油站',
        '选择油品给爱车加油',
        '出示“大家来加油”小程序的电子加油券二维码',
        "客服电话：<a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"],
        list2 = [
          '前往河南省内中石化直营加油站',
          '选择油品给爱车加油',
          '出示“中石化一键加油”小程序的电子券',
          "客服电话：<a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"]
      return this.city == 'hn' ? list2 : list
    },
    topTip() {
      return this.city == 'hn' ? "河南中石化小程序 “中石化一键加油”" : "广东中石化小程序 “大家来加油”"
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 10px 0 70px;
}
.fen {
  display: inline-block;
  width: 40px;
  border: 2px dashed #000;
}
.common {
  padding: 5px;
  width: 96%;
  margin: 0px auto;
  background-color: #ffffff;
}
.contennier {
  @extend .common;
  font-size: 20px;
  text-align: center;
  margin: 20px 0 60px;
  span {
    font-size: 18px;
    color: red;
    margin: 0 5px;
  }
}
.bottom-box {
  padding: 20px;
  @extend .common;
  div {
    font-size: 15px;
    line-height: 30px;
  }
}

.qrcode-img {
  @extend .common;
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    border: 1px solid #f0f0f0;
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
  }
}
.use-box {
  @extend .common;
  display: flex;
  margin-top: 10px;
  justify-content: space-around;
  align-items: center;
  .img-box {
    font-size: 14px;
    text-align: center;
  }
}
</style>