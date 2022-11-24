<template>
  <div>
    <div class="coupons-box" v-for="(item,index) in list" :key="index">
      <!-- <button @click="fnccc(item)">111111111</button> -->
      <div v-if="item.name==='高管甄选'">
        <!--  -->
        <div class="good-detail">
          <div class="top">
            <img src="@/assets/img/shops.png" alt="">
            <div class="jhb">高管甄选</div>
            <span class="top-text">卖家已发货</span>
          </div>
          <!-- <Cell class="good-cell" :border="false" v-for="item in selectList" :key="item.id"> -->
          <Cell class="good-cell" :border="false">
            <div class="good-item">
              <img :src="item['icon']" alt="">
              <div class="item-right">
                <div class="title">{{item.goodsName||item.rechargeAccount}}</div>
                <div class="type">数量：{{item.goodsNum||1}}件</div>
              </div>
              <div class="item-bottom">
                <div>金额</div>
                <div><span class="money">￥</span><span class="amount">{{item.payAmount.toFixed(2)}}</span></div>
              </div>
            </div>
          </Cell>

        </div>

        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, Toast } from 'vant'
import { useDriveVoucher } from '@/api/user'
export default {
  name: 'CouponsList',
  props: ['list'],
  components: { Cell },
  data() {
    return {
      usedList: ['去加油', '已使用', '已过期', '已赠送'],
      usedList2: ['未使用', '已使用', '已过期', '已赠送'],
      usedList3: ['未使用', '已使用', '已撤回', '已过期'],
    }
  },
  created() {

  },
  methods: {
    fnccc(item) {
    },
    NumberMul(arg1, arg2) {
      let m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length
      } catch (e) { }
      try {
        m += s2.split(".")[1].length
      } catch (e) { }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    usedClick(item) {
      this.$emit('usedClick', item)
    },
    //加油券核销
    usedCilck2(item) {
      let query = {
        pwNo: item.pwNo
      }
      this.$router.push({ path: '/oilFilling/successOil', query: query })
    },
    //加油券核销
    usedCilck3(item) {
      let query = {
        price: item.price,
        oilCouponType: item.oilCouponType
      }
      this.$router.push({ path: '/oilFilling/success', query: query })
    },
    //e代驾点击去使用跳转
    edaijiaClick(item) {
      let params = {
        pwNo: item.pwNo
      }
      useDriveVoucher(params).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            window.location.href = res.data
          }
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    gotoPage(url) {
      if (url == '#') {
        Toast('该产品已下架')
        return
      }
      this.$router.push(url)
    },
  }
}
</script>

<style lang='scss' scoped>
.coupons-box {
  width: 350px;
  // height: 177px;
  padding-bottom: 10px;
  filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
  // -webkit-filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
  font-size: 14px;
  background: #ffffff;
  border-radius: 6px;
  margin: 0 auto 12px;
  // overflow: hidden;
  .cell-title {
    font-size: 13px;
    color: #000000;
  }
  .cell-value {
    font-size: 12px;
    color: #333;
  }
  .coupons-box2 {
    padding: 5px 11px;
    display: flex;
    .coupons-img {
      background: no-repeat center;
      background-size: 70px 70px;
      width: 80px;
      height: 80px;
      margin-right: 11px;
    }
    .right-info {
      flex: 1;
      .r-top,
      .r-bottom {
        display: flex;
        margin-top: 15px;
        justify-content: space-between;
      }
      .r-bottom {
        font-weight: bold;
        font-size: 13px;
        line-height: 12px;
        color: #ff9519;
      }
      .title {
        font-weight: bold;
        font-size: 14px;
        line-height: 19px;
        color: #000000;
      }
      // 加油券名称过长 挤压消费金额
      .title-name {
        width: 175px;
      }
      .goods {
        width: 165px;
        // flex-wrap: wrap;
        // display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .bottom {
    margin-top: 8px;
    height: 31px;
    padding: 0 11px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      font-weight: normal;
      font-size: 12px;
      line-height: 11px;
      color: #00000050;
    }
    &-txet {
      padding: 5px 12px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
      border-radius: 28px;
      color: #fff;
    }
    &-button {
      width: 100%;
      text-align: right;
      button {
        width: 76px;
        height: 29px;
        border-radius: 40px;
        border: 0.5px solid rgba(0, 0, 0, 0.2);
        font-size: 12px;
        opacity: 0.8;
        background-color: #fff;
      }
      button:nth-child(2) {
        margin-left: 12px;
        border: 0.5px solid #fb584d;
        color: #fb584d;
      }
    }
  }
}
.good-detail {
  background: #ffffff;
  border-radius: 8px;
  padding: 0 15px;
  margin-top: 10px;
  .top {
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    // margin-left: 10px;
    padding-top: 10px;
    img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    .jhb {
      flex: 1;
      font-size: 14px;
      line-height: 20px;
      color: #000000;
      opacity: 0.9;
    }
    span {
      color: red;
    }
  }
  .good-cell {
    background: #fff;
    border-radius: 8px;
    // margin-bottom: 10px;
    padding-left: 0;
    padding-right: 0;
    .good-item {
      display: flex;
      // background-color: rgb(194, 186, 186);
      img {
        width: 84px;
        height: 84px;
        border-radius: 6px;
        margin-right: 10px;
        flex-shrink: 0;
      }
      .item-right {
        flex: 1;
        font-weight: 400;
        font-size: 13px;
        line-height: 18px;
        color: #000000;
        opacity: 0.9;
        flex-grow: 1;
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 15px;
        .title {
          font-weight: 550;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .type {
          background: #f7f8fb;
          border-radius: 4px;
          font-size: 11px;
          line-height: 15px;
          color: #000000;
          opacity: 0.5;
          margin: 4px 0;
        }
      }
      .item-bottom {
        height: 60px;
        text-align: right;
        // align-self:flex-start;
        // margin-left: 5px;
        width: 20%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // align-items: center;
        .money {
          color: #ff9519;
          line-height: 17px;
          font-size: 12px;
        }
        .amount {
          font-size: 17px;
          color: #ff9519;
          line-height: 24px;
        }
      }
    }
  }
}
</style>