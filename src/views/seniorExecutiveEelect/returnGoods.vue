<template>
  <div class="box">
    <div class="good-detail">
      <div class="top">
        <img src="@/assets/img/shops.png" alt="">
        <div class="jhb">九华保<span style="margin-left:5px">></span></div>
      </div>
      <Cell class="good-cell" :border="false" v-for="item in selectList" :key="item.id">
        <div class="good-item">
          <img :src="item.imageUrl" alt="">
          <div class="item-right">
            <div class="title">{{item.shortDescription}}</div>
            <div class="type">规格：{{item.goodsSize}}{{item.goodsUnit}}</div>
            <div class="type">数量：{{item.goodsNum}}</div>
          </div>
          <div class="item-bottom">
            <div><span class="money">￥</span><span class="amount">{{item.price}}</span></div>
          </div>
        </div>
      </Cell>
      <Cell class="pay-money">
        <template #title>
          <span class="payment">实付款</span>
        </template>
        <template #default>
          <div><span class="money">￥</span><span class="amount">100.00</span></div>
        </template>
      </Cell>
    </div>
    <div class="order-detail">
      <div class="select">选择申请类型</div>
      <RadioGroup v-model="value">
        <CellGroup v-model="radio">
          <Cell :border="false">
            <template #title>
              <div class="cell-item1">
                <Radio name='1' checked-color="#ee0a24">
                  <div class="item-title">
                    <div class="type">仅退款</div>
                    <div class="content">没收到货，或无需退货仅需退款</div>
                  </div>
                </Radio>
              </div>
            </template>
            <!-- 已收到货，需要退货并退款 -->
          </Cell>
          <Cell :border="false">
            <template #title>
              <div class="cell-item1">
                <Radio name='2' checked-color="#ee0a24">
                  <div class="item-title">
                    <div class="type">退货退款</div>
                    <div class="content">已收到货，需要退货并退款</div>
                  </div>
                </Radio>
              </div>
            </template>
            <!-- 已收到货，需要退货并退款 -->
          </Cell>
        </CellGroup>
      </RadioGroup>
    </div>
    <Cell v-if="value" :border="false" :title="value==1?'货物状态':'退款原因'" is-link arrow-direction="down" @click="changeClick">

      <template #default>
        <div>
          {{value==1?'请选择货物状态':'请选择退款原因'}}
        </div>
      </template>
    </Cell>
    <ActionSheet v-model="showGoodStatus" :actions="actions" cancel-text="取消" @select="onSelect" description="货物状态" close-on-click-action>
    </ActionSheet>
    <ActionSheet v-model="showPayRes" :actions="actions2" cancel-text="取消" @select="onSelect2" description="退款原因" close-on-click-action>
    </ActionSheet>
    <!-- <SubmitBar button-text="提交" @submit="onSubmit" /> -->
    <Button class="button">提交</Button>
  </div>
</template>

<script>
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getShoppingAddressPage, getGoosDetail, updateShoppingCartNum, createOrder } from '@/api/user'
import { Stepper, Checkbox, Field, SubmitBar, Dialog, ActionSheet, AddressList, Toast, RadioGroup, Radio, Cell, CellGroup, Popup, CheckboxGroup } from 'vant'
import { Debounce, storageSet, storageGet, NumberSub } from '@/utils/utils'
export default {
  name: 'addAdress',
  components: { Stepper, Checkbox, SubmitBar, Field, ActionSheet, AddressList, RadioGroup, Radio, Cell, CellGroup, Popup, CheckboxGroup },
  data() {
    return {
      integral: 0,
      bindPhone: '',
      actualAmount: '',
      form: {
        actualAmount: '',
        chargingPhone: ''
      },
      city: '',
      checkIndex: null,
      radio: 0,
      disableBtn: false,
      mid: '',
      pathProductId: '',
      product: {},
      productAttributeList: [],
      customList: [],
      productId: '',
      item: {},
      isLogin: false,
      value: '',
      value1: '',
      valuetwo: '',
      valuethree: [],
      AdressShow: false,
      chosenAddressId: '',
      list: [
      ],
      list2: [],
      defalutAdress: {},//默认收货地址
      goodsId: '',
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
      arrlist: [],
      showGoodStatus: false,
      showPayRes: false,
      actions: [
        { name: '已收到货' },
        { name: '未收到货' },
      ],
      actions2: [
        { name: '配送超时' },
        { name: '卖家发错货' },
        { name: '少件/漏发' },
        { name: '包装/商品破损/污渍' },
        { name: '商品信息描述不符' },
        { name: '商品变质/发霉/有异物' },
      ],
    }
  },
  created() {
    if (this.$route.query.goodsCar) {
      if (this.$route.query.goodsCar == 1) {
        this.selectList = this.$store.state.goodList
        console.log(this.selectList);

      }
    }
    if (this.$route.query.id) {
      this.goodsId = this.$route.query.id
      this.getGoosDetail()
    }
    // this.getIntegralNum()
    this.getShoppingAddressPage()
    getJsJDK()
  },
  computed: {
    chargingAmount() {//到账金额
      let money = Math.floor(this.actualAmount / (this.radio == 1 ? (this.product.integralDiscount || 100) : (this.product.amountDiscount || 100)) * 100)
      if (Number(money) > 5000 || Number(money) < 1) {
        if (Number(money) > 5000) {
          Toast('到账金额仅支持1-5000元')
        }
        this.actualAmount = ''
        return 0
      }
      return money
    },
    money() {//组合支付金额
      return NumberSub(this.actualAmount, this.integral)
    },
    allMoney() {
      let money = 0
      if (this.value) {
        money = this.goodsData.price * this.value1 * 100
      }
      return money
    },
    allPrice() {
      let price = 0
      if (this.arrlist.length) {
        this.arrlist.forEach(item => {
          console.log(item);
          price += (item.price * item.goodsNum * 100)
        })
        return price
      } else {
        return 0
      }
    },
    integralShow() {
      if (this.selectList.length) {
        return Number(this.integral) >= (Number(this.allPrice) / 100) ? false : true
      } else {
        return Number(this.integral) >= (Number(this.allMoney) / 100) ? false : true
      }
    },
    moneyWx() {
      if (this.selectList.length) {
        // console.log(Number(this.allPrice)/100);
        return Number(this.allPrice) / 100 - Number(this.integral)
      } else {
        return Number(this.allMoney) / 100 - Number(this.integral)
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        console.log(val);
      }
    },
    actualAmount(val) {
      if (Number(this.integral) >= Number(val) && this.product.paymentMode.includes('0') && this.radio != '2') {
        this.radio = '1'
      } else if (this.product.paymentMode.includes('1')) {
        this.radio = '2'
      } else if (this.integral > 0 && Number(this.integral) < Number(val) && this.product.paymentMode.includes('2')) {
        this.radio = '3'
      }
    },
    radio(val) {
      if (!this.checkIndex && this.checkIndex != 0) return
      let item = this.productAttributeList[this.checkIndex]
    }
  },
  methods: {
    changeClick() {
      console.log(this.value);
      if (this.value == 1) {
        this.showGoodStatus = true
        this.showPayRes = false
      } else if (this.value == 2) {
        this.showPayRes = true
        this.showGoodStatus = false
      }
    },
    onSelect() { },
    onSelect2() { },
    addCar() {
      console.log('加入购物车')
    },
    ReturnGoods() {
      this.$router.push({ path: '' })
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
    // 选中
    changeGoods(e) {
      let arr = this.selectList.filter(item => {
        return e.includes(item.id)
      })
      this.arrlist = arr
    },
    edit(item) {
      console.log(item);
      if (item && item.id) {
        this.$router.push({ path: '/seniorExecutiveEelect/addAdress', query: { id: item.id } })
      }
    },
    //查询商品详情
    getGoosDetail() {
      getGoosDetail({ goodsId: this.goodsId }).then(res => {
        console.log(res);
        this.goodsData = res.data
      })
    },
    getShoppingAddressPage() {
      let param = {
        pageNum: 1,
        pageSize: 100,
        userId: this.userInfo.id
      }
      getShoppingAddressPage(param).then(res => {
        this.list = res.data.records || []
        this.list.forEach(item => {
          if (item.isDefault == 1) {
            this.defalutAdress = item
          }
        })
        this.list2 = this.list.map(item => {
          return {
            id: item.id,
            name: item.name,
            tel: item.mobile,
            address: `${item.province}${item.city}${item.district}${item.address}`,
            isDefault: item.isDefault == 1 ? true : false
          }
        })
        this.list2.forEach(item => {
          if (item.isDefault) {
            this.chosenAddressId = item.id
          }
        })
      })
    },
    onAdd() {
      this.$router.push('/seniorExecutiveEelect/addAdress')
    },
    selectAdress() {
      this.AdressShow = true
    },
    select(val) {
      console.log(val);
      if (val) {
        this.list.forEach(item => {
          if (item.id == val.id) {
            this.defalutAdress = item
            console.log(this.defalutAdress);

          }
        })
      }

    },
    onSubmit() {
      if (!this.radio) {
        Toast('请选择支付方式')
        return
      }
      if (this.allMoney <= 0) {
        Toast('请选择购买商品')
        return
      }
      console.log(this.radio);
      let openId = storageGet('openId')
      let form = {}
      form.list = [this.goodsData]
      form.userId = storageGet('userInfo').id
      form.openId = openId
      form.shippingId = this.defalutAdress.id
      form.orderAmount = this.allMoney / 100
      this.gosubmit(form)
    },
    async onSubmittwo() {
      if (!this.radio) {
        Toast('请选择支付方式')
        return
      }
      if (this.allPrice <= 0) {
        Toast('请选择购买商品')
        return
      }
      console.log(this.radio);
      let openId = storageGet('openId')
      let form = {}
      form.list = this.arrlist
      form.userId = storageGet('userInfo').id
      form.openId = openId
      form.shippingId = this.defalutAdress.id
      form.orderAmount = this.allPrice / 100
      // form.amount=this.radio == 1 ? 0 : this.radio == 2 ? this.allPrice/100 : this.radio == 3 ? this.moneyWx : 0
      // form.integral=this.radio == 1 ? this.allPrice/100 : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0
      // form.payMode=this.radio - 1
      this.gosubmit(form)
    },
    async gosubmit(form) {
      const res = await createOrder(form)
      console.log('res', res);
      if (res.code === 200) {
        wx.chooseWXPay({  //此方法应放在调用后台统一下单接口成功后回调里面，接口返回  timeStamp，nonceStr，package，paySign等参数
          appId: res.data.appId,  //此参数可不用
          timestamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.packageValue,
          signType: res.data.signType,
          paySign: res.data.paySign,
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
        Toast(res.msg, 1200);
      }
    },
    getIntegralNum() {
      let userInfo = storageGet('userInfo')
      this.userInfo = userInfo || {}
      this.form.chargingPhone = userInfo.bindPhone
      getProductConfigInfo({ id: this.pathProductId }).then(res => {
        this.product = res.data || {}
        this.product.paymentMode = this.product.paymentMode ? this.product.paymentMode.split(',') : []
        let list = this.product.productAttributeConfigVOList || []
        this.productAttributeList = list.filter(item => !item.isCustom)
        this.customList = list.filter(item => item.isCustom)

        // this.productAttributeList = this.product.productAttributeConfigVOList || []
        countVouchersInterests(this.userInfo.bindPhone).then(res => {//查当前权益余额
          if (res.code == 200) {
            this.integral = res.data.countIntegral ? res.data.countIntegral : 0
            //权益够，默认勾选权益支付
            if (Number(this.integral) >= Number(this.item.integralPrice)) {
              this.radio = '1'
            } else {
              this.radio = ''
            }
          }
        })
      })
    },
    checkCashnuber() {
      let exp = /^(\-)*(\d+)\.(\d\d).*$/;
      this.actualAmount = this.actualAmount.replace(exp, '$1$2.$3');
    },
    amountInput() {
      if (!this.customList || !this.customList.length) return
      this.checkIndex = null
      this.productId = this.customList[0].id
    },
    checkItem(item, i) {
      console.log(item, i);
      this.item = item
      this.checkIndex = i
      this.actualAmount = Math.ceil(item.name * (this.radio == 1 ? (this.product.integralDiscount || 100) : (this.product.amountDiscount || 100)) / 100)
      this.productId = item.id
    },
    gotoList() {
      this.$router.push('/oilFilling/list')
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
      // if (!this.userInfo.bindPhone) {
      //   this.isLogin = true
      //   return
      // }
      let dom = ''
      if (this.radio == 1) {
        dom = `确认使用${this.allPrice / 100}权益兑换该商品吗？`
      } else if (this.radio == 2) {
        if (this.selectList.length) {
          dom = `确认使用${this.allPrice / 100}元购买该商品吗？`
        } else {
          dom = `确认使用${this.allMoney / 100}元购买该商品吗？`
        }
      } else if (this.radio == 3) {
        dom = `确认使用${this.integral}权益及${this.moneyWx}元购买该商品吗？`
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

<style lang="scss" scoped>
::v-deep .van-checkbox__label {
  flex-grow: 1;
}
.box {
  padding: 10px 15px;
  background: #f6f7f9;
  height: 100vh;
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
  padding: 12px;
  margin-top: 10px;
  .select {
    font-weight: 550;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
    opacity: 0.9;
  }
  .cell-item1 {
    // display: flex;
    // align-items: center;
    .item-title {
      margin-left: 10px;
      .type {
        font-weight: 550;
        font-size: 15px;
        color: #000000;
        opacity: 0.9;
      }
      .content {
        font-size: 12px;
        color: #000000;
        opacity: 0.7;
      }
    }
  }
}
.goodcar {
  display: flex;
  justify-content: flex-end;
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
.button {
  width: calc(100vw - 30px);
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border-radius: 50px;
  border: none;
  font-weight: 400;
  font-size: 15px;
  // line-height: 21px;
  /* identical to box height */
  text-align: center;
  color: #ffffff;
  padding: 11.5px 0;
  position: fixed;
  bottom: 20px;
}
</style>