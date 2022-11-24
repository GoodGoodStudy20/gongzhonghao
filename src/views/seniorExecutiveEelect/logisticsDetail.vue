<template>
  <div class="box">
    <div class="good-detail">

      <!-- <Cell class="good-cell" :border="false" v-for="item in selectList" :key="item.id"> -->
      <Cell class="good-cell" :border="false" >
        <div class="good-item">
          <img :src="$store.state.logisticsDetails[0].imgUrl" alt="">
          <div class="item-right">
            <div class="title">物流状态：</div>
            <div class="title">共{{$store.state.logisticsDetails.length}}件商品，由【极兔】承运</div>
            <div class="title">运单编号：<span id="copycode">{{expressList.nu}}</span><span @click="handleCopy" class="span">复制</span></div>
          </div>
        </div>
      </Cell>
    </div>
    <div class="order-detail" v-if="!expressItem.length">
      <div class="no-data">暂无物流信息</div>
    </div>
    <Steps direction="vertical" class="order-detail1" v-if="expressItem.length">
      <Step v-for="v in expressItem" :key="v.time">
        <div>{{v.context}}</div>
        <div>{{v.time}}</div>
      </Step>
      <!-- <Step>
        <div>【城市】物流状态2</div>
        <div>2016-07-12 12:40</div>
      </Step> -->
    </Steps>
  </div>
</template>

<script>
import { getJsJDK } from '@/api/user'
import wx from 'weixin-js-sdk'
import { createOrder, getShoppingAddressPage,selectQueryTrack } from '@/api/user'
import { Steps, Step,Cell,Toast } from 'vant'
import { Debounce, storageSet, storageGet, NumberSub } from '@/utils/utils'
export default {
  name: 'addAdress',
  components: { Steps, Step,Cell },
  data() {
    return {
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
      selectList: [],
      from:{
        num:'',
        phone:''
      },
      expressList:{},
      expressItem:[],
    }
  },
  created() {
    if (this.$route.query.num) {
      this.from.num = this.$route.query.num
    }
    if (this.$route.query.phone) {
      this.from.phone = this.$route.query.phone
      this.getdata()
    }
    // this.getIntegralNum()
    this.getShoppingAddressPage()
    getJsJDK()
  },
  methods: {
     handleCopy() {
      const range = document.createRange();// 创建range对象
      range.selectNode(document.getElementById('copycode')); //获取复制内容的 id 选择器
      const selection = window.getSelection();  //创建 selection对象
      if (selection.rangeCount > 0) selection.removeAllRanges(); //如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
      selection.addRange(range); //将range对象添加到selection选区当中，会高亮文本块
      document.execCommand('copy'); //复制选中的文字到剪贴板
      Toast('复制成功')
      selection.removeRange(range); // 移除选中的元素
    },
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
   async getdata(){
    const res = await selectQueryTrack(this.from)
    console.log(res);
    if(res.code == 200){
      this.expressList = res.data
      this.expressItem = res.data.data.reverse()
      console.log(this.expressList);
    }
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
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          .span{
            margin-left:14px;
          }
          :nth-child(2){
            margin-top: 5px;
          }
          .title {
            // font-weight: 550;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
.order-detail {
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
  .no-data {
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    opacity: 0.6;
    &::before {
      display: inline-block;
      content: "";
      width: 8px;
      height: 8px;
      background: #1baf4e;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.order-detail1 {
  border-radius: 8px;
  font-size: 13px;
  .van-step {
    font-size: 13px;
  }
}
</style>