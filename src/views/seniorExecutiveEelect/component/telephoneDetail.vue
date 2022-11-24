<template>
  <div class="telephoneDetail">
    <div class="telephoneDetail-box">
      <div class="title">
        <img src="@/assets/img/tel.png" alt="" />
        <span class="title-text">话费充值{{telList.name}}</span>
        <span style="">- {{telList.payAmount}}.00</span>
      </div>
      <div class="conter">
        <div class="conter-left">
          <div v-for="(item, index) in textList" :key="index">{{ item }}</div>
        </div>
        <div class="conter-right">
          <div>{{telList.payStatus !=1 ?supplierList[telList.payStatus]:recharge[telList.isUsed]}}（进度{{telList.progress}}）</div>
          <div>{{modeList[telList.rechargeMode]}}<span v-if="telList.rechargeMode ==2">（微信{{telList.price}}+权益{{telList.payIntegral}}）</span> </div>
          <div>话费充值</div>
          <div>{{telList.rechargeAccount}}</div>
          <div>{{telList.purchaseTime}}</div>
          <div>{{telList.purchaseTime}}</div>
          <div>{{pwNo}}</div>
          <div>
            <a style="color:#0099ff;text-decoration: none" href="tel:4006310818">400-6310-818</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConsumptionRecordsDetail } from "@/api/user.js";
export default {
  name: 'telephoneDetail',
  data() {
    return {
      pwNo: '',
      telList: {},
      recharge: ['未到账', '已到账', '部分到账'],
      supplierList: ['未付款', '充值中', '已充值', '已退款', '退款中', '部分退款'],
      recharge: ['未到账', '已到账', '部分到账'],
      modeList: ['权益支付', '微信支付', '组合支付'],
      textList: [
        '当前状态',
        '付款方式',
        '商品类型',
        '充值号码',
        '创建时间',
        '支付时间',
        '订单单号',
        '联系客服'
      ]
    }
  },
  created() {
    let id = this.$route.query.id
    this.getData(id)
  },
  methods: {
    async getData(id) {
      const res = await getConsumptionRecordsDetail({ id })
      console.log(res);
      this.pwNo = res.data.pwNo.includes(',') ? res.data.pwNo.split(',')[0] : res.data.pwNo
      this.telList = res.data ? res.data : {}
    }
  }
}
</script>

<style scoped lang="scss">
.telephoneDetail {
  background-color: #f6f7f9;
  height: 100vh;
  padding-top: 12px;
  &-box {
    background-color: #fff;
    margin: 0 15px;
    border-radius: 6px;
    .title {
      padding-top: 12px;
      img {
        width: 48px;
        height: 48px;
      }
      span {
        font-size: 20px;
        opacity: 0.8;
      }
      &-text {
        font-size: 16px;
        margin: 10px 0 12px;
      }
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .conter {
      padding-top: 20px;
      margin: 0 12px;
      border-top: 1px solid #ccc;
      display: flex;
      font-size: 14px;
      &-left {
        margin-right: 20px;
        line-height: 20px;
        opacity: 0.6;
        div {
          margin-bottom: 12px;
        }
      }
      &-right {
        div {
          margin-bottom: 12px;
        }
        line-height: 20px;
        opacity: 0.9;
      }
    }
  }
}
</style>
