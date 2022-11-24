<template>
  <div class="coupons">
    <div class="coupons-box" v-for="(item,index) in list2" :key="index">
      <div class="coupons-box2">
        <!-- <div class="coupons-img" :style="`background-image: url(../../assets/img/w18.png)`"></div> -->
        <img v-if="item.oilCouponType==2" src="../../assets/img/shiYoulogo.png" alt="">
        <!-- <img :src="item.oilCouponType==2?`../../assets/img/w18.png`:`../../assets/img/shiYoulogo.png`" alt=""> -->
        <!-- 中石油logo -->
        <div class="right-info">
          <div class="title">{{item.name}}</div>
          <div>
            <div class="inviolable">
              <!-- <span class="mark"><span class="span">权益可抵</span></span> -->
              <div class="tips"></div>
              <span class="discount">9.4折</span>
            </div>
          </div>

        </div>
        <div class="price">
          <!-- integral当前账号权益  item.integralPrice 折后金额 权益小于实际支付为什么要隐藏￥符号？？？？？-->
          <!-- <span class="icon" v-if="Number(integral)<item.integralPrice">￥</span><span class="num">{{Number(integral)>item.integralPrice?item.integralPrice:item.amountPrice}}</span><span class="unit">/张</span> -->
          <span class="icon">￥</span><span class="num">{{Number(integral)>item.integralPrice?item.integralPrice:item.amountPrice}}</span><span class="unit">/张</span>
          <div class="old-price">原价￥{{item.originalPrice}}</div>
        </div>
      </div>
      <div class="operation-bar">
        <p>{{item.oilCouponType==2?'中石油':'中石化'}}官方直营店可使用</p>
        <!-- <slot name="rightBottom" :item="item"> -->
        <span class="button" @click="gotoBuy(item)">立即抢购</span>
        </slot>
      </div>
    </div>

    <div class="more" @click="more" v-if="list.length>3 && !isMore">更多优惠 <img src="../../assets/img/Vector.png" alt=""></div>
  </div>
</template>

<script>

import { getJsJDK, countVouchersInterests } from '@/api/user'
import { storageSet, storageGet, storageRemove } from '@/utils/utils'
export default {
  name: 'electronicVoupons',
  props: ['list', 'regionCode', 'city', 'product', 'mid'],
  data() {
    return {
      list2: [],
      isMore: false,
      integral: 0,
      radio: 0
    }
  },
  watch: {
    // 'list'(val) {
    //   this.list2 = val.slice(0, 3)
    // }
  },
   created() {
    this.list2 = this.list.slice(0, 3)
    this.userInfo = storageGet('userInfo')
    this.getInfo()
     getJsJDK()
      },
  methods: {
    getInfo() {
      countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
        if (res.code == 200) {
          this.integral = res.data.countIntegral ? res.data.countIntegral : 0
        }
      })
    },
    more() {
      this.list2 = this.list
      this.isMore = true
    },
    gotoBuy(item) {
      storageSet('Item', item)
      storageSet('Product', this.product)
      // this.$router.push(`/oilFilling/oilBuy?city=${this.city}&regionCode=${this.regionCode}&vouchersId=${item.vouchersId}`)
      this.$router.push(`/oilFilling/oilBuy?id=${this.mid}`)
      // this.$router.push({ name: 'oilBuy' })
    }
  }
}
</script>

<style lang='scss' scoped>
.coupons {
  filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
  margin: 0 10px;
}
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
    padding: 5px 0;
    display: flex;
    img {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    .coupons-img {
      background: no-repeat center;
      background-size: 60px 60px;
      width: 60px;
      height: 60px;
      margin-right: 16px;
    }
    .right-info {
      height: 67px;
      padding-top: 7px;
      box-sizing: border-box;
      // overflow: hidden;
      .inviolable {
        margin-top: 10px;
        position: relative;
      }
      .title {
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
        color: #000000;
        opacity: 0.9;
      }
      .mark {
        font-weight: normal;
        font-size: 9px;
        line-height: 10px;
        color: #818cff;
        border: 1px solid #b4baff;
        box-sizing: border-box;
        border-radius: 2px;
        width: 43px;
        height: 14px;
        margin-right: 10px;
        .span {
          transform: scale(0.75);
          -ms-transform: scale(0.75); /* IE 9 */
          -moz-transform: scale(0.75); /* Firefox */
          -webkit-transform: scale(0.75); /* Safari 和 Chrome */
          -o-transform: scale(0.75);
        }
      }
      .tips {
        display: inline-block;
        width: 31px;
        height: 14px;
        background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
        border-radius: 2px;
        line-height: 10px;
        padding: 2px 4px;
        margin-top: 10px;
        transform: skew(-4deg);
      }
      .discount {
        color: #fff;
        font-size: 11px;
        font-weight: 400;
        position: absolute;
        top: 8px;
        left: 2px;
      }
    }
    .price {
      // text-align: center;
      position: absolute;
      right: 20px;
      top: 20px;
      // margin: 20px 0 20px 40px;
      color: #f14f44;
      .icon {
        font-weight: 700;
        font-size: 12px;
        line-height: 18px;
      }
      .num {
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
      }
      .unit {
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
      }
      .old-price {
        font-weight: 400;
        font-size: 12px;
        line-height: 17px;
        text-decoration-line: line-through;
        color: #000000;
        opacity: 0.4;
      }
    }
  }
  .operation-bar {
    box-sizing: border-box;
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
      font-size: 13px;
      opacity: 0.5;
    }
    .button {
      width: 76px;
      height: 30px;
      border-radius: 30px;
      // color: rgba(16, 16, 16, 100);
      color: #fff;
      font-size: 13px;
      font-weight: 400;
      text-align: center;
      line-height: 30px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    }
  }
}
.more {
  text-align: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  color: #000000;
  opacity: 0.8;
  img {
    margin-left: 6px;
    width: 9px;
    height: 5px;
  }
}
</style>