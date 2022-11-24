<template>
  <div class="telephoneExpenses">

    <div class="Tabs-box">
      <Tabs v-model="active" @change="TabChange">
        <Tab title="国网" />
        <Tab title="南网" />
      </Tabs>
    </div>
    <div class="phone">
      <Field :border="false" v-model="area" type="tel" readonly is-link @click="chooseArea" label="充值区域：" placeholder="请选择充值所属省市" />
    </div>
    <div class="phone">
      <Field :border="false" v-model="tel" type="tel" maxlength="11" label="缴费户号：" placeholder="请输入缴费户号" />
    </div>
    <div class="phone" v-if="active==1">
      <Field :border="false" v-model="tel" type="tel" label="用户信息：" placeholder="如身份证/ 营业执照/银行卡后六位" />
    </div>
    <div class="centre">
      <div class="centre-title">
        <span>{{ productList.propaganda }}</span> <i>（72小时内到账）</i>
      </div>
      <div class="centre-item">
        <div @click="goPrice(item)" v-for="item in productList.productAttributeConfigVOList" :key="item.id" class="centre-item-Num">
          <span>{{ item.originalPrice }}<em style="font-style: normal;font-size: 13px;">元</em></span>
          <span> <i>售价</i> ￥{{ item.amountPrice }}</span>
        </div>
      </div>
    </div>
    <div class="centre-text">
      <div class="title">充值说明</div>
      <div>1.缴费前请确认城市无误。</div>
      <div>2.折扣充值均不能及时到账，急用请勿充值。</div>
      <div>3.充值不成功金额会原路退回。</div>
      <div>4.请确认好缴费户号，充值户号错误不能退款。</div>
      <div>5.客服电话：<a :href="`tel:${phone}`">400-6310-818</a></div>
    </div>
    <!--  -->
    <van-dialog v-model="showDialog" class="box3" :showConfirmButton="false">
      <Icon class="close" size="20" name="cross" @click="closeDialog"></Icon>
      <div class="title">电费充值</div>
      <div class="price1"><span class="tel">{{tel}}</span></div>
      <div class="price">￥<span>{{telephoneMoney}}.00</span></div>
      <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <CellGroup :border="false">
          <Cell clickable @click="radio = '1'" :border="false" v-if="(Number(items.amountPrice) < Number(integral))" class="equity-payment-cell">
            <div class="equity-payment">权益支付</div>
            <div class="notes">(剩余权益{{integral}}）</div>
            <template #right-icon>
              <Radio name="1">
              </Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '2'" :border="false" class="wechat-pay-cell">
            <div class="wechat-pay">微信支付</div>
            <template #right-icon>
              <Radio name="2" style="margin:10px 0" class="wechat-pay-outer"></Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '3'" :border="false" v-if="(Number(items.amountPrice) > Number(integral) )" class="combined-payment-cell">
            <div class="combined-payment">组合支付</div>
            <div class="notes">(微信￥{{money}}+权益{{integral}}）</div>
            <template #right-icon>
              <Radio name="3">
              </Radio>
            </template>
          </Cell>
        </CellGroup>
      </RadioGroup>
      <div class="btn-box">
        <div class="btn" @click="submit" :disabled='disableBtn'>立即支付</div>
      </div>
    </van-dialog>
    <popup v-model="areaShow" round position="bottom">
      <Area title="选择地区" ref="area" :area-list="areaList" @confirm="confirm" :columns-num="2" @cancel="cancel"></Area>
    </popup>
  </div>
</template>

<script>
import Qrcode from 'qrcode'
import { areaList } from '@vant/area-data';
import { Debounce, storageSet, storageGet, NumberSub, NumberMul } from '@/utils/utils'
import wx from 'weixin-js-sdk'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getJsJDK, wxLoginAuthorS, getIsConsumptionRecords } from '@/api/user.js'
import { Swipe, SwipeItem, Tabs, Tab, Field, Toast, Dialog, Popup, RadioGroup, Radio, Cell, CellGroup, Icon, Area } from 'vant'
export default {
  components: { Swipe, SwipeItem, Tabs, Tab, Field, Dialog, Popup, RadioGroup, Radio, Cell, CellGroup, Icon, [Dialog.Component.name]: Dialog.Component, Area },
  data() {
    return {
      records: 0,
      productIdS: [],
      shareId: '',
      showQrcode: false,
      radio: 0,
      active: 0,
      productId: '',
      mid: '',
      tel: '',
      area: '',
      phone: '400-6310-818',
      ImgList: [
        { icon: require('@/assets/img/bgcImg.png') },
        { icon: require('@/assets/img/bgcImg2.png') }
      ],
      text: '提示：72小时内到账，充错无法退回',
      productList: {},
      disableBtn: false,
      showDialog: false,
      items: {},
      userInfo: {},
      bindPhone: '',
      integral: '',
      ChinaTelcom: '',//电信
      ChinaMobile: '',//移动
      ChinaUnion: '',//联通
      telephoneMoney: '',
      areaShow: false,
      cascaderValue: '',
      options: [],
      areaList: {}
    }
  },
  filters: {
    names(val) {
      if ((val ?? '') !== '') {
        let i = val.substr(0, 1)
        if (i == 1) {
          return '移动话费充值'
        } else if (i == 2) {
          return '联通话费充值'
        } else {
          return '电信话费充值'
        }
      }
    }
  },

  watch: {
    // tel(val) {
    //   if (val.length === 11) {
    //     let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|198|18[2-478])\d{8}$/; //移动
    //     let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|18[56])\d{8}$/; //联通
    //     let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199|191|193|)\d{8}$/; //电信
    //     if (isChinaMobile.test(this.tel)) {
    //       this.active = 0
    //     } else if (isChinaUnion.test(this.tel)) {
    //       this.active = 1
    //     } else if (isChinaTelcom.test(this.tel)) {
    //       this.active = 2
    //     } else {
    //       this.active = 3
    //       Toast('请输入正确的手机号')
    //       return false
    //     }
    //   }
    // },
    active: {
      immediate: true,
      handler(val) {
        console.log(val);
        console.log(storageGet('areaList'));
        this.area = ''
        if (val == 0) {
          if (storageGet('areaList')) {
            let areaList = storageGet('areaList')
            Object.keys(areaList.province_list).map(key => (key == '440000' || key == '450000' ? delete areaList.province_list[key] : ''));
            Object.keys(areaList.city_list).map(key => (key.substr(0, 2) == '44' || key.substr(0, 2) == '45' ? delete areaList.city_list[key] : ''));
            this.areaList = areaList
          }
          this.getData(this.ChinaMobile)
        } else if (val == 1) {
          if (storageGet('areaList')) {
            let areaList = storageGet('areaList')
            Object.keys(areaList.province_list).map(key => (key != '440000' && key != '450000' ? delete areaList.province_list[key] : ''));
            Object.keys(areaList.city_list).map(key => (key.substr(0, 2) != '44' && key.substr(0, 2) != '45' ? delete areaList.city_list[key] : ''));
            // this.areaList.province_list = {
            //   440000: '广东省',
            //   450000: '广西壮族自治区',
            // }
            this.areaList = areaList
          }
          this.getData(this.ChinaUnion)
        }
        console.log(this.areaList);
      }
    },
    areaShow(val) {
      if (!val) {
        this.$refs.area.reset()
      }
    },
    radio: {
      handler(val) {
        if (val == 1) {
          this.telephoneMoney = this.items.integralPrice
        } else {
          this.telephoneMoney = this.items.amountPrice
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    money() {
      let res = Number(this.items.amountPrice) - Number(this.integral)
      return res
    },
  },
  created() {
    console.log(areaList);

    delete areaList.county_list
    let areaList1 = areaList
    // storageSet('areaList', JSON.parse(JSON.stringify(this.areaList)))
    storageSet('areaList', areaList1)

    // if (this.active == 0) {
    //   if (storageGet('areaList')) {
    //     let areaList = storageGet('areaList')
    //     Object.keys(areaList.province_list).map(key => (key == '440000' || key == '450000' ? delete areaList.province_list[key] : ''));
    //     Object.keys(areaList.city_list).map(key => (key.substr(0, 2) == '44' || key.substr(0, 2) == '45' ? delete areaList.city_list[key] : ''));
    //     this.areaList = areaList
    //   }
    // }
    // delete this.areaList.county_list
    this.getIsConsumption()
    this.productId = this.$route.query.productId
    this.mid = storageGet('M_mid')
    let productIdLists = storageGet('productIdList')
    this.productIdS = productIdLists
    if ((this.$route.query.shareId ?? '') !== '') {
      this.shareId = this.$route.query.shareId
      let productIdS = this.$route.query.one.split(',')
      productIdLists = productIdS
      this.mid = this.$route.query.Mmid
      // let res = wxLoginAuthorS()
    }
    this.getIntegralNum()
    this.getProductConfigInfo(productIdLists)
    getJsJDK()
  },
  methods: {
    confirm(value) {
      if (value && value[0] && value[1]) {
        this.area = `${value[0].name}/${value[1].name}`
      }
      this.areaShow = false
    },
    cancel() {
      this.areaShow = false
    },
    chooseArea() {
      this.areaShow = true
    },
    toAutoRecharge() {
      this.$router.push({ path: '/telephoneExpenses/autoRecharge' })
    },
    toRechargeRecord() {
      this.$router.push({ path: '/telephoneExpenses/rechargeRecord' })
    },
    async getIsConsumption() {
      let userInfo = storageGet('userInfo')
      const res = await getIsConsumptionRecords({ phone: userInfo.bindPhone })
      if (res.code == 200) {
        this.records = res.data
      }
    },
    // canvasClick(){
    //   let userInfo = storageGet('userInfo')
    //   let qrCodeCanvas = document
    //     .getElementById("qrcode")
    //     .getElementsByTagName("canvas");
    //   let a = document.createElement("a");
    //   a.href = qrCodeCanvas[0].toDataURL("image/url");
    //   a.download = `【http://192.168.2.59:8082/#/telephoneExpenses?productId=25&&shareId=${userInfo.openid}&&one=${this.productIdS[0]},${this.productIdS[1]},${this.productIdS[2]}&&Mmid=${this.mid}】二维码.png`;
    //   a.click();
    // },
    useqrcode(url) {//url是生成二维码的内容children
      let _this = this;
      let fatherQrcode = document.getElementById('QRCode');
      //先清除fatherQrcode的img子节点：防止重复添加
      let childs = fatherQrcode.children;
      console.log(childs);
      for (var i = childs.length - 1; i >= 0; i--) {
        // console.log(typeof childs[i])
        if (childs[i].className == "QRCode") {
          fatherQrcode.removeChild(childs[i]);
        }
      }
      //生成二维码
      var canvas = document.getElementById('canvas')
      Qrcode.toCanvas(canvas, url, function (error) {
        if (error) console.error(error)
        console.log('success!');
        //获取网页中的canvas对象转换为img
        var mycanvas1 = document.getElementsByTagName('canvas')[0];
        mycanvas1.style.display = 'none'//隐藏生成的canvas
        //将转换后的img标签插入到html中
        var img = _this.convertCanvasToImage(mycanvas1);
        img.classList.add("QRCode");//为img添加类名QRCode
        fatherQrcode.append(img);//imagQrDiv表示你要插入的容器id
      })
    },
    //转换为img
    convertCanvasToImage(canvas) {
      //新Image对象，可以理解为DOM
      var image = new Image();
      // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
      // 指定格式 PNG
      image.src = canvas.toDataURL("image/png");
      return image;
    },
    share() {
      this.showQrcode = true
      let userInfo = storageGet('userInfo')//o-zYf56M0sw2BDdc4XFgmL_irLTQ
      let link = `https://jhbtestapp.gongxingtech.com/#/telephoneExpenses?productId=${this.productId}&shareId=o-zYf56M0sw2BDdc4XFgmL_irLTQ&one=${this.productIdS[0]},${this.productIdS[1]},${this.productIdS[2]}&Mmid=${this.mid}`
      // let link = `https://jhbapp.gongxingtech.com/#/telephoneExpenses?productId=${this.productId}&shareId=o-zYf56M0sw2BDdc4XFgmL_irLTQ&one=${this.productIdS[0]},${this.productIdS[1]},${this.productIdS[2]}&Mmid=${this.mid}`
      this.$nextTick(function () {
        this.useqrcode(link);
      })
      return
      // http://192.168.2.59:8082/#/telephoneExpenses?productId=25
      // nextTick等到它前面（它是一个异步，所有的同步都在它前面）的东西渲染完成后执行
      this.$nextTick(() => {
        Qrcode.toCanvas(this.$refs.canvas,
          `http://192.168.2.59:8082/#/telephoneExpenses?productId=25&&shareId=${userInfo.openid}&&one=${this.productIdS[0]},${this.productIdS[1]},${this.productIdS[2]}&&Mmid=${this.mid}`, {
          width: 380,
          height: 380
        })
      })
    },
    NumberAdd(list) {//加法
      let length = list.length; //获得传入参数数组长度
      if (!length) return 0;
      if (length == 1) return list[0];
      let arg1 = 0; //初始值
      for (let i = 0; i < length; i++) {
        let arg2 = list[i] || 0; //加数
        let r1, r2, m;
        try {
          r1 = String(arg1).split(".")[1].length;
        } catch (e) {
          r1 = 0;
        }
        try {
          r2 = String(arg2).split(".")[1].length;
        } catch (e) {
          r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        arg1 = (arg1 * m + arg2 * m) / m;
      }
      return arg1;
    },
    getProductConfigInfo(productIdLists) {
      this.getID(productIdLists[0])
      this.getID(productIdLists[1])
      this.getID(productIdLists[2])
    },
    getID(id) {
      getProductConfigInfo({ id }).then(v => {
        // console.log('v',v);
        if (v.data.name === '电信') {
          this.ChinaTelcom = v.data.id
          storageSet('ChinaTelcomId', v.data.id)
          // console.log('ChinaTelcom',v.data.id);
        } else if (v.data.name === '移动') {
          this.ChinaMobile = v.data.id
          storageSet('ChinaMobileId', v.data.id)
          this.getData(this.ChinaMobile)
          // console.log('ChinaMobile',v.data.id);
        } else {
          storageSet('ChinaUnionId', v.data.id)
          this.ChinaUnion = v.data.id
          // console.log('ChinaUnion',v.data.id);
        }
      })
      //   if((this.ChinaMobile?? '') !==''){
      //       this.getData(this.ChinaMobile)
      //   }
    },
    closeDialog() {
      this.showDialog = false
    },
    getIntegralNum() {
      this.userInfo = storageGet('userInfo') || ''
      console.log('user', this.userInfo);
      this.bindPhone = this.userInfo.bindPhone
      countVouchersInterests(this.bindPhone).then(res => {
        if (res.code == 200) {
          // 权益和优惠券的存储
          this.integral = res.data.countIntegral ? res.data.countIntegral : 0
          // console.log(this.integral);
        }      })
    },
    // ----------------
    async getData(id) {
      console.log('999', id);
      if (id) {
        const res = await getProductConfigInfo({ id })
        console.log(res)
        this.productList = res.data
      }
    },
    TabChange(e) {
      if (e == 0) {//国网
        this.getData(this.ChinaMobile)
        console.log(this.areaList);
      } else if (e == 1) {//南网
        this.getData(this.ChinaUnion)
      }
    },
    goPrice(item) {
      this.items = item
      //24移动
      console.log('55', item.productId)
      // if ((this.tel ?? '') !== '') {
      let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|198|18[2-478])\d{8}$/ //移动
      let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|18[56])\d{8}$/ //联通
      let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199|193|191)\d{8}$/ //电信
      if (this.tel.length !== 11) {
        Toast('请输入正确的手机号')
        return false
      }
      if (item.productId == this.ChinaMobile) {
        if (!isChinaMobile.test(this.tel)) {
          Toast('非移动号码')
          return
        } else {
          this.submit1(item)
        }
      } else if (item.productId == this.ChinaUnion) {
        if (!isChinaUnion.test(this.tel)) {
          Toast('非联通号码')
          return
        } else {
          this.submit1(item)
        }
      } else {
        if (!isChinaTelcom.test(this.tel)) {
          Toast('非电信号码')
          return
        } else {
          this.submit1(item)
        }
      }
      // } else {
      //   //   console.log(1111);
      //   Toast.fail('电话号码为空')
      //   return
      // }
      // this.submit1(item)
      console.log('active', item);
      // if(this.active){}
    },
    submit1(item) {
      // Dialog.confirm({
      //   allowHtml: true,
      //   title: '充值信息确定',
      //   message: `<h3>${this.tel}</h3><span style="color: #FB584D">${this.text}</span>`,
      //   confirmButtonText: '确定充值',
      //   confirmButtonColor: '#FB584D',
      //   cancelButtonText: '再想一下',
      //   cancelButtonColor: '#666666',
      // }).then(()=>{
      //   }).catch(()=>{})
      this.showDialog = true
      this.telephoneMoney = this.items.amountPrice
    },
    submit() {

      if (this.radio == 0) {
        Toast('请选择支付方式')
        return
      }
      let data = {
        // actualPrice: this.NumberDiv(this.form.chargingAmount, 1.06).toFixed(2),//实付价格
        // actualPrice: this.radio == 1 ? this.form.checkCashnuber : this.radio == 2 ? this.NumberDiv(this.form.chargingAmount, 1.06).toFixed(2) : this.radio == 3 ? this.NumberAdd([this.money, this.integral]) : 0,//实付价格
        actualPrice: this.radio == 1 ? this.items.integralPrice : this.radio == 2 ? this.items.amountPrice : this.radio == 3 ? this.NumberAdd([this.money, this.integral]) : 0,//实付价格
        payAmount: this.radio == 1 ? 0 : this.radio == 2 ? this.items.amountPrice : this.radio == 3 ? this.money : 0,//支付金额
        payIntegral: this.radio == 1 ? this.items.integralPrice : this.radio == 2 ? 0 : this.radio == 3 ? this.integral : 0,//支付权益
        price: this.items.originalPrice,//售价
        productAttribute: this.items.id,//产品id
        rechargeAccount: this.tel,//充值账户
        rechargeMode: Number(this.radio) - 1,//充值方式(0.权益充值,1.微信充值,2.组合充值)
        userPhone: this.bindPhone,//用户手机号
        mid: this.mid,//菜单id
        openId: storageGet('userInfo').openid || ''
      }
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let success = async res => {
            await done()
            this.disableBtn = false
            if (res.code != 200) {
              Toast(res.msg || '充值失败')
              this.$router.push({ path: '/login/index' })
              return
            }
            if (this.radio != 1) {
              let pay = res.data || {}
              console.log('appId', pay.appId);
              if ((pay.appId ?? '') === '') {
                Toast('未登录请先登录')
                this.$router.push({ path: '/login/index' })
                return
              }
              console.log('pay.appId');
              wx.chooseWXPay({  //此方法应放在调用后台统一下单接口成功后回调里面，接口返回  timeStamp，nonceStr，package，paySign等参数
                // appId: pay.appId,  //此参数可不用
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
                    if ((this.shareId ?? '') !== '') {
                      this.$router.replace(`/telephoneExpenses/success?amount=${this.items.originalPrice}&share=${this.shareId}`)
                    } else {
                      this.$router.replace(`/telephoneExpenses/success?amount=${this.items.originalPrice}`)
                    }
                  }

                },
                cancel: r => {
                  //支付取消
                  // this.$router.replace('/oilFilling/list')
                  if (r.errMsg == 'chooseWXPay:cancel') {
                    console.log('rrr', r);
                    Toast('取消支付', 1200);
                    return
                  } else {
                    Toast('支付关闭', 1200);
                  }
                }
              });
            } else {
              Toast('充值成功')
              this.$router.replace(`/telephoneExpenses/success?amount=${this.items.originalPrice}`)
            }
          }
          addProductRecharge(data).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '兑换确认',
        confirmButtonColor: '#F14F44',
        beforeClose
      })
    },
  }
}
</script>

<style lang="scss" scoped>
//  allowHtml: true,
//         title: '充值信息确定',
//         message: `<h3>${this.tel}</h3><span style="color: #FB584D">${this.text}</span>`,
//         confirmButtonText: '确定充值',
//         confirmButtonColor: '#FB584D',
//         cancelButtonText: '再想一下',
//         cancelButtonColor: '#666666',
//         beforeClose
@mixin box {
  width: 345px;
  background: #ffffff;
  box-shadow: 3px 0px 7px 2px rgba(0, 0, 0, 0.04);
  border-radius: 6px;
}
.telephoneExpenses {
  height: 100vh;
  background-color: #f6f7f9;
  padding: 10px 15px;
  .Tabs-box {
    ::v-deep .van-tabs__nav {
      background-color: #f6f7f9;
    }
    ::v-deep .van-tabs__line {
      width: 24px;
    }
  }
  .phone {
    margin: 10px 0;
    .van-cell {
      border-radius: 6px;
      padding-left: 12px;
    }
    ::v-deep .van-cell__title {
      span {
        font-size: 16px !important;
        color: #000;
        opacity: 0.9;
      }
    }
  }
  .centre {
    @include box;
    // padding: 12px 12px 12px 7px;
    padding: 12px 7px;
    &-title {
      margin-left: 5px;
      i {
        font-size: 13px;
        opacity: 0.6;
        font-style: normal;
      }
      span {
        font-size: 16px;
        opacity: 0.9;
      }
    }

    &-item {
      padding-top: 16px;
      width: 330px;
      display: flex;
      flex-wrap: wrap;
      &-Num {
        display: flex;
        flex-direction: column;
        text-align: center;
        flex: 30%;
        height: 64px;
        padding-top: 10px;
        line-height: 22px;
        background-color: red;
        margin-left: 5px;
        margin-bottom: 5px;
        background: #fff9f9;
        border-radius: 6px;
        i {
          font-size: 13px;
          font-style: normal;
        }
        span:nth-child(1) {
          font-size: 18px;
          color: #fb584d;
          opacity: 0.9;
        }
        span:nth-child(2) {
          font-size: 12px;
          opacity: 0.7;
        }
      }
      &-Num:nth-child(1) {
        margin-left: 0;
      }
      &-Num:nth-child(4) {
        margin-left: 0;
      }
    }
  }
  .centre-text {
    background-color: #fff;
    border-radius: 6px;
    padding: 10px 12px;
    margin-top: 10px;
    // margin-top: 78px;
    .title {
      font-size: 16px;
      color: #333;
      opacity: 0.9;
      margin-bottom: 14px;
    }
    font-size: 14px;
    opacity: 0.9;
    line-height: 24px;
    a {
      color: #005de9;
    }
  }
  .auto-recharge {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 6px;
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    font-style: normal;
    .recharge-content {
      text-align: center;
    }
  }
}
.box3 {
  text-align: center;
  .close {
    display: flex;
    margin: 20px 0 0px 20px;
    color: #999999;
  }
  .title {
    font-weight: 700;
    font-size: 15px;
    color: #333333;
  }
  .price {
    font-weight: 700;
    font-size: 20px;
    color: #000000;
    opacity: 0.9;
    margin-top: 10px;
    span {
      font-size: 34px;
    }
  }
  .price1 {
    margin-top: 4px;
    .tel {
      font-size: 20px;
      font-weight: 400;
      color: #fb584d;
    }
    span {
      font-size: 34px;
    }
  }
  .equity-payment {
    position: relative;
    margin-left: 30px;
    &::before {
      display: inline-block;
      content: "";
      width: 20px;
      height: 20px;
      background: url("../../../assets/img/equityPay.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 15px;
      left: -30px;
    }
  }
  .notes {
    margin-left: 30px;
  }
  .wechat-pay {
    position: relative;
    margin-left: 30px;
    margin-top: 8px;
    &::before {
      display: inline-block;
      content: "";
      width: 20px;
      height: 20px;
      background: url("../../../assets/img/wxpay.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 2px;
      left: -30px;
    }
  }
  .combined-payment {
    position: relative;
    margin-left: 30px;
    &::before {
      display: inline-block;
      content: "";
      width: 20px;
      height: 20px;
      background: url("../../../assets/img/portfolioPayment.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 15px;
      left: -30px;
    }
  }
  .btn-box {
    width: 100%;
    // position: fixed;
    // bottom: 0;
    background: #fff;
    padding: 10px 0;
    .btn {
      color: #fff;
      width: 281px;
      height: 44px;
      margin: 10px auto 10px;
      text-align: center;
      line-height: 44px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 50px;
    }
  }
}
</style>
