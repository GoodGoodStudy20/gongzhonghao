<template>
  <!-- <van-dialog v-model="show" title="加油优惠提醒" :before-close="beforeClose" confirmButtonText="去兑换油" :cancelButtonText="showCancel?'继续提现':'关闭'" :close-on-click-overlay="true" showCancelButton cancelButtonColor="#aaa">

    <div class="top-msg">
      <img src="@/assets/img/w18.png" alt="">
      <div>
        <div style="color:#000;font-weight:700">中石化官油，{{city=='gd'?'广东':'河南'}}通用</div>
        <div style="line-height:35px;height:35px">{{city=='gd'?'100权益换105元油':' '}}</div>
        <div>{{city=='gd'?'1元起充':'权益兑换实时到账'}}</div>
      </div>
    </div>
    <div class="contennier">
      <div class="fens">
        <div>您有{{integral}}权益</div>
        <div class="top-text">可兑换<span>{{city=='gd'?Math.floor(integral*1.05):integral}}</span>元中石化油</div>
      </div>
      <div class="send" v-if="coupons">
        <div class="title">并赠送您</div>
        <div class="content">{{coupons}}</div>
      </div>
    </div>
  </van-dialog> -->
  <van-dialog class="box" v-model="show" :before-close="beforeClose" :close-on-click-overlay="true" :showConfirmButton="false">
    <div class="contennier">
      <div>1元起充</div>
      <div>中石化官油、广东通用</div>
      <div>您有<span>{{integral}}</span>权益</div>
      <div>可兑换<span>{{city=='gd'?Math.floor(integral*1.05):integral}}</span>元中石化油</div>
      <div class="btn-box">
        <div @click="beforeClose('cancel')">{{showCancel?'继续提现':'关闭'}}</div>
        <div @click="beforeClose('confirm')">去兑换油</div>
      </div>
    </div>
  </van-dialog>
</template>

<script>
import { Dialog } from 'vant'
import { getVouchersGiveConfigByRegionCode, getMobileMenuByCode } from '@/api/user'
import { storageGet } from '@/utils/utils'
export default {
  name: 'OilExtension',
  components: { 'van-dialog': Dialog.Component },
  props: ['show', 'integral', 'showCancel'],
  data() {
    return {
      city: '',
      coupons: '',
      mid: ''
    }
  },
  created() {
    let code = storageGet('CityCode') ? (storageGet('CityCode').substring(0, 2) + '0000') : ''

    this.city = (code == '440000' ? 'gd' : (code == '410000' ? 'hn' : ''))
    // getVouchersGiveConfigByRegionCode({ regionCode: code }).then(res => {
    //   this.coupons = res.data || ''
    // })
    getMobileMenuByCode({ code: `${this.city}Oil` }).then(res => {
      console.log(res)
      this.mid = res.data ? res.data.id : ''
    })
  },
  methods: {
    beforeClose(action, done) {
      console.log(action)
      this.$emit('update:show', false)
      if (action == 'confirm') {
        this.$router.push('/oilFilling/index?id=' + this.mid)
      } else if (action == 'cancel') {
        if (this.showCancel) {
          this.$router.push('/user/my-integral/cashpage')
        }
      }
      if (!done) return
      done(false)
    }
  },
};
</script>
<style  scoped lang="scss">
.box {
  width: 242px;
  height: 311px;
  background: url("../../../../assets/img/integral/bg2.png");
  background-size: 100% 100%;
}
.contennier {
  width: 196px;
  color: #fff;
  text-align: center;
  margin: 137px auto;
  font-size: 16px;
  line-height: 19px;
  div:nth-child(1) {
    font-size: 13px;
  }
  div:nth-child(2) {
    font-size: 11px;
    margin-bottom: 10px;
  }
  div:nth-child(3) {
    margin-bottom: 7px;
  }
  span {
    font-size: 20px;
    color: #ffd362;
    margin: 0 5px;
  }
}
.btn-box {
  // margin-top: 28px;
  margin-top: 10px;
  width: 100%;
  height: 32px;
  display: flex;
  color: #fff;
  font-size: 13px;
  btn {
    flex: 1;
    white-space: nowrap;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    box-shadow: 0px 4px 10px rgba(219, 13, 0, 0.5);
    border-radius: 85px;
  }
  div:nth-child(1) {
    @extend btn;
    font-size: 12px;
    margin-right: 28px;
    font-weight: 400;
    background: linear-gradient(
      294.87deg,
      rgba(255, 202, 26, 0.6) 25.15%,
      rgba(255, 215, 121, 0.6) 93.05%
    );
  }
  div:nth-child(2) {
    @extend btn;
    font-weight: 900;
    font-size: 13px;
    background: linear-gradient(294.87deg, #ffca1a 25.15%, #ffd36a 93.05%);
  }
}
</style>