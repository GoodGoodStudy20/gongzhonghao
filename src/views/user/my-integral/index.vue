<template>
  <div class="big-box">
    <!-- 权益显示 -->
    <div class="top-box">
      <div class="integral">
        <img src="@/assets/img/integral/3.png" alt="">
        {{countIntegral}}</div>
      <div class="right" @click="cashbutton">
        <span class="cash">提现</span>
      </div>
      <div class="date" @click="checkView">查看有效期<Icon name="arrow" size="14" color="#fff" style="margin-left:5px;"></Icon>
      </div>
      <!-- <div class="right" style="margin-top: 10px;padding-right:10px;opacity:0.9" @click="historyfen">权益历史</div> -->
    </div>
    <!-- 权益兑换列表-->
    <GoodsCard :totalIntegral="countIntegral"></GoodsCard>
    <OilExtension :show.sync="showOil" v-if="false" :integral="countIntegral" :showCancel="showCancel"></OilExtension>
    <!-- <OilExtension :show.sync="showOil" v-if="showOil" :integral="countIntegral" :showCancel="showCancel"></OilExtension> -->
  </div>
</template>
<script>
import { countVouchersInterests } from '@/api/user'
import { Button, Icon } from 'vant'
import { Debounce, storageSet, storageGet } from '@/utils/utils'
import GoodsCard from './components/GoodsCard.vue'
import OilExtension from './components/OilExtension.vue'
export default {
  name: 'myIntegral',
  components: {
    Button, GoodsCard, OilExtension, Icon
  },
  data() {
    return {
      countIntegral: '',
      showOil: false,
      showCancel: false
    };
  },
  created() {
    // this.oilIsShow()
    this.createdState()
  },
  methods: {
    oilIsShow() {
      let code = storageGet('CityCode')
      if (code.indexOf('4') != 0) {
        this.showOil = false
      }

    },
    createdState() {
      if (storageGet('userInfo') !== null) {
        let userInfo = storageGet('userInfo')
        countVouchersInterests(userInfo.bindPhone).then(res => {
          if (res.code == 200) {
            // 更新
            this.countIntegral = res.data.countIntegral ? res.data.countIntegral : 0
            sessionStorage.setItem('my_integral', this.countIntegral);
            sessionStorage.setItem('my_countVouchers', res.data.countVouchers ? res.data.countVouchers : 0);
            let code = storageGet('CityCode') ? (storageGet('CityCode').substring(0, 2) + '0000') : ''

            if (this.countIntegral && (code == '440000' || code == '410000')) {
              this.showOil = true
            }

          }

        })
      }
    },
    checkView() {
      this.$router.push('/user/my-integral/detail')
    },
    historyfen() {
      this.$router.push('/user/my-integral/history')
    },
    cashbutton() {
      // let code = storageGet('CityCode') ? (storageGet('CityCode').substring(0, 2) + '0000') : ''
      // if (this.countIntegral && (code == '440000' || code == '410000')) {
      //   this.showCancel = true
      //   this.showOil = true
      //   return
      // }
      this.$router.push('/user/my-integral/cashpage')
    }
  },
};
</script>
<style lang="scss" scoped>
.big-box {
  padding-top: 10px;
  background: #fdfeff;
}
.top-box {
  width: 351px;
  height: 133px;
  margin: 0 auto;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: url("../../../assets/img/integral/bg1.png");
  background-size: 100% 100%;
  display: flex;
  flex-wrap: wrap;
  color: #fff;
  font-size: 14px;
  padding: 0 17px;
  div {
    width: 50%;
    flex-shrink: 0;
    line-height: 60px;
  }
  .integral {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 24px;
    img {
      width: 40px;
      height: 40px;
      margin-right: 6px;
    }
  }
  .right {
    text-align: right;
  }
  .cash {
    font-weight: bold;
    text-align: center;
    padding: 5px 25px;
    border: 1px solid #ffffff;
    filter: drop-shadow(0px 3px 8px rgba(250, 130, 42, 0.25));
    border-radius: 88px;
  }
  .date {
    display: flex;
    font-size: 12px;
    align-items: center;
    margin-top: 10px;
    opacity: 0.7;
  }
}
</style>