<template>
  <van-dialog class="dialog-box" v-model="show" :before-close="beforeClose" :showConfirmButton="false">
    <div class="contennier">
      <p>姓名：<span>{{form.realName}}</span></p>
      <p>证件号码：<span>{{form.idNum}}</span></p>
      <p>金额：{{moeny}} 元</p>
      <div class="btn-box">
        <div @click="beforeClose('confirm')">确认领取</div>
      </div>
    </div>
  </van-dialog>
</template>

<script>
import { Dialog } from 'vant'
import { getVouchersGiveConfigByRegionCode, getMobileMenuByCode } from '@/api/user'
import { storageGet } from '@/utils/utils'
export default {
  name: 'GetOilSuccess',
  components: { 'van-dialog': Dialog.Component },
  props: ['show', 'form', 'moeny'],
  data() {
    return {
      city: '',
      coupons: '',
      mid: ''
    }
  },
  created() {
  },
  methods: {
    beforeClose(action, done) {
      console.log(action)
      this.$emit('update:show', false)
      this.$emit('confirm', 1)
      if (!done) return
      done(false)
    }
  },
};
</script>
<style  scoped lang="scss">
.dialog-box {
  width: 321px;
  height: 361px;
  background: url("../../../../assets/img/user/bg1.png");
  background-size: 100% 100%;
}
.contennier {
  width: 200px;
  margin: 189px auto 0;
  p {
    margin: 0;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 12px;
    line-height: 20px;
    color: #333333;
    span {
      font-weight: normal;
      font-size: 12px;
      color: #666666;
    }
  }
}
.btn-box {
  margin-top: 28px;
  width: 100%;
  height: 32px;
  display: flex;
  color: #fff;
  font-size: 13px;
  div:nth-child(1) {
    margin: 0 auto;
    width: 160px;
    height: 36px;
    line-height: 36px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 35px;
    text-align: center;
  }
}
</style>