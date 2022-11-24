<template>
  <div class="box">
    <div class="adress1">
      <div class="pay-status">{{goodsStatus[goodsData.state]}}</div>
      <!-- <div class="pay-status">卖家已发货</div> -->
      <Cell class="adress">
        <template #title>
          <div class="adress-container">
            <div>收货地址：</div>
            <div>
              <div><span class="name">{{goodsData.name}}</span><span class="phone">{{goodsData.phone}}</span></div>
              <div class="area">{{goodsData.shippingName}}</div>
            </div>
          </div>
        </template>
      </Cell>
    </div>
    <!-- <div class="logistics" v-if="goodsData.state==1 || goodsData.state ==2"> -->
    <div class="logistics" v-if="goodsData.state!=0">
      <Cell is-link class="adress" @click="goLogisticsDetail(goodList)">
        <template #icon>
          <img src="@/assets/img/logistics.png" alt="">
        </template>
        <template #default>
          <div style="text-align:right">
            查看物流
          </div>
        </template>
      </Cell>
    </div>
    <div>
      <div class="good-detail">
        <div class="top">
          <img src="@/assets/img/shops.png" alt="">
          <div class="jhb">九华保<span style="margin-left:5px">></span></div>
        </div>
        <Cell class="good-cell" :border="false" v-for="item in goodList" :key="item.id">
          <div class="good-item" @click="toDetail(item)">
            <img :src="item.imgUrl" alt="">
            <div class="item-right">
              <div class="title">{{item.goodsName}}</div>
              <div class="type">规格：{{item.goodsSize}}{{item.goodsUnit}}</div>
              <div class="type">数量：{{item.num}}</div>
            </div>
            <div class="item-bottom">
              <div><span class="money">￥</span><span class="amount">{{item.price}}</span></div>
            </div>
          </div>
          <div class="goodcar">
            <div class="goodcar-item" @click="addCar(item)">加入购物车</div>
            <!-- <div class="goodcar-item goodcar-item1" @click="ReturnGoods">退换</div> -->
          </div>
        </Cell>
        <!-- <div class="goodcar">
          <div class="goodcar-item" @click="addCar">加入购物车</div>
          <div class="goodcar-item goodcar-item1" @click="ReturnGoods">退换</div>
        </div> -->
        <Cell title="商品总额" :border="false" class="goods-amount">
          <template #default>
            <div><span class="money">￥</span><span class="amount">{{goodsData.orderAmount}}</span></div>
          </template>
        </Cell>
        <Cell title="运费(快递)">
          <template #default>
            <div><span class="money">￥</span><span class="amount">0</span></div>
          </template>
        </Cell>
        <Cell class="pay-money">
          <template #title>
            <span class="payment">实付款</span>
          </template>
          <template #default>
            <div><span class="money">￥</span><span class="amount">{{goodsData.payAmount}}</span></div>
          </template>
        </Cell>
      </div>
    </div>
    <div class="order-detail">
      <Cell :border="false" class="order-no">
        <template #title>
          <span class="title">订单编号：</span>
        </template>
        <template #default>
          <div class="content">
            <span id="copycode" class="copycode">{{goodsData.orderNo}}</span> <span class="copy" @click="handleCopy">复制</span>
          </div>
        </template>
      </Cell>
      <Cell :border="false" title="创建时间：">
        <template #default>
          <span>{{goodsData.createTime}}</span>
        </template>
      </Cell>
      <Cell :border="false" title="付款时间：">
        <template #default>
          <span>{{goodsData.payTime}}</span>
        </template>
      </Cell>
      <Cell :border="false" title="付款方式：">
        <template #default>
          <span>微信支付</span>
        </template>
      </Cell>
    </div>
  </div>
</template>

<script>
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
import { getShoppingOrderDetaliByMobile, addShoppingCart } from '@/api/user'
import { Toast, Cell } from 'vant'
import { Debounce, storageSet, storageGet, NumberSub } from '@/utils/utils'
export default {
  name: 'orderDetail',
  components: { Cell, Toast },
  data() {
    return {
      defalutAdress: {},//收货地址
      goodsData: {},
      selectList: [
        {
          id: 1,
          shortDescription: '213122121123jaingsu2打打算 按时 按时31打击ad的啊打 啊3asdnasj',
          goodsSize: '100kg',
          goodsUnit: '瓶',
          price: '100.23',
          goodsNum: 2
        },
        {
          id: 2,
          shortDescription: '412fefw12321',
          goodsSize: '200ml',
          goodsUnit: '盒',
          price: 22,
          goodsNum: 1
        },
      ],//购物车商品列表
      orderId: '',
      userInfo: {},
      goodList: [],
      goodsStatus: ['买家已付款', '卖家已发货', '交易成功'],
      num: '',
      phone: ''
    }
  },
  created() {
    this.userInfo = storageGet('userInfo')
    console.log(this.userInfo);
    if (this.$route.query.id) {
      this.orderId = this.$route.query.id
    }
    if (this.$route.query.num) {
      this.num = this.$route.query.num
    }
    if (this.$route.query.phone) {
      this.phone = this.$route.query.phone
    }
    this.getShoppingOrderDetaliByMobile()
    getJsJDK()
  },
  methods: {
    goLogisticsDetail(e) {
      // console.log(e);
      this.$store.commit('SETlogisticsDetails', e)
      this.$router.push(
        {
          path: `/seniorExecutiveEelect/logisticsDetail?num=${this.num}&phone=${this.phone}`,
        }
      )
    },
    toDetail(item) {
      this.$router.push({ path: '/seniorExecutiveEelect/detail', query: { id: item.goodsId } })
    },
    handleCopy() {
      const range = document.createRange();// 创建range对象
      range.selectNode(document.getElementById('copycode')); //获取复制内容的 id 选择器
      const selection = window.getSelection();  //创建 selection对象
      if (selection.rangeCount > 0) selection.removeAllRanges(); //如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
      selection.addRange(range); //将range对象添加到selection选区当中，会高亮文本块
      document.execCommand('copy'); //复制选中的文字到剪贴板
      this.$toast('复制成功')
      selection.removeRange(range); // 移除选中的元素
    },
    addCar(item) {
      console.log('加入购物车')
      let param = {
        goodsNum: item.num,
        goodsVersion: 1,
        goodsId: item.goodsId,
        userId: this.userInfo.id
      }
      addShoppingCart(param).then(res => {
        if (res.code != 200) return
        Toast('加入购物车成功')
      })
    },
    ReturnGoods() {
      this.$router.push({ path: '/seniorExecutiveEelect/returnGoods' })
    },
    getShoppingOrderDetaliByMobile() {
      getShoppingOrderDetaliByMobile({ orderId: this.orderId }).then(res => {
        if (res.code !== 200) return
        this.goodsData = res.data
        this.goodList = res.data.list
        console.log(res.data);
      })
    },
    // toLogistics() {
    //   this.$router.push({ path: '/seniorExecutiveEelect/logisticsDetail' })
    // },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .van-checkbox__label {
  flex-grow: 1;
}
.box {
  padding: 10px 15px;
  background: #f6f7f9;
  height: 100vh;
  .adress1 {
    background: #fff;
    margin: 0 0 10px;
    padding: 10px;
    border-radius: 6px;
    align-items: center;
    .pay-status {
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      color: #fb584d;
      // padding-left: 15px;
    }
  }

  .adress {
    .adress-container {
      display: flex;
      // align-items: center;
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }
    .area {
      font-size: 13px;
      line-height: 18px;
      color: #000000;
      opacity: 0.9;
    }
    .adress-detail {
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      opacity: 0.9;
    }
    .name {
      font-size: 13px;
      line-height: 20px;
      text-align: center;
      color: #000000;
      opacity: 0.9;
      margin-right: 5px;
    }
    .phone {
      line-height: 20px;
      text-align: center;
      color: #000000;
      opacity: 0.7;
    }
  }
  .logistics {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 15px;
  }
  .good-detail {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 15px;
    margin-top: 10px;
    .top {
      display: flex;
      align-items: center;
      margin-left: 10px;
      padding-top: 10px;
      img {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
      .jhb {
        font-size: 14px;
        line-height: 20px;
        color: #000000;
        opacity: 0.9;
      }
    }
    .good-cell {
      background: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding-left: 0;
      padding-right: 0;
      .good-item {
        display: flex;
        img {
          width: 84px;
          height: 84px;
          border-radius: 6px;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .item-right {
          font-weight: 400;
          font-size: 13px;
          line-height: 18px;
          color: #000000;
          opacity: 0.9;
          flex-grow: 1;
          width: 50%;
          // display: flex;
          // flex-direction: column;
          // justify-content: space-between;
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
          align-self: flex-start;
          margin-left: 5px;
          width: 20%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .money {
            // color: #f14f44;
            line-height: 17px;
            font-size: 12px;
          }
          .amount {
            font-size: 17px;
            // color: #f14f44;
            line-height: 24px;
          }
        }
      }
    }
  }
}
.goods-amount {
  padding-bottom: 0;
}
.pay-money {
  .money {
    color: #f14f44;
    line-height: 17px;
    font-size: 12px;
  }
  .amount {
    font-size: 17px;
    color: #f14f44;
    line-height: 24px;
  }
  .payment {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    opacity: 0.9;
  }
}
.order-detail {
  background: #ffffff;
  border-radius: 8px;
  padding: 0 15px;
  margin-top: 10px;
  .copy {
    color: #000000;
    opacity: 0.9;
    // margin-left: 5px;
  }
}
.van-cell {
  padding-left: 0;
  padding-right: 0;
}
.goodcar {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  .goodcar-item {
    padding: 6px 8px;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    border-radius: 40px;
    font-size: 13px;
    // line-height: 18px;
    color: #000000;
    opacity: 0.7;
  }
  .goodcar-item1 {
    padding: 6px 28px;
    margin-left: 20px;
  }
}
::v-deep .van-cell__title {
  flex: auto !important;
}
::v-deep .van-cell__value {
  flex: auto !important;
}
</style>