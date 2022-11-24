<template>
  <div class="box">
    <Swipe :autoplay="3000" indicator-color="white" class="swipe" indicatorColor="#F46356" @change="onChange">
      <SwipeItem v-for="(item,index) in  goodsData.imageUrl" :key="index"><img v-lazy="item" style="width:100%;height:300px" /></SwipeItem>
      <!-- <SwipeItem><img style="width:100%;height:200px" src="@/assets/img/w18.png" alt=""></SwipeItem> -->
      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }}/{{goodsData.imageUrl && goodsData.imageUrl.length}}</div>
      </template>
    </Swipe>
    <div class="good-top">
      <div class="good-left">
        <div><span class="money">￥</span><span class="amount">{{goodsData.price}}</span></div>
        <div class="good-title">{{goodsData.shortDescription}}</div>
      </div>
      <div class="good-right">
        <img src="@/assets/img/share1.png" alt="">
        <div class="share">分享</div>
      </div>
    </div>
    <div class="good-attribute">
      <Cell is-link @click="selectSpecifications" class="good-attribute-cell">
        <template #title>
          <span class="custom-title">选择</span>
          <span class="attribute">产品规格<span style="opacity:0.7"> {{goodsData.goodsSize}}{{goodsData.goodsUnit}}</span></span>
        </template>
      </Cell>
      <Cell is-link>
        <template #title>
          <div class="custom-title consigner">发货</div>
          <div class="attribute1">
            <div><span>快递:免运费</span></div>
            <div><span>现货，付款后48小时内发货</span></div>
          </div>
        </template>
      </Cell>
      <Cell class="good-attribute-celltwo">
        <template #title>
          <span class="custom-title">保障</span>
          <span class="attribute">假一赔四·极速退款</span>
        </template>
      </Cell>
    </div>
    <div class="good-detail">
      <div class="before"></div>
      <div>商品详情</div>
      <div class="after"></div>
    </div>
    <div v-html="goodsData.description"></div>
    <ActionSheet v-model="showAttribute" title=' '>
      <!-- <div class="content"> -->
      <div class="specifications">
        <div class="top">
          <img style="border-radius: 8px;" :src="goodsData.imageUrl && goodsData.imageUrl[0]" alt="">
          <div class="right">
            <div><span class="money">￥</span><span class="amount">{{goodsData.price}}</span></div>
            <div class="title"><span>剩余{{goodsData.stock}}件</span></div>
            <div class="title"><span>请选择产品规格</span></div>
          </div>
        </div>

        <div class="middle">
          <div class="type-title">产品规格</div>
          <div class="type-container">
            <div class="type-item active">{{goodsData.goodsSize}}{{goodsData.goodsUnit}}</div>
            <!-- <div class="type-item">2500ml/瓶</div> -->
          </div>
        </div>

        <Cell class="cell-num">
          <template #title>
            <span class="custom-title">购买数量</span>
          </template>
          <Stepper v-model="value" theme="round" button-size="22" disable-input></Stepper>
        </Cell>
        <GoodsAction>
          <GoodsActionButton type="warning" @click="addShoppingCart" text="加入购物车" />
          <GoodsActionButton type="danger" @click="toBuy" text="立即购买" />
        </GoodsAction>
      </div>
      <!-- </div> -->
    </ActionSheet>
    <GoodsAction style="padding-right:15px;">
      <GoodsActionIcon @click="toGoodCar" icon="cart-o" text="购物车" :badge="total" />
      <GoodsActionButton type="warning" @click="addShoppingCart" text="加入购物车" style="margin-left:30px;" />
      <GoodsActionButton type="danger" @click="toBuy" text="立即购买" />
    </GoodsAction>
    <ShareSheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import wx from 'weixin-js-sdk'
import { Swipe, SwipeItem, Lazyload, ActionSheet, Stepper, ShareSheet, Cell, GoodsAction, GoodsActionIcon, GoodsActionButton, RadioGroup, Radio, Dialog, Toast, Button, CellGroup, Popup } from 'vant';
import { storageGet, NumberSub } from '@/utils/utils'
import { countVouchersInterests, vouchersPackageRecharge, getPackageByPackageNumber, getJsJDK, getGoosDetail, addShoppingCart, getShoppingCartPage, getShoppingAddressPage } from '@/api/user'
export default {
  name: 'rechargeSetMeal',
  components: { Swipe, SwipeItem, Lazyload, ActionSheet, Stepper, ShareSheet, GoodsAction, GoodsActionIcon, GoodsActionButton, RadioGroup, Radio, Cell, Button, CellGroup, Popup },
  data() {
    return {
      item: {},
      radio: 0,
      userInfo: {},
      integral: 0,
      code: '',
      city: '',
      vouchersId: '',
      disableBtn: false,
      isLogin: false,
      current: 0,
      showAttribute: false,
      value: 1,
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
      ],
      goodsId: '',
      goodsData: {},
      total: 0,
      addressTotal: 0,//收货地址列表长度
    }
  },
  created() {
    this.code = this.$route.query.code
    this.userInfo = storageGet('userInfo')
    console.log(this.userInfo);

    if (this.$route.query.id) {
      this.goodsId = this.$route.query.id
      this.getGoosDetail()
      this.getShoppingCartPage()
      this.getShoppingAddressPage()
    }
    // this.getInfo()
    getJsJDK()
    console.log(NumberSub(20, 19.99), '结果', this.item)
  },
  computed: {
    money() {
      return NumberSub((this.radio == 1 ? this.item.integralPrice : this.item.amountPrice), this.integral)
    },
  },
  methods: {
    getShoppingCartPage() {
      let param = {
        pageNum: 1,
        pageSize: 10,
        orderType: 0,
        search: '',
        userId: this.userInfo.id
      }
      getShoppingCartPage(param).then(res => {
        console.log(res);
        this.total = res.data.total
      })
    },
    addShoppingCart() {
      let param = {
        goodsNum: this.value,
        goodsVersion: 1,
        goodsId: this.goodsData.id,
        userId: this.userInfo.id
      }
      addShoppingCart(param).then(res => {
        if (res.code != 200) return
        this.showAttribute = false
        Toast('加入购物车成功')
        this.getShoppingCartPage()
      })
    },
    getShoppingAddressPage() {
      let param = {
        pageNum: 1,
        pageSize: 100,
        userId: this.userInfo.id
      }
      getShoppingAddressPage(param).then(res => {
        console.log(res);
        this.addressTotal = res.data.total

      })
    },
    toBuy() {
      if (this.addressTotal > 0) {
        this.$router.push({ path: '/seniorExecutiveEelect/sureOrder', query: { id: this.goodsId } })
      } else {
        Dialog.confirm({
          title: '温馨提示',
          message: '您还未添加收货地址，添加地址后\n才可下单购买哦~',
          confirmButtonText: '去添加',
          confirmButtonColor: '#F14F44',
        }).then(() => {
          this.$router.replace('/seniorExecutiveEelect/addAdress')
        }).catch(() => {
        })
      }
    },
    share() {
      this.showShare = true
    },
    toGoodCar() {
      this.$router.push({ path: '/seniorExecutiveEelect/goodCar' })
    },
    onSelect(option) {
      // Toast(option.name);
      this.showShare = false;
    },
    selectSpecifications() {
      this.showAttribute = true
    },
    onChange(index) {
      this.current = index;
    },
    getInfo() {
      getPackageByPackageNumber({ packageNumber: this.code }).then(res => {//查套餐优惠券详情
        this.item = res.data || {}
        countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
          if (res.code == 200) {
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
            if (Number(this.integral) >= Number(this.item.integralPrice)) {
              this.radio = '1'
            }
          }
        })
      })
    },
    getGoosDetail() {
      getGoosDetail({ goodsId: this.goodsId }).then(res => {
        console.log(res);
        this.goodsData = res.data
      })
    },
    noLogin() {
      this.isLogin = false
    },
    login() {
      this.isLogin = false
      this.$router.push({ path: '/login/index' })
    },
    submit() {
      if (!this.radio) {
        Toast('请选择支付方式')
        return
      }
      if (!this.userInfo.bindPhone) {
        Toast('请先登录')
        this.$router.push({ path: '/login/index' })
      }
      if (!this.userInfo.bindPhone) {
        this.isLogin = true
        return
      }
      let dom = ''
      if (this.radio == 1) {
        dom = `确认使用${this.item.integralPrice}权益兑换该优惠券套餐吗？`
      } else if (this.radio == 2) {
        dom = `确认使用${this.item.amountPrice}元购买该优惠券套餐吗？`
      } else if (this.radio == 3) {
        dom = `确认使用${this.integral}权益及${this.money}元购买该优惠券套餐吗？`
      }
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let success = async res => {
            await done()
            this.disableBtn = false
            if (res.code != 200) {
              Toast(res.msg || '兑换失败')
              return
            }
            if (this.radio != 1) {
              let pay = res.data || {}
              wx.chooseWXPay({  //此方法应放在调用后台统一下单接口成功后回调里面，接口返回  timeStamp，nonceStr，package，paySign等参数
                appId: pay.appId,  //此参数可不用
                timestamp: pay.timeStamp,
                nonceStr: pay.nonceStr,
                package: pay.packageValue,
                signType: pay.signType,
                paySign: pay.paySign,
                success: r => {
                  // 支付成功后的回调函数  
                  if (r.errMsg == "chooseWXPay:ok") {
                    //支付成功  
                    Toast('支付成功', 1200);
                    this.$router.replace('/user/my-coupons/index')
                  }

                },
                cancel: r => {
                  //支付取消
                  // this.$router.replace('/user/my-coupons/index')
                  if (r.errMsg == 'chooseWXPay:cancel') {
                    Toast('取消支付', 1200);
                  } else {
                    Toast('支付关闭', 1200);
                  }
                }
              });
            } else {
              Toast('兑换成功')
              this.$router.replace('/user/my-coupons/index')
            }
          }
          let data = {
            amount: this.radio == 1 ? 0 : this.radio == 2 ? this.item.amountPrice : this.radio == 3 ? this.money : 0,
            integral: this.radio == 1 ? this.item.integralPrice : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,
            payMode: this.radio - 1,
            phone: this.userInfo.bindPhone,
            usedArea: storageGet('CityCode'),
            pid: this.item.pid,
          }
          vouchersPackageRecharge(data).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '兑换确认',
        message: dom,
        confirmButtonColor: '#F14F44',
        beforeClose
      })
    },

  }
}
</script>

<style scoped lang="scss">
.box {
  padding: 0px 0 60px;
  font-size: 16px;
  height: 100vh;
  font-family: "PingFang SC";
  font-style: normal;
  background: #f6f7f9;
  .swipe {
    position: relative;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 15px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2px 8px;
    width: 39px;
    height: 22px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 40px;
    color: #ffffff;
    font-size: 13px;
  }
  .good-top {
    margin: 10px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    padding: 12px;
    .good-left {
      width: 80%;
      .good-title {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: #000000;
        opacity: 0.9;
        margin-top: 6px;
      }
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
    }
    .good-right {
      text-align: center;
      img {
        width: 20px;
        height: 20px;
      }
      .share {
        font-style: normal;
        font-weight: 400;
        font-size: 11px;
        line-height: 15px;
        color: #000000;
        opacity: 0.7;
      }
    }
  }
  .good-attribute {
    padding: 0 12px;
    border-radius: 8px;
    &-cell {
      // background-color: red;
      border-radius: 8px 8px 0 0;
    }
    &-celltwo {
      border-radius: 0 0 8px 8px;
    }
    .custom-title {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #000000;
      opacity: 0.6;
      margin-right: 14px;
    }

    .attribute {
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: #000000;
      opacity: 0.9;
    }
    .attribute1 {
      display: inline-block;
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: #000000;
      opacity: 0.9;
    }
  }
  .good-detail {
    text-align: center;
    margin: 20px 0;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    opacity: 0.9;
    display: flex;
    justify-content: center;
    align-items: center;
    .before {
      width: 50px;
      height: 0.5px;
      background: #ccc;
      margin-right: 20px;
    }
    .after {
      width: 50px;
      height: 0.5px;
      background: #ccc;
      margin-left: 20px;
    }
  }
  .specifications {
    margin: 12px;
    .top {
      display: flex;
      align-items: center;
    }
    img {
      width: 84px;
      height: 84px;
    }
    .right {
      margin-left: 12px;
      font-weight: 400;
      font-size: 12px;
      line-height: 17px;
      color: #000000;
      div:nth-child(1) {
        margin-bottom: 6px;
      }
      div:nth-child(2) {
        margin-bottom: 4px;
      }
      .title {
        opacity: 0.5;
      }
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
    }
    .middle {
      margin: 20px 0;
      .type-title {
        font-size: 14px;
        line-height: 20px;
        color: #000000;
        opacity: 0.9;
        margin: 10px 0;
      }
      .type-container {
        display: flex;
        flex-wrap: wrap;
        .type-item {
          // width: 30%;
          width: 78px;
          height: 28px;
          text-align: center;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.08);
          color: #000000;
          opacity: 0.5;
          border-radius: 4px;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          margin-right: 20px;
          &.active {
            color: #fb584d;
            background: #fff9f9;
            border: 1px solid #fb584d;
          }
        }
      }
    }
    .cell-num {
      margin-bottom: 52px;
    }
  }
}
.consigner {
  display: inline-block;
  height: 100%;
  transform: translateY(-40%);
}
.van-goods-action-button--warning {
  background: #ffa439;
}
.van-goods-action-button--last {
  background: #fb584d;
}
.van-cell::after {
  border-bottom: none;
}
</style>