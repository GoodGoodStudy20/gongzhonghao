<template>
  <div class="telephoneExpenses">
    <div class="Swipe-box">
      <Swipe :autoplay="3000" indicator-color="white" class="swipe" indicatorColor="#fff">
        <!-- <SwipeItem v-if="!home1.childrenList || !home1.childrenList.length">
          <img style="height:100%;width:100%;" src="@/assets/img/swipe.png" />
        </SwipeItem> -->
        <SwipeItem v-for="item in ImgList" :key="item.id">
          <img style="height:100%;width:100%;border-radius: 8px;" :src="item.icon" @click="jumpUrl(item)" />
        </SwipeItem>
      </Swipe>
    </div>
    <div class="Tabs-box">
      <Tabs v-model="active" @change="TabChange">
        <Tab title="移动" />
        <Tab title="联通" />
        <Tab title="电信" />
      </Tabs>
    </div>
    <div class="phone">
      <Field :border="false" v-model="tel" type="tel" clearable maxlength="11" label="充值账号：" placeholder="输入手机号码自动匹配运营商" />
    </div>
    <div class="centre">
      <div class="centre-tips" v-if="productList.notes">
        <img src="@/assets/img/serviceDescription2.png" alt="">
        <!-- <marquee class="left" :scrollamount="4" direction="left" v-html="productList.notes"></marquee> -->
        <!-- <NoticeBar scrollable> {{productList.notes.replace(/<\/?.+?>/g,'')}}</NoticeBar> -->
        <div class="scroll">
          <span>
            {{productList.notes.replace(/<\/?.+?>/g,'')}}
          </span>
        </div>
      </div>
      <div class="centre-title">
        <span>{{ productList.propaganda }}</span> <i>（72小时内到账）</i>
      </div>
      <div class="centre-item">
        <div @click="goPrice(item)" v-for="item in productList.productAttributeConfigVOList" :key="item.id" class="centre-item-Num">
          <span>{{ item.originalPrice
            }}<em style="font-style: normal;font-size: 13px;">元</em></span>
          <span> <i>售价</i> ￥{{ item.amountPrice }}</span>
        </div>
      </div>
    </div>
    <div class="auto-recharge">
      <div @click="toAutoRecharge" class="recharge-content">
        <img src="@/assets/img/autoRecharge1.png" alt="">
        <div>自动续费</div>
      </div>
      <div @click="share" class="recharge-content" v-if="records!=0">
        <img src="@/assets/img/share5.png" alt="">
        <div>分享获利</div>
      </div>
      <div @click="profitRecord" class="recharge-content" v-if="records!=0">
        <img src="@/assets/img/huoliRecord.png" alt="">
        <div>获利记录</div>
      </div>
      <div @click="toRechargeRecord" class="recharge-content">
        <img src="@/assets/img/record.png" alt="" />
        <div>充值记录</div>
      </div>
    </div>
    <div class="centre-text">
      <div class="title">充值说明</div>
      <div>1.慢充话费最迟72小时内到账,欠费号码可充值；</div>
      <div>2.月初月尾充值时间较慢，月中为最佳充值时间；</div>
      <div>3.不支持虚拟号、空号、携号转网、集团代充值号码、副卡充值；</div>
      <div>4.请确认号码准确，若充错号码损失自行承担；</div>
      <div>5.如有任何问题请联系客服咨询；</div>
      <div>6.客服电话：<a :href="`tel:${phone}`">400-6310-818</a></div>
    </div>
    <!--  -->
    <van-dialog v-model="showDialog" class="box3" :showConfirmButton="false">
      <Icon class="close" size="20" name="cross" @click="closeDialog"></Icon>
      <div class="title">话费充值</div>
      <div class="price1">
        <span class="tel">{{ tel }}</span>
      </div>
      <div class="price">
        ￥<span>{{ telephoneMoney }}.00</span>
      </div>
      <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
        <CellGroup :border="false">
          <Cell clickable @click="radio = '1'" :border="false" v-if="Number(items.amountPrice) < Number(integral)" class="equity-payment-cell">
            <div class="equity-payment">权益支付</div>
            <div class="notes">(剩余权益{{ integral }}）</div>
            <template #right-icon>
              <Radio name="1"> </Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '2'" :border="false" class="wechat-pay-cell">
            <div class="wechat-pay">微信支付</div>
            <template #right-icon>
              <Radio name="2" style="margin:10px 0" class="wechat-pay-outer"></Radio>
            </template>
          </Cell>
          <Cell clickable @click="radio = '3'" :border="false" v-if="Number(items.amountPrice) > Number(integral)" class="combined-payment-cell">
            <div class="combined-payment">组合支付</div>
            <div class="notes">(微信￥{{ money }}+权益{{ integral }}）</div>
            <template #right-icon>
              <Radio name="3"> </Radio>
            </template>
          </Cell>
        </CellGroup>
      </RadioGroup>
      <div class="btn-box">
        <div class="btn" @click="submit" :disabled="disableBtn">立即支付</div>
      </div>
    </van-dialog>
    <van-dialog title="二维码" width="500px" v-model="showQrcode">
      <div id="QRCode" style="text-align:center">
        <div id="code"></div>
        <canvas id="canvas" ref="canvas"></canvas>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import Qrcode from 'qrcode'
import { Debounce, storageSet, storageGet, NumberSub, NumberMul } from '@/utils/utils'
import wx from 'weixin-js-sdk'
import { getProductConfigInfo, countVouchersInterests, addProductRecharge, getJsJDK, wxLoginAuthorS, getIsConsumptionRecords, GetQueryString, wxGetUserByCode, addPromote } from '@/api/user.js'
import { Swipe, SwipeItem, Tabs, Tab, Field, Toast, Dialog, Popup, RadioGroup, Radio, Cell, CellGroup, Icon, NoticeBar } from 'vant'
export default {
  components: { Swipe, SwipeItem, Tabs, Tab, Field, Dialog, Popup, RadioGroup, Radio, Cell, CellGroup, Icon, [Dialog.Component.name]: Dialog.Component, Popup, NoticeBar },
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
      phone: '400-6310-818',
      ImgList: [
        { icon: require('@/assets/img/bgcImg.png') },
        // { icon: require('@/assets/img/bgcImg2.png') }
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
      msgData: ''
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
    tel(val) {
      if (val.length === 11) {
        let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|198|18[2-478])\d{8}$/; //移动
        let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|175|18[56])\d{8}$/; //联通
        let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199|191|193|)\d{8}$/; //电信
        if (isChinaMobile.test(this.tel)) {
          this.active = 0
        } else if (isChinaUnion.test(this.tel)) {
          this.active = 1
        } else if (isChinaTelcom.test(this.tel)) {
          this.active = 2
        } else {
          this.active = 3
          Toast('请输入正确的手机号')
          return false
        }
      }
    },
    active: {
      handler(val) {
        if (val == 0) {
          this.getData(this.ChinaMobile)
        } else if (val == 1) {
          this.getData(this.ChinaUnion)
        } else {
          this.getData(this.ChinaTelcom)
        }
      },
      immediate: true,
      deep: true
    },
    // active(val) {
    //   if (val == 0) {
    //     this.getData(this.ChinaMobile)
    //   } else if (val == 1) {
    //     this.getData(this.ChinaUnion)
    //   } else {
    //     this.getData(this.ChinaTelcom)
    //   }
    // },
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
  async created() {
    this.getIsConsumption()
    if (this.$route.query.productId) {
      this.productId = this.$route.query.productId
    }
    this.mid = storageGet('M_mid')
    let productIdLists = storageGet('productIdList')
    this.productIdS = productIdLists
    if ((this.$route.query.shareId ?? '') !== '') {
      if (this.$route.query.shareId == 1) {
        // this.shareId = storageGet('share_openId')
        this.mid = storageGet('share_mid')
        productIdLists = storageGet('share_productIdS')
        this.shareId = storageGet('share_shareId')
        this.productId = storageGet('share_productId')
        //  let code = GetQueryString('code');
        //https://jhbtestapp.gongxingtech.com/?code=051GerFa1uoB3E0E69Ja1ui1BZ3GerFO&state=1#/telephoneExpenses?shareId=1
        let Code = storageGet('user_CODEURL')
        let CodeS = this.getUrlParam()
        if ((Code ?? '') === '') {
          this.getWechatCode()
        }
        if (!storageGet('userInfoShare') || (storageGet('userInfoShare').openid ?? '') === '') {
          let CodeA = Code.split('?')[1].split('&')[0].split('=')[1]
          const Ares = await wxGetUserByCode({ code: CodeA })
          storageSet('userInfoShare', Ares.data)
        }
      } else {
        this.shareId = this.$route.query.shareId
        let productIdS = this.$route.query.one.split(',')
        productIdLists = productIdS
        this.mid = this.$route.query.Mmid
        storageSet('share_mid', this.mid)
        storageSet('share_productIdS', productIdS)
        storageSet('share_shareId', this.shareId)
        storageSet('share_productId', this.productId)
      }
      // let res = wxLoginAuthorS()
    }

    this.getIntegralNum()
    this.getProductConfigInfo(productIdLists)
    let userInfo = storageGet('userInfo')//o-zYf56M0sw2BDdc4XFgmL_irLTQ
    await getJsJDK()
    await this.wxH5Share.getConfig('话费充值只要94折', '电信、联通、移动三大运营商都在！', `https://jhbapp.gongxingtech.com/#/telephoneExpenses?productId=${this.productId}&shareId=${userInfo.openid}&one=24,25,26&Mmid=76`)    // this.wxH5Share.getConfig()
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.userInfo = storageGet('userInfo') || ''
        this.tel = this.userInfo.bindPhone
      }, 500)
    })
  },
  methods: {
    getWechatCode() {
      //回掉域名地址，一般由后端人员配置，使用自己的地址
      const local = 'https://jhbapp.gongxingtech.com/#/telephoneExpenses?shareId=1';
      // const local = 'https://jhbtestapp.gongxingtech.com/#/telephoneExpenses?shareId=1';
      //跳转至微信官方进行获取code，地址中需要填写appid
      window.location.href =
        // 正式
        'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wx06d35f4d7b5dfa78' + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
      // 测试
      // 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wx023e37c0d962a7c8' + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
    },
    //链接地址中的appid需要填写微信公众号接入的应用appid
    //scopde是设置授权的方式,这里是配置静默授权还是非静默授权
    //获取回调地址栏上的code信息
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      let url = window.location.href.split('#')[0];
      let search = url.split('?')[1];
      if (search) {
        var r = search.substr(0).match(reg);
        if (r !== null) {
          return unescape(r[2]);
        }
        return null;
      } else { return null };
    },
    toAutoRecharge() {
      this.$router.push({ path: '/telephoneExpenses/autoRecharge' })
    },
    toRechargeRecord() {
      this.$router.push({ path: '/telephoneExpenses/rechargeRecord' })
    },
    profitRecord() {
      this.$router.push({ path: '/telephoneExpenses/profitRecord' })
    },
    async getIsConsumption() {
      let userInfo = storageGet('userInfo') || {}
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
      for (var i = childs.length - 1; i >= 0; i--) {
        if (childs[i].className == "QRCode") {
          fatherQrcode.removeChild(childs[i]);
        }
      }
      //生成二维码
      var canvas = document.getElementById('canvas')
      Qrcode.toCanvas(canvas, url, function (error) {
        if (error) console.error(error)
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
      var image = new Image();
      // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
      //  PNG格式
      image.src = canvas.toDataURL("image/png");
      return image;
    },
    share() {
      //https://jhbtestapp.gongxingtech.com/#/telephoneExpenses?productId=25&shareId=ovjHq1du0u5vkAABnOJC2BG2w8AE&one=24,25,26&Mmid=69
      this.showQrcode = true
      let userInfo = storageGet('userInfo')//o-zYf56M0sw2BDdc4XFgmL_irLTQ
      let link = `https://jhbapp.gongxingtech.com/#/telephoneExpenses?productId=${this.productId}&shareId=${userInfo.openid}&one=24,25,26&Mmid=76`
      // let link = `https://jhbtestapp.gongxingtech.com/#/telephoneExpenses?productId=${this.productId}&shareId=${userInfo.openid}&one=${this.productIdS[0]},${this.productIdS[1]},${this.productIdS[2]}&Mmid=${this.mid}`
      this.$nextTick(function () {
        this.useqrcode(link);
      })
      return
      // http://192.168.2.59:8082/#/telephoneExpenses?productId=25
      // nextTick等到它前面（它是一个异步，所有的同步都在它前面）的东西渲染完成后执行
      this.$nextTick(() => {
        Qrcode.toCanvas(this.$refs.canvas,
          `http://192.168.2.59:8082/#/telephoneExpenses?productId=25&&shareId=${userInfo.openid}&&one=24,25,26&&Mmid=76`, {
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
        if (v.data.name === '电信') {
          this.ChinaTelcom = v.data.id
          storageSet('ChinaTelcomId', v.data.id)
        } else if (v.data.name === '移动') {
          this.ChinaMobile = v.data.id
          storageSet('ChinaMobileId', v.data.id)
          this.getData(this.ChinaMobile)
        } else {
          storageSet('ChinaUnionId', v.data.id)
          this.ChinaUnion = v.data.id
        }
      })
    },
    closeDialog() {
      this.showDialog = false
    },
    getIntegralNum() {
      this.userInfo = storageGet('userInfo') || ''
      // this.tel = this.userInfo.bindPhone
      this.bindPhone = this.userInfo.bindPhone
      countVouchersInterests(this.bindPhone).then(res => {
        if (res.code == 200) {
          // 权益和优惠券的存储
          this.integral = res.data.countIntegral ? res.data.countIntegral : 0
        }      })
    },
    // ----------------
    async getData(id) {
      // ChinaTelcom: '',//电信
      // ChinaMobile: '',//移动
      // ChinaUnion: '',//联通
      if (id) {
        const res = await getProductConfigInfo({ id })
        this.productList = res.data
      }

    },
    TabChange(e) {
      if (e == 0) {
        this.getData(this.ChinaMobile)
      } else if (e == 1) {
        this.getData(this.ChinaUnion)
      } else {
        this.getData(this.ChinaTelcom)
      }
    },
    //  checkMobile() { //大运营商（联通、电信、移动）的手机号正则判断
    //   let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/; //移动
    //   let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|18[56])\d{8}$/; //联通
    //   let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199)\d{8}$/; //电信
    //   if (this.tel.length !== 11) {
    //     Toast('请输入正确的手机号')
    //     return false
    //   }
    //   if (isChinaMobile.test(this.tel)) {
    //     this.active = 0
    //   } else if (isChinaUnion.test(this.tel)) {
    //     this.active = 1
    //   } else if (isChinaTelcom.test(this.tel)) {
    //     this.active = 2
    //   } else {
    //     this.active = 3
    //     Toast('请输入正确的手机号')
    //     return false
    //   }
    //   return true
    // },
    goPrice(item) {
      this.items = item
      //24移动
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
      //   Toast.fail('电话号码为空')
      //   return
      // }
      // this.submit1(item)
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
      if ((Number(this.items.amountPrice) < Number(this.integral))) {
        this.radio = '1'
      } else {
        this.radio = '2'
      }
      this.telephoneMoney = this.items.amountPrice
    },
    submit() {
      //   if (!this.form.chargingPhone) {
      //     Toast('请输入充值账号')
      //     return
      //   }
      //   if (Number(this.form.actualAmount) > Number(this.integral)) {
      //     Toast('权益不足')
      //     return
      //   }
      if (this.radio == 0) {
        Toast('请选择支付方式')
        return
      }

      // if(this.radio==1){
      //     this.telephoneMoney = this.items.integralPrice
      // }else{
      //     this.telephoneMoney = this.items.amountPrice
      // }
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
        openId: (storageGet('userInfoShare') && storageGet('userInfoShare').openid) || (storageGet('userInfo') && storageGet('userInfo').openid)
      }

      this.disableBtn = true
      let success = async res => {
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
                if (this.records || !(storageGet('userInfoShare') && storageGet('userInfoShare').openid)) {
                  this.$router.replace(`/telephoneExpenses/success?amount=${this.items.originalPrice}`)
                } else {
                  this.$router.replace(`/telephoneExpenses/success?amount=${this.items.originalPrice}&shareOPENID=${this.shareId ? this.shareId : ''}&phone=${this.tel}`)
                }
              }
            },
            cancel: async r => {
              //支付取消
              // this.$router.replace('/oilFilling/list')
              if (r.errMsg == 'chooseWXPay:cancel') {
                let referralOpenId = ''
                if (storageGet('userInfoShare')) {
                  referralOpenId = storageGet('userInfoShare').openid
                }
                let userInfo = storageGet('userInfoShare')
                let data = {
                  refereesOpenId: this.shareId, //  推荐人openid
                  referralOpenId, //    被推荐人openid
                  referralPhone: this.tel,//    充值电话
                  price: this.items.originalPrice, //  充值价格
                  userInfo
                }
                const res = await addPromote(data)
                console.log(res)
                // console.log(this.share_openId)

                console.log('rrr', r);
                Toast('取消支付', 1200);
                // if(this.records||!(storageGet('userInfoShare')&&storageGet('userInfoShare').openid)){
                //   this.$router.replace(`/telephoneExpenses/success?amount=${this.items.originalPrice}`)
                //   }else{
                //   this.$router.replace(`/telephoneExpenses/success?amount=${this.items.originalPrice}&shareOPENID=${this.shareId ? this.shareId : ''}&phone=${this.tel}`)
                // }
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
    &-tips {
      display: flex;
      align-items: center;
      background: #fff9f9;
      border-radius: 4px;
      padding: 6px;
      img {
        width: 18px;
        height: 18px;
      }
      // .left {
      //   margin-left: 10px;
      //   font-style: normal;
      //   font-weight: 400;
      //   font-size: 12px;
      //   text-align: center;
      //   color: #fb584d;
      // }
    }
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
      margin-bottom: 7px;
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
      img {
        width: 24px;
        height: 24px;
      }
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
::v-deep p {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 13px;
}
.scroll {
  width: 320px;
  font-size: 13px;
  // margin: 0 auto;
  margin-left: 10px;
  color: #fb584d;
  white-space: nowrap; /*文字不折行*/
  overflow: hidden; /*文字溢出隐藏*/
}

.scroll span {
  display: inline-block;
  /*inline样式不能使用动画*/
  animation: scroll 8s linear infinite; /*滚动动画*/
}

@keyframes scroll {
  from {
    transform: translateX(320px); /*div多宽就写多宽*/
  }

  to {
    transform: translateX(-100%);
  }
}
</style>
