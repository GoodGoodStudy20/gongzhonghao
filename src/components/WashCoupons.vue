<template>
  <div class="coupons">
    <div class="coupons-box" v-for="(item,index) in list" :key="index">
      <div class="coupons-box2">
        <div class="coupons-img" :style="`background-image: url(`+ item['vouchersPic'] +`);`"></div>
        <div class="right-info">
          <div class="title">{{item.vouchersTitle}} <span class="equity-deductible">权益可抵</span> </div>
          <!-- <div class="mark">{{ item.vouchersType?`限制${city}使用`:''}}</div> -->
          <div class="describe" v-if="item.couponType==4">
            <div class="describe-item">外观清洗</div>
            <div class="describe-item">内饰清洗</div>
          </div>
          <div class="describe" v-if="item.couponType==5">
            <div class="describe-item">沥青清除</div>
            <div class="describe-item">胶物清除</div>
            <div class="describe-item">清洁提亮</div>
          </div>
          <!-- <div class="tips">{{item.vouchersExplain}}</div> -->
        </div>
        <div class="price">
          <span v-if="Number(integral)<item.integralPrice">￥</span><span class="price-num">{{Number(integral)>item.integralPrice?item.integralPrice:item.amountPrice}}</span><span>/次</span>
        </div>
      </div>
      <div class="operation-bar">
        <!-- <p>{{item.integralPrice}}权益</p> -->
        <p>{{item.vouchersType?`限制${city}使用`:''}}</p>
        <slot name="rightBottom" :item="item">
          <span class="button" @click="gotoBuy(item)">立即购买</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { storageGet } from '@/utils/utils'
import { countVouchersInterests } from '@/api/user'
export default {
  name: 'WashCoupons',
  props: ['list', 'regionCode', 'city'],
  data() {
    return {
      integral: ''
    }
  },
  created() {
    this.userInfo = storageGet('userInfo')
    this.getInfo()
  },
  methods: {
    getInfo() {
      countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
        if (res.code == 200) {
          this.integral = res.data.countIntegral ? res.data.countIntegral : 0
          // if (Number(this.integral) >= Number(this.item.integralPrice)) {
          //   this.radio = '1'
          // }
        }
      })
    },
    gotoBuy(item) {
      this.$router.push(`/washCar/purchase?city=${this.city}&regionCode=${this.regionCode}&vouchersId=${item.vouchersId}`)
    },
  }
}
</script>

<style lang='scss' scoped>

.coupons-box {
  font-size: 14px;
  margin: 0 auto 10px;
  min-width: 100%;
  max-width: 350px;
  height: 130px;
  background: #fff;
  border-radius: 6px;
  // filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
  .coupons-box2 {
    position: relative;
    height: 80px;
    padding: 10px 0;
    display: flex;
    .coupons-img {
      background: no-repeat center;
      background-size: 60px 60px;
      width: 60px;
      height: 60px;
      margin: 0 10px;
    }
    .right-info {
      height: 67px;
      padding-top: 7px;
      box-sizing: border-box;
      // overflow: hidden;
      .title {
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
        color: #000000;
        opacity: 0.9;
        .equity-deductible {
          display: inline-block;
          border: 1px solid #b4baff;
          box-sizing: border-box;
          border-radius: 2px;
          color: #818cff;
          font-weight: 400;
          font-size: 9px;
          line-height: 10px;
          transform: skew(-10deg) translate(0px, -2px);
          padding: 2px 5px;
        }
      }
      .describe {
        display: flex;
        margin: 10px 0;
        .describe-item {
          margin-right: 4px;
          width: 56px;
          height: 18px;
          border: 1px solid rgba(251, 88, 77, 0.3);
          // background: rgba(241, 79, 68, 0.1);
          border-radius: 4px;
          // padding: 5px;
          text-align: center;
          font-weight: 400;
          font-size: 11px;
          line-height: 18px;
          color: #f14f44;
          opacity: 0.8;
        }
      }
      .mark {
        font-weight: normal;
        font-size: 13px;
        line-height: 10px;
        color: #000000;
        opacity: 0.8;
        padding: 15px 0;
      }
      .tips {
        font-size: 11px;
        line-height: 10px;
        color: #000000;
        opacity: 0.5;
      }
    }
    .price {
      position: absolute;
      right: 15px;
      top: 30px;
      color: #f14f44;
      font-weight: 700;
      font-size: 12px;
      .price-num {
        font-weight: 700;
        font-size: 20px;
      }
    }
  }
  .operation-bar {
    // box-sizing: border-box;
    border-top: 1px dashed #f1f1f1;
    width: calc(100% - 0px);
    padding: 10px 10px 5px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    &::after {
      position: absolute;
      content: " ";
      display: block;
      height: 16px;
      width: 8px;
      border-radius: 8px 0 0 8px;
      background: #f1f1f1;
      top: -8px;
      right: 0px;
    }

    &::before {
      position: absolute;
      content: " ";
      display: block;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      height: 16px;
      width: 8px;
      border-radius: 0 8px 8px 0;
      background: #f3f3f3;
      top: -8px;
      left: 0px;
    }
    p {
      margin: 0;
      font-size: 11px;
      font-weight: 400;
      color: #000000;
      opacity: 0.5;
    }
    .button {
      width: 76px;
      height: 30px;
      // border-radius: 4px;
      // color: rgba(16, 16, 16, 100);
      color: #fff;
      font-size: 13px;
      text-align: center;
      line-height: 32px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 30px;
      // border: 1px solid rgba(187, 187, 187, 100);
    }
  }
}
</style>