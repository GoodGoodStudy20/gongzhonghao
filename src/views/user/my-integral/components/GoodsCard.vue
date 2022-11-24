<template>
  <div class="box">
    <div class="Title-text" v-show="goodsList.length > 0">权益兑换</div>
    <div class="list-box">
      <List v-model="loading" :finished="finished" finished-text @load="onLoad">
        <WashCoupons :list="goodsList" :city="city" :regionCode="regionCode">
          <template #rightBottom="{item}">
            <Stepper @change="stepperChange" theme="round" button-size="20" integer class=" stepper" v-model="item.number" min="0" disable-input :disable-plus="Math.floor(Number(totalLess) / Number(item.integralPrice))<1" />
          </template>
        </WashCoupons>
        <!-- <div class="coupons-box" v-for="(item,index) in goodsList" :key="index">
          <div class="coupons-img" :style="`background-image: url(`+ item['vouchersPic'] +`);`"></div>
          <div class="right-info">
            <div class="title">{{item.vouchersTitle}}</div>
            <div class="mark">{{ item.vouchersType?`限制${city}使用`:''}}</div>
            <div class="tips">{{item.vouchersExplain}}</div>
          </div>
          <div class="operation-bar">
            <p v-text="item.integralPrice+'权益'"></p>
            <Stepper @change="stepperChange" theme="round" button-size="20" integer class=" stepper" v-model="item.number" min="0" disable-input :disable-plus="Math.floor(Number(totalLess) / Number(item.integralPrice))<1" />
          </div>
        </div> -->
      </List>
    </div>
    <div class="bottom">
      <div class="sures" @click="submit" :disabled="disableBtn" v-if="goodsList.length > 0">确认兑换</div>
    </div>
  </div>
</template>
<script>
import { storageGet, storageSet } from '@/utils/utils'
import WashCoupons from '@/components/WashCoupons.vue'
import { Button, Card, List, Stepper, Toast, Dialog } from 'vant'
import { getVouchers, getIntegralExchangeList, integralExchange } from '@/api/user'
export default {
  name: '',
  components: {
    Button, Card, List, Stepper, Dialog, WashCoupons
  },
  props: ['totalIntegral'],
  data() {
    return {
      city: storageGet('City'),
      regionCode: '',
      loading: false,
      finished: false,
      goodsList: [],
      totalLess: 0,
      pageNum: 1,
      disableBtn: false
    }
  },

  filters: {
    vouchersTitle: value => {
      return value.substr(0, 5)
    }
  },

  created() {
    this.regionCode = storageGet('CityCode')
    this.totalLess = sessionStorage.getItem('my_integral')
    console.log(1111, this.totalLess, this.totalIntegral, sessionStorage.getItem('my_integral'))
  },
  methods: {
    stepperChange() {
      console.log('change', this.goodsList)
      let allArr = JSON.parse(JSON.stringify(this.goodsList))
      let totalIntegral = JSON.parse(JSON.stringify(this.totalIntegral));
      let totalAdd = 0
      let arr = allArr.filter(item => item.number > 0);
      allArr.filter(item => item.number > 0).forEach((item) => {
        totalAdd += (parseInt(item.number) * parseInt(item.integralPrice))
      })
      this.totalLess = Number(totalIntegral - totalAdd).toFixed(0);
      console.log(totalIntegral, totalAdd, this.totalLess)
    },
    submit() {
      let params = {}
      let userInfo = storageGet('userInfo')
      let arr = []
      this.goodsList.filter(item => item.number > 0).forEach((item) => {
        let { number, vouchersId, vouchersType, integralPrice } = [item].length && [item][0]
        arr.push({
          number: number, vouchersId: vouchersId, vouchersType: vouchersType, integral: integralPrice
        })
      })
      let totalIntegral = 0
      this.goodsList.filter(item => item.number > 0).forEach((item) => {
        totalIntegral += (parseInt(item.number) * parseInt(item.integralPrice))
      })
      if (Number(totalIntegral) > Number(this.totalIntegral)) {
        Toast('权益不足')
        return
      }
      if (arr == [] || arr.length == 0) {
        Toast('请选择权益券后再点击确认兑换');
        return false;
      }
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          params['list'] = arr;
          params['regionCode'] = this.regionCode || '440300';
          params['totalIntegral'] = totalIntegral;
          params['phone'] = userInfo.bindPhone;
          integralExchange(params).then(async (response) => {
            await done()
            this.disableBtn = false
            if (response.code == 200) {
              Toast('兑换成功！');
              this.$router.push('/user/my-coupons/index')
            } else
              Toast(response.msg || response.error_msg || response.message);
          })
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '确认提交',
        beforeClose
      })
    },
    onLoad() {
      let that = this;
      let params = {};
      params['countIntegral'] = this.totalLess || 0
      params['regionCode'] = this.regionCode || '440300'
      if (!this.regionCode) return
      if (this.$route.query.hasOwnProperty('vouchersType')) {//首页跳进
        params.pageNum = this.pageNum
        params.pageSize = 20
        params['vouchersType'] = this.$route.query.vouchersType || ''
        getVouchers(params)
          .then((response) => {
            if (response.code == 200) {
              this.pageNum++;
              let arr = response.data.records;
              arr = arr.map(v => {
                return { ...v, number: 0, maxNumber: parseInt(Number(params['countIntegral']) / Number(v.integralPrice)) }
              })
              this.goodsList = [...this.goodsList, ...arr];
              console.log('this.goodsList', arr, this.goodsList)
            }
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            this.finished = true;
          }).catch(err => {
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            this.finished = true;
          })
      } else {//个人中心跳进
        getIntegralExchangeList(params)
          .then((response) => {
            if (response.code == 200) {
              let arr = response.data;
              arr = arr.map(v => {
                return { ...v, number: 0, maxNumber: parseInt(Number(params['countIntegral']) / Number(v.integralPrice)) }
              })
              this.goodsList = arr;
            }
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            this.finished = true;
          }).catch(err => {
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            this.finished = true;
          })
      }
    }
  },

};
</script>
<style lang="scss" scoped>
.box {
  margin: 12px auto 0;
  width: 351px;
  // background: #fdfeff;
  // background: red;
}
.Title-text {
  font-weight: bold;
  font-size: 16px;
  color: #000000;
  padding: 8px 0 14px 12px;
}
.list-box {
  // height: calc(100vh - 265px);
  // overflow-x: hidden;
  // background: #fdfeff;
  // overflow-y: auto;
  padding-bottom: 70px;
}
.bottom {
  width: 100vw;
  position: fixed;
  bottom: 0px;
  left: 0;
  background: #fdfeff;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  .sures {
    padding: 10px;
    width: 110px;
    height: 38px;
    // line-height: 38px;
    background: linear-gradient(166.39deg, #ffaf9b -6.26%, #f14f44 113.4%);
    box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
    border-radius: 39px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    color: #fff;
  }
}
</style>
<style lang="scss">
.list-box {
  .van-stepper--round .van-stepper__minus,
  .van-stepper--round .van-stepper__plus {
    color: #fff;
    background: linear-gradient(161.1deg, #ffaea2 -0.52%, #ff8371 92.98%);
    border: none;
  }
}
</style>