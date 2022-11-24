<template>
  <div>
    <!-- 弹出层 -->
    <Popup v-model="show" class="box" @click-overlay="dialogClose" :showConfirmButton="false" :close-on-click-overlay="false">
      <div class="Titletext">恭喜您！可以领取以下权益</div>
      <div class="banner-box">
        <div class="content" v-for="(item,index) in Itemcarlist" :key="item.id">
          <img :src="item.type==1 ? item.picture : item.type==3 ? oilSrc :src" alt="">
          <div class="right-text">
            <div class="coupon-title">{{item.type==1?item.vouchersTitle:(item.amount+(item.type==3?'油卡余额':'权益'))}}</div>
            <div class="texttemplate text-ellipsis">{{item.type==1? item.vouchersExplain:item.type==3?'油卡余额可以兑换加油':'权益可以兑换加油、洗车等服务'}}</div>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <Button type="info" class="btn" @click="Confirm">确认领取</Button>
      </div>
    </Popup>
  </div>
</template>
<script>
import { Popup, Card, Button, Toast, Dialog, Cell } from 'vant';
import { getRightsAndInterests } from '@/api/user'
import { Debounce, storageSet, storageGet } from '@/utils/utils'

export default {
  name: '',
  components: {
    Popup, Card, Button, 'van-dialog': Dialog.Component, Cell
  },
  props: {
    show: {
      type: Boolean
    },
    Itemlist: {
      type: Array
    }
  },
  data() {
    return {
      Itemcarlist: [],
      src: require('../../../assets/img/integral.png'),
      oilSrc: require('../../../assets/img/w18.png'),
      disabled: false
    };
  },
  watch: {},
  computed: {

  },
  methods: {
    dialogClose() {
      this.$emit('update:show', false)
    },
    //    提交权益
    Confirm: Debounce(function () {
      let that = this
      let userInfo = storageGet('userInfo')
      let obj = {
        list: that.Itemcarlist,
        phone: userInfo.bindPhone
      }
      getRightsAndInterests(obj).then(res => {
        if (res.code == 200) {
          Toast('领取成功')
          that.$emit('update:show', false)
          if (that.$parent.createdState) {
            that.$parent.createdState();
            return
          }
          this.$router.push({ path: '/user/index' })
        } else {
          Toast('领取失败')
        }
      })
      // if (that.$parent.createdState) {
      //   that.$parent.createdState();
      //   return
      // }
      // that.$parent.createdState()
      if (that.$parent.getIntegralWithdrawalList) {
        that.$parent.getIntegralWithdrawalList();
      }
      // that.$parent.getIntegralWithdrawalList()
      if (that.$parent.getOilCardBalance) {
        that.$parent.getOilCardBalance();
      }
      // that.$parent.getOilCardBalance()

    }, 5000)
  },
  created() {
    this.Itemcarlist = this.Itemlist
  },
  mounted() { },
  destroyed() {
  }
};
</script>
<style lang="scss" scoped>
.box {
  width: 300px;
  height: 596px;
  background: url("../../../assets/img/integral/bg3.png");
  background-size: 100% 100%;
  margin-top: -60px;
  .Titletext {
    font-size: 19px;
    text-align: center;
    margin: 170px 0px 10px;
    color: #fff;
  }
  .banner-box {
    height: 350px;
    background: #fff;
    overflow: auto;
  }
  .btn-box {
    background: #fff;
    padding: 5px 5px 20px 5px;
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    border-radius: 0 0 6px 6px;
    .btn {
      width: 172px;
      height: 40px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
      border-radius: 25px;
      border: none;
    }
  }
  .content {
    width: 276px;
    margin: 6px auto;
    background: #ffffff;
    box-shadow: 2px 4px 17px rgba(0, 0, 0, 0.08);
    // box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2), 0 0 4px rgba(0, 0, 0, 0.08),
    // 0 0 8px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    padding: 10px 17px;
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 48px;
      margin-right: 20px;
    }
    .right-text {
      font-weight: bold;
      font-size: 18px;
      line-height: 20px;
      color: #ff9519;
      .texttemplate {
        width: 168px;
        font-weight: normal;
        font-size: 12px;
        color: #000000;
      }
    }
  }
}
</style>