<template>
  <div class="success">
    <div class="success-title">
      话费充值成功<span>{{ amount || price }}元</span>
    </div>
    <div class="success-img">
      <img src="@/assets/img/success.png" alt="" />
    </div>
    <div class="success-button">
      <Button v-if="!share" @click="$router.push('/user/my-coupons/index')">查看订单</Button>
      <Button v-else @click="shareClick">关注九华保</Button>
      <div v-if="!share" class="shaer-img">
        <img src="@/assets/img/shaerBanner.png" alt="" />
      </div>
      <div v-else style="font-size: 14px; opacity: .6;margin-top: 15px;">
        点击“关注九华保”即可在“我的”全部订单中<br />
        查看充值进度
      </div>
    </div>
    <div class="success-text">
      <div class="hint-title">充值说明</div>
      <p v-for="(item, i) in codeList" :key="i">
        {{ i + 1 }}. <span v-html="item"></span>
      </p>
    </div>
  </div>
</template>

<script>
import { storageGet } from '@/utils/utils'
import { addPromote } from '@/api/user'
import { Button } from 'vant'
export default {
  name: 'telephoneExpenses_success',
  components: { Button },
  data() {
    return {
      share_openId: '',
      share: false,
      amount: 0,
      price: '',
      oilCouponType: '',
      referralPhone: ''
    }
  },
  methods: {
     shareClick() {
      //https://jhbtestapp.gongxingtech.com/#//telephoneExpenses/success?amount=50&share_OPENID=o-zYf50cB9NQwzXWDw3esj5Lxm3s
      //http://weixin.qq.cgm/r/6TiOiuLEZSoZKabpb21t
      //  window.location.href ='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx023e37c0d962a7c8&redirect_uri=https://jhbapp.gongxingtech.com/swagger-system/wxUser/wxMandateLoginCallBack&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      window.location.href =
        'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU4ODg5NTE2Ng==&scene=110#wechat_redirect'
    }
  },
 async created() {
    if (this.$route.query.amount) {
      this.amount = this.$route.query.amount || 0
    }
    if (this.$route.query.phone) {
      this.referralPhone = this.$route.query.phone
    }
    // if ((this.$route.query.shareOPENID ?? '') !== '') {
    //   this.share = true
    //   this.share_openId = this.$route.query.shareOPENID
    //   let referralOpenId = ''
    //   if (storageGet('userInfoShare')) {
    //     referralOpenId = storageGet('userInfoShare').openid
    //   }
    //   let userInfo = storageGet('userInfoShare')
    //   let data = {
    //     refereesOpenId: this.share_openId, //  推荐人openid
    //     referralOpenId, //    被推荐人openid
    //     referralPhone: this.referralPhone,//    充值电话
    //     price: this.amount, //  充值价格
    //     userInfo
    //   }
    //   const res = await addPromote(data)
    //   console.log(res)
    //   console.log(this.share_openId)
    // }
  },
  mounted() {
    if (this.$route.query.amount) {
      this.amount = this.$route.query.amount || 0
    }
    if (this.$route.query.phone) {
      this.referralPhone = this.$route.query.phone
    }
    if (this.$route.query.oilCouponType) {
      this.oilCouponType = this.$route.query.oilCouponType
    }
    if (this.$route.query.price) {
      this.price = this.$route.query.price
    }
    let msg = this.$route.query.msg || ''
    if (msg && msg != 'true') {
      let dom = `<span style='color:red'>${msg}</span>`
      Dialog.confirm({
        title: '充值成功并赠送您',
        message: dom,
        confirmButtonColor: '#F14F44',
        cancelButtonText: '关闭',
        confirmButtonText: '去查看'
      })
        .then(() => {
          this.$router.replace('/user/my-coupons/index')
        })
        .catch(() => { })
    }
    let code = storageGet('CityCode')
      ? storageGet('CityCode').substring(0, 2) + '0000'
      : ''
    this.city = code == '410000' ? 'hn' : code == '440000' ? 'gd' : ''
    if (this.oilCouponType) {
      this.city = this.oilCouponType == 1 ? 'hn' : 'gd'
    }
  },
  computed: {
    codeList() {
      let list = [
        '最快2小时内、最迟72小时到账；',
        '72小时内充值不成功费用将原路退回；',
        '充值类服务不支持错充退款；',
        '发票请到对应运营商应用自行开具；',
        '关注“九华保”公众号到个人中心可查看充值进度；',
        "客服电话：<a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>（工作日9.30-18.30）。"
      ]
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.common {
  padding: 14px 10px;
  margin: 0px auto 8px;
  width: 351px;
  background: #ffffff;
  //   box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
.success {
  &-title {
    margin-top: 20px;
    text-align: center;
    font-size: 19px;
    span {
      font-size: 20px;
      margin-left: 5px;
      color: #f14f44;
    }
  }
  &-img {
    margin-top: 30px;
    text-align: center;
    img {
      width: 184px;
      height: 184px;
    }
  }
  &-button {
    .shaer-img {
      img {
        width: 345px;
        height: 72px;
      }
      margin-top: 30px;
    }
    margin-top: 50px;
    text-align: center;
    button {
      width: 164px;
      height: 40px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 50px;
      color: #fff;
    }
  }
  &-text {
    @extend .common;
    padding: 14px 10px;
    .common-title {
      margin-bottom: 14px;
    }
    //温馨提示 标题  样式
    .hint-title {
      font-size: 16px;
      margin-bottom: 14px;
    }
    p {
      margin: 0 0 12px;
      font-weight: normal;
      font-size: 12px;
      color: #333333;
    }
  }
}
</style>
