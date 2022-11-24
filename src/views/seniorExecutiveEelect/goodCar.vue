<template>
  <div class="box">
    <div class="box-top">
      <div class="home" @click="toHome">九华保</div>
      <div class="home2" v-if="isPay" @click="toEdit">编辑</div>
      <div class="home2" v-else @click="toEdit">取消</div>
    </div>
    <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <Cell v-for="(item,index) in list" :key="item.id" class="good-cell">
        <CheckboxGroup v-model="result">
          <Checkbox :name="item.id" checked-color="#ee0a24" label-disabled>
            <div class="good-item">
              <img :src="item.imageDeatilUrl" alt="">
              <div class="item-right">
                <div class="title">{{item.shortDescription}}</div>
                <div class="type">{{item.goodsSize}}{{item.goodsUnit}}</div>
                <div class="item-bottom">
                  <div><span class="money">￥</span><span class="amount">{{item.price}}</span></div>
                  <Stepper v-model="item.goodsNum" theme="round" @change="changeNum(item)" button-size="22" disable-input></Stepper>
                </div>
              </div>
            </div>
          </Checkbox>
        </CheckboxGroup>
      </Cell>
    </List>
    <div class="good-detail">
      <div class="before"></div>
      <div>热门商品</div>
      <div class="after"></div>
    </div>
    <GoodList></GoodList>
    <SubmitBar :price="allPrice" :disabled="result.length==0" button-text="提交订单" @submit="onSubmit" v-if="isPay">
      <Checkbox v-model="checked" checked-color="#ee0a24">全选</Checkbox>
    </SubmitBar>
    <SubmitBar button-text="删除" :disabled="result.length==0" @submit="onSubmitDelete" v-if="!isPay" class="delete">
      <template #default>
        <Checkbox v-model="checkedDelete" checked-color="#ee0a24">全选</Checkbox>
      </template>
    </SubmitBar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import wx from 'weixin-js-sdk'
import { List, Cell, Stepper, CheckboxGroup, Checkbox, SubmitBar, Toast, CellGroup, Popup } from 'vant';
import CarSelect from '@/components/CarSelect.vue'
import GoodList from './GoodList'
import { storageGet, NumberSub } from '@/utils/utils'
import { service_phone, } from '@/utils/http'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getJsJDK, getShoppingCartPage, delShoppingCart, updateShoppingCartNum } from '@/api/user'
export default {
  name: 'goodCar',
  components: { GoodList, List, CheckboxGroup, Stepper, Checkbox, Cell, CarSelect, SubmitBar, Popup },
  data() {
    return {
      search: '',
      item: {},
      radio: 0,
      userInfo: {},
      integral: 0,
      activeProduct: 0,
      account: '',
      product: {},
      productAttributeList: [],
      mid: '',
      productId: '',
      disableBtn: false,
      icon: '',
      isScroll: false,
      service_phone: service_phone,
      pageYOffset: '',
      isLogin: false,
      loading: false,
      finished: false,
      checkedDelete: false,
      result: [],
      value: '',
      checked: false,
      isPay: true,
      list: [
      ],
      form: {
        pageNum: 1,
        pageSize: 100,
        orderType: 0,
        search: '',
        userId: ''
      },
      selectList: [],
      goodsCartIds: []
    }
  },
  created() {
    this.mid = this.$route.query.id
    this.productId = this.$route.query.productId
    this.userInfo = storageGet('userInfo')
    this.form.userId = this.userInfo.id
    // this.getInfo()
    this.getShoppingCartPage()
    getJsJDK()
    this.icon = storageGet('Icon')
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
    window.addEventListener('touchmove', this.handleTouchmove, true)
    window.addEventListener('touchend', this.handleTouchend, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    money() {
      return NumberSub(this.productAttributeList[this.activeProduct].amountPrice, this.integral)
    },
    allPrice() {
      let price = 0
      this.selectList.forEach(item => {
        price += (item.price * item.goodsNum * 100)
      })
      return price
    }
  },
  watch: {
    result: {
      handler(val, oldVal) {
        this.selectList = []
        if (val && val.length > 0) {
          val.forEach(item => {
            this.list.forEach(item1 => {
              if (item == item1.id) {
                this.selectList.push(item1)
              }
            })
          })
          if (val.length != this.list.length) {
            this.checked = false
          }
        } else {
          this.checked = false
          this.selectList = []
        }
      },
      deep: true
    },
    checked(val) {
      console.log(val);
      if (val) {
        this.list.forEach(item => {
          this.result.push(item.id)
        })
        console.log(this.selectList);
      } else {
        this.result = []
        this.selectList = []
      }
      console.log(this.result);

    },
    checkedDelete(val) {
      console.log(val);
      if (val) {
        this.list.forEach(item => {
          this.result.push(item.id)
        })
      } else {
        this.result = []
      }
    },
    activeProduct(val) {
      if (Number(this.integral) >= Number(this.productAttributeList[this.activeProduct].integralPrice) && this.product.paymentMode.includes('0')) {
        this.radio = '1'
      } else if (this.product.paymentMode.includes('1')) {
        this.radio = '2'
      } else if (this.integral > 0 && Number(this.integral) < Number(this.productAttributeList[this.activeProduct].amountPrice) && this.product.paymentMode.includes('2')) {
        this.radio = '3'
      }
    }
  },
  methods: {
    ...mapMutations(['setgoodList']),
    toDetail(item) {
      console.log(item);
      this.$router.push({ path: '/seniorExecutiveEelect/detail', query: { id: item.goodsId } })
    },
    //删除购物车数量
    changeNum(item) {
      let param = {
        goodsCartId: item.id,
        num: item.goodsNum
      }
      updateShoppingCartNum(param).then(res => {
        if (res.code !== 200) return
      })
    },
    //删除购物车
    onSubmitDelete() {
      this.delShoppingCart()
    },
    //删除购物车接口
    delShoppingCart() {
      let param = {
        goodsCartIds: String(this.result)
      }
      console.log(param);

      delShoppingCart(param).then(res => {
        if (res.code !== 200) return
        this.getShoppingCartPage()
        Toast('删除购物车成功')
      })
    },
    toEdit() {
      this.isPay = !this.isPay
    },
    toHome() {
      this.$router.push({ path: '/index/index' })
    },
    onSubmit() {
      //  setgoodList
      this.setgoodList(this.selectList)
      console.log('555', this.selectList);
      this.$router.push('/seniorExecutiveEelect/sureOrder?goodsCar=1')
    },
    onLoad() {
      this.loading = false
    },
    inputChange() {
      if (!this.userInfo.bindPhone) {
        this.isLogin = true
      }
    },
    noLogin() {
      this.isLogin = false
      this.account = ''
    },
    login() {
      this.isLogin = false
      this.$router.push({ path: '/login/index' })
    },
    toHome() {
      this.$router.push({ path: '/index/index' })
    },
    handleScroll() {
      let pageYOffset = window.pageYOffset
      this.pageYOffset = window.pageYOffset
      // console.log(this.pageYOffset);

      if (pageYOffset > 0) {
        this.isShowTop = true
      } else {
        this.isShowTop = false
      }
    },
    handleTouchmove() {
      this.isScroll = true
      // console.log(this.pageYOffset)
    },
    handleTouchend() {
      this.isScroll = false
      // console.log(this.pageYOffset)
    },
    getShoppingCartPage() {
      getShoppingCartPage(this.form).then(res => {
        this.list = res.data.records
      })
    },
    getInfo() {
      getProductConfigInfo({ id: this.productId }).then(res => {
        this.product = res.data || {}
        this.product.paymentMode = this.product.paymentMode ? this.product.paymentMode.split(',') : []
        this.productAttributeList = this.product.productAttributeConfigVOList || []
        if (!this.productAttributeList.length) {
          Toast('暂无该充值服务')
          this.$router.go(-1)
          return
        }
        countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
          if (res.code == 200) {
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
            //权益够，默认勾选权益支付
            if (Number(this.integral) > Number(this.productAttributeList[this.activeProduct].integralPrice) && this.product.paymentMode.includes('0')) {
              this.radio = '1'
            } else if (this.product.paymentMode.includes('1')) {
              this.radio = '2'
            }
          }
        })
      })
    },
    gotoList() {
      this.$router.push('/oilFilling/list')
    },
    submit() {
      let reg = /^1[0-9]{10}$/g
      if (!this.account) {
        Toast('请输入充值账号')
        return
      }
      if (!reg.test(this.account)) {
        Toast('请输入正确的手机号')
        return
      }
      if (!this.radio) {
        Toast('请选择支付方式')
        return
      }
      let dom = ''
      if (this.radio == 1) {
        dom = `<div>确认使用${this.productAttributeList[this.activeProduct].integralPrice}权益充值吗？</div><div>充值账号：<span style='color:red'>${this.account}</span></div>`
      } else if (this.radio == 2) {
        dom = `<div>确认使用${this.productAttributeList[this.activeProduct].amountPrice}元充值吗？</div><div>充值账号：<span style='color:red'>${this.account}</span></div>`
      } else if (this.radio == 3) {
        dom = `<div>确认使用${this.integral}权益及${this.money}元充值吗？</div><div>充值账号：<span style='color:red'>${this.account}</span></div>`
      }


      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let success = async res => {
            await done()
            this.disableBtn = false
            if (res.code != 200) {
              Toast(res.msg || '充值失败')
              return
            }
            if (this.radio != 1) {
              let pay = res.data || {}
              wx.chooseWXPay({  //此方法应放在调用后台统一下单接口成功后回调里面，接口返回  timeStamp，nonceStr，package，paySign等参数
                appId: pay.appId,  //此参数可不用
                timestamp: pay.timeStamp,
                nonceStr: pay.nonceStr,
                package: pay.packageValue || pay.package,
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
                  // this.$router.replace('/oilFilling/list')
                  if (r.errMsg == 'chooseWXPay:cancel') {
                    Toast('取消支付', 1200);
                  } else {
                    Toast('支付关闭', 1200);
                  }
                }
              });
            } else {
              Toast('充值成功')
              this.$router.replace('/user/my-coupons/index')
            }
          }
          let data = {
            actualPrice: this.radio == 1 ? this.productAttributeList[this.activeProduct].integralPrice : this.productAttributeList[this.activeProduct].amountPrice,//实付价格
            payAmount: this.radio == 1 ? 0 : this.radio == 2 ? this.productAttributeList[this.activeProduct].amountPrice : this.radio == 3 ? this.money : 0,//支付金额
            payIntegral: this.radio == 1 ? this.productAttributeList[this.activeProduct].integralPrice : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,//支付权益
            price: this.productAttributeList[this.activeProduct].originalPrice,//售价
            productAttribute: this.productAttributeList[this.activeProduct].id,//产品id
            rechargeAccount: this.account,//充值账户
            rechargeMode: Number(this.radio) - 1,//充值方式(0.权益充值,1.微信充值,2.组合充值)
            userPhone: this.userInfo.bindPhone,//用户手机号
            mid: this.mid//菜单id
          }
          addProductRecharge(data).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '充值确认',
        message: dom,
        beforeClose
      })
    },

  }
}
</script>

<style scoped lang="scss">
@keyframes ainim {
  0% {
    transform: translateX(0);
  }
  0% {
    transform: translateX(25px);
  }
}
::v-deep .van-checkbox__label {
  flex-grow: 1;
}
.box {
  font-family: "PingFang SC";
  height: 100vh;
  padding: 0 10px;
  overflow-y: auto;
  font-size: 16px;
  background: #f6f7f9;
  .box-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    background: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    .home {
      font-size: 13px;
      line-height: 18px;
      color: #000000;
      opacity: 0.7;
      &::before {
        display: inline-block;
        content: "<";
        margin-right: 5px;
      }
    }
    .home2 {
      font-size: 13px;
      line-height: 18px;
      color: #000000;
      opacity: 0.7;
    }
  }

  .good-cell {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .good-item {
    display: flex;
    // width: 100%;
    img {
      width: 84px;
      height: 84px;
      border-radius: 6px;
      margin-right: 10px;
    }
    .item-right {
      width: 60%;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: #000000;
      opacity: 0.9;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
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
      .item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
      height: 2px;
      background: #ccc;
      margin-right: 20px;
    }
    .after {
      width: 50px;
      height: 2px;
      background: #ccc;
      margin-left: 20px;
    }
  }
  .delete {
    .van-submit-bar__bar {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>