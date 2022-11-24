<template>
  <div>
    <div class="coupons-box" v-for="(item, index) in list" :key="index">
      <!-- <button @click="fnccc(item)">111111111</button> -->
      <div v-if="item.name !== '高管甄选'">
        <Cell>
          <template #title>
            <!-- <span class="cell-title">{{item.type==3?'实名领取油券 ':item.name}}</span> -->
            <span class="cell-title" v-if="item.type == 3">实名领取油券</span>
            <span class="cell-title" v-else-if="item.type == 4">e代驾抵扣券</span>
            <span class="cell-title" v-else-if="item.oilCouponType == 2">广东中石油加油券</span>
            <span class="cell-title" v-else-if="item.oilCouponType == 0">广东中石化加油券</span>
            <span class="cell-title" v-else-if="item.oilCouponType == 1">河南中石化加油券</span>
            <span class="cell-title" v-else>{{ item.name }}</span>
          </template>
          <template #default>
            <!-- <span class="cell-value">{{item.type==3?'已领取':usedList2[item.isUsed]}}</span> -->
            <span class="cell-value" v-if="item.type == 3">已领取</span>
            <span class="cell-value" v-else-if="item.type == 4">{{
              usedList3[item.isUsed]
            }}</span>
            <!-- <span class="cell-value" v-else-if=" item.isUsed==1 && item.oilCouponType==0 || item.oilCouponType==1 ">未使用</span> -->
            <span class="cell-value" v-else-if="item.payStatus == 0 && item.supplierType!=3">未付款</span>
            <span class="cell-value" v-else-if='item.supplierType==3'>{{supplierList[item.payStatus]}}</span>
            <!-- 未使用 -->
            <!-- <span class="cell-value" v-else-if="item.isUsed==1">{{item.isUsed}}未使用</span> -->
            <span class="cell-value" v-else>{{ usedList2[item.isUsed] }}</span>
          </template>
        </Cell>
        <div class="coupons-box2">
          <img class="coupons-img" v-if="item['icon'] && item.oilCouponType == null" :src="item['icon']" alt="" />
          <img class="coupons-img" v-else-if="item.type == 4" src="@/assets/img/edaijia.png" alt="" />
          <img class="coupons-img" v-else-if="item.oilCouponType == 2" src="@/assets/img/shiYoulogo.png" alt="" />
          <img class="coupons-img" v-else-if="item.oilCouponType == 0 || item.oilCouponType == 1" src="@/assets/img/w18.png" alt="" />
          <img class="coupons-img" v-else src="@/assets/img/w18.png" alt="" />
          <!-- <div :style="`background-image: url(${item['icon'] || '../../assets/img/w18.png'});`"></div> -->
          <div class="right-info">
            <div class="r-top">
              <!-- <span class="title" v-if="item.type!=1 && item.type!=0">充值账号:{{item.rechargeAccount}}</span> -->
              <span class="title" v-if="item.type == 1 || item.type == 0">{{
                item.vouchersExplain
              }}</span>
              <span class="title" v-else-if="item.type == 4">{{ item.price }}元代驾抵扣券</span>
              <span class="title title-name" v-else-if="
                  item.oilCouponType == 2 ||
                    item.oilCouponType == 0 ||
                    item.oilCouponType == 1
                ">{{ item.name }}</span>
              <span class="title goods" v-else-if="item.name === '高管甄选'">{{
                item.goodsName || item.rechargeAccount
              }}</span>
              <span class="title" v-else>充值账号:{{ item.rechargeAccount }}</span>
              <span>{{
                item.type == 3 || item.type == 4 ? '' : '消费金额'
              }}</span>
            </div>
            <div class="r-bottom">
              <span v-if="item.expireDate">有效期：{{ item.expireDate }}</span>
              <span v-else-if="
                  item.oilCouponType == 2 ||
                    item.oilCouponType == 0 ||
                    item.oilCouponType == 1
                "></span>
              <span v-else-if="item.name === '高管甄选'" style="color:#666;font-size: 13px;flex-wrap: 400;">数量：{{ item.num || 1 }}件</span>
              <span v-else>{{ item.type == 3 ? '到账面额' : '原价' }}：{{
                  item.price
                }}</span>
              <span>{{ item.payAmount ? '￥' + item.payAmount : ''
                }}{{ item.payIntegral ? '权益' + item.payIntegral : '' }}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div v-if="item.name !== '高管甄选'" class="bottom-item">
            {{ item.type == 3 || item.type == 4 ? '领取时间: ' : '购买时间：'
            }}{{ item.purchaseTime }}
          </div>
          <div v-if="item.name === '高管甄选'" class="bottom-button">
            <Button>查看物流</Button>
            <Button>确认收货</Button>
          </div>
          <div class="supplier-box" v-if="item.supplierType==3 && item.payStatus !=0"><Button @click="$router.push(`/seniorExecutiveEelect/telephoneDetail?id=${item.id}`)">查看充值</Button></div>
          <div v-if="item.type == 1 && item.isUsed == 0" @click="usedClick(item)" class="bottom-text">
            去使用
          </div>
          <div v-if="item.type == 4 && item.isUsed == 0" @click="edaijiaClick(item)" class="bottom-text">
            去使用
          </div>
          <!-- 广东石油加油券暂时停止跳转 -->
          <!-- <div v-if="item.oilCouponType==2 && item.payStatus==1" @click="usedCilck2(item)">去使用</div> -->
          <div v-if="item.oilCouponType == 2 && item.payStatus == 1" class="bottom-text">
            去使用
          </div>
          <div v-if="
              (item.oilCouponType == 0 || item.oilCouponType == 1) &&
                item.payStatus == 1
            " @click="usedCilck3(item)" class="bottom-text">
            去使用
          </div>
          <div v-if="item.type == 1 && item.isUsed != 0" class="bottom-text">
            {{ usedList[item.isUsed] }}
          </div>
          <div v-if="item.type == 0" @click="usedClick(item)" class="bottom-text">
            {{ usedList[item.isUsed] }}
          </div>
          <!-- <div v-if="item.type!=1 && item.type!=0" @click="gotoPage(item.path)">再来一单</div> -->
        </div>
      </div>
      <div v-else>
        <!--  -->
        <div class="good-detail">
          <div class="top">
            <img src="@/assets/img/shops.png" alt="" />
            <div class="jhb">高管甄选</div>
            <span class="top-text">{{
              goodsStatus[item.payStatus] || goodsStatus[0]
            }}</span>
          </div>
          <Cell class="good-cell" :border="false" v-for="items in item['goodsList']" :key="items.id" @click="toOrderDetail(item)">
            <!-- <Cell class="good-cell" :border="false" > -->
            <div class="good-item">
              <img :src="items['imgUrl']" alt="" />
              <div class="item-right">
                <div class="title">
                  {{ items.goodsName || item.rechargeAccount }}
                </div>
                <div class="type">数量：{{ items.num || 1 }}件</div>
              </div>
              <div class="item-bottom">
                <div>金额</div>
                <div>
                  <span class="money">￥</span><span class="amount">{{ items.price || 0.0 }}</span>
                </div>
              </div>
            </div>
          </Cell>
          <div v-if="item.name === '高管甄选'" class="bottom-button">
            <Button @click="goLogisticsDetail(item)">查看物流</Button>
            <Button v-if="item.payStatus!==2" @click="updateOrder(item)">确认收货</Button>
          </div>
        </div>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, Toast } from 'vant'
import { useDriveVoucher, updateOrder } from '@/api/user'
export default {
  name: 'CouponsList',
  props: ['list'],
  components: { Cell },
  data() {
    return {
      supplierList: ['未付款', '充值中', '充值失败', '已退款', '退款中', '部分退款'],
      usedList: ['去加油', '已使用', '已过期', '已赠送'],
      usedList2: ['未使用', '已使用', '已过期', '已赠送'],
      usedList3: ['未使用', '已使用', '已撤回', '已过期'],
      goodsStatus: ['买家未付款', '买家已付款', '部分发货', '卖家已发货', '交易成功', '交易关闭']
    }
  },
  created() { },
  methods: {
    //话费
    supplierClick(e) {
      this.$router.push(`/seniorExecutiveEelect/telephoneDetail?id=${e.id}`)
    },
    async updateOrder(item) {
      const res = await updateOrder({ orderId: item.id })
      if (res.code == 200) {
        Toast('祝您生活愉快')
        this.$emit('getdata')
      }
    },
    toOrderDetail(item) {
      this.$router.push({ path: '/seniorExecutiveEelect/orderDetail', query: { id: item.id, num: item.rechargeAccount, phone: item.phone } })
    },
    NumberMul(arg1, arg2) {
      let m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) { }
      try {
        m += s2.split('.')[1].length
      } catch (e) { }
      return (
        (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
        Math.pow(10, m)
      )
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
      useDriveVoucher(params)
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              window.location.href = res.data
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    gotoPage(url) {
      if (url == '#') {
        Toast('该产品已下架')
        return
      }
      this.$router.push(url)
    },
    goLogisticsDetail(e) {
      this.$store.commit('SETlogisticsDetails', e.goodsList)
      this.$router.push(
        {
          path: `/seniorExecutiveEelect/logisticsDetail?num=${e.rechargeAccount}&phone=${e.phone}`,
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
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
    // &-button{
    //   width: 100%;
    //   text-align: right;
    //   button{
    //     width: 76px;
    //     height: 29px;
    //     border-radius: 40px;
    //     border: 0.5px solid rgba(0, 0, 0, 0.2);
    //     font-size: 12px;
    //     opacity: 0.8;
    //     background-color: #fff;
    //   }
    //   button:nth-child(2){
    //     margin-left: 12px;
    //     border: 0.5px solid #FB584D;
    //     color: #FB584D;
    //   }
    // }
    .supplier-box {
      button {
        border: 1px solid #0e6cd8;
        background-color: #fff;
        color: #0e6cd8;
        border-radius: 25%;
        font-size: 12px;
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
      color: #fb584d;
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
  .bottom-button {
    width: 100%;
    text-align: right;
    button {
      width: 76px;
      height: 30px;
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
</style>
