<template>
  <div class="box">
    <div class="Swipe-box">
      <Swipe :autoplay="3000" indicator-color="white" class="swipe" indicatorColor="#fff">
        <SwipeItem v-for="item in ImgList" :key="item.id">
          <img style="height:100%;width:100%;border-radius: 8px;" :src="item.icon" @click="jumpUrl(item)" />
        </SwipeItem>
      </Swipe>
    </div>
    <div class="content" v-if="isContract===null || isContract==0 || showRecharge">
      <div class="phone-title">开通手机号</div>
      <Field placeholder="请输入手机号" v-model="phone" type="tel" maxlength="11" border>
        <template #right-icon>
          <!-- <span>{{isPhone==1?'移动号码':isPhone==2?'电信号码':isPhone==3?'联通号码':''}}</span> -->
          <span>{{phoneType}}</span>
        </template>
      </Field>
      <div class="rule-title">自动续充话费规则</div>
      <Cell is-link @click="showPhoneRule" border>
        <template #title>
          <span class="custom-title" v-if="phoneType"><span v-html="toThousands(title1)"></span><span v-if="title1 || title2">,</span><span v-html="toThousands(title2)"></span></span>
          <span class="default-title" v-if="!title1 && !title2">请选择自动续充话费规则</span>
        </template>
      </Cell>
      <div class="submit" @click="submit" :disabled='disableBtn' v-if="isContract===null || isContract==0 ">确认开通</div>
      <div class="btn-container">
        <div class="close" @click="closeRecharge" :disabled='disableBtn' v-if="isContract==1">关闭自动充</div>
        <div class="sure" @click="submit" :disabled='disableBtn' v-if="isContract==1">确认保存</div>
      </div>
      <!-- <div class="submit">修改</div>
      <div class="submit">确认保存</div> -->
      <!-- <div class="agreement">
        查看<span class="show">《自动续费充值服务协议》</span>
      </div> -->
    </div>
    <div class="rule-detail" v-if="isContract==1 && !showRecharge">
      <div class="rule-top">
        <div class="top-left">
          <VanImage round style="width:36px;height:36px;margin-right:10px" :src="!userInfo.headImgUrl?userInfoNull.headImgUrl:userInfo.headImgUrl" fit="cover" />
          <div>开通日期：{{autoRechargeData.updateTime}}</div>
        </div>
        <div style="color: #FB584D" @click="editRecharge">修改</div>
      </div>
      <div class="phone">{{autoRechargeData.rechargeAccount}}</div>
      <div class="payment-rule">
        <span><span class="title">扣款规则：</span> </span><span>每月<span class="money">{{autoRechargeData.deductionTime}}</span>日，自动充值<span class="money">{{autoRechargeData.price}}</span>元</span>
      </div>
      <div class="payment-type">
        <span class="title">扣款方式：</span><span>扣除权益账户金额</span>
      </div>
    </div>
    <div class="problem">
      <div class="common-problem">常见问题</div>
      <Collapse v-model="activeNames" :border="false">
        <CollapseItem name="1">
          <template #title>
            <div class="problem-title">
              <img src="@/assets/img/ask.png" alt="">
              <div class="title">话费自动充扣款规则</div>
            </div>
          </template>
          <div class="problem-answer">
            <img src="@/assets/img/answer.png" alt="">
            <div class="title">每个月根据您设置的日期和金额扣款。如您设置了每月1日，自动充值100元，就会在每个月1号当天24点前从权益账户中自动扣款94元，充值到您的手机号码中。</div>
          </div>
        </CollapseItem>
        <CollapseItem name="2">
          <template #title>
            <div class="problem-title">
              <img src="@/assets/img/ask.png" alt="">
              <div class="title">开通后怎么扣款？从哪里扣款？</div>
            </div>
          </template>
          <div class="problem-answer">
            <img src="@/assets/img/answer.png" alt="">
            <div class="title">开通后根据您设置的日期和金额决定。扣款从权益账户中扣除，权益不足则扣费失败，不做充值。</div>
          </div>
        </CollapseItem>
        <CollapseItem name="3">
          <template #title>
            <div class="problem-title">
              <img src="@/assets/img/ask.png" alt="">
              <div class="title">如何修改或关闭自动充值设置？</div>
            </div>
          </template>
          <div class="problem-answer">
            <img src="@/assets/img/answer.png" alt="">
            <div class="title">修改：开通后可在设置规则页面点击修改，修改后点击保存即可；
              关闭：开通后可在设置规则页面点击修改，点击关闭自动充即可。</div>
          </div>
        </CollapseItem>
      </Collapse>
    </div>
    <Popup v-model="show" position="bottom">
      <Picker show-toolbar title="设置扣款规则" :columns="columns" value-key="value" @confirm="onConfirm" @cancel="onCancel"></Picker>
    </Popup>
  </div>
</template>
<script>
import { Popup, Toast, Dialog, Cell, Picker, Swipe, SwipeItem, Field, Collapse, CollapseItem, Image as VanImage } from 'vant';
import { getProductConfigInfo, getAutoRechargeByPhone, addAutoRecharge, updateAutoRecharge, updateIsContract, checkPhone, getJsJDK } from '@/api/user'
import { Debounce, storageSet, storageGet } from '@/utils/utils'
import { searchTel } from '@/utils/http'
export default {
  name: '',
  components: {
    Popup, 'van-dialog': Dialog.Component, Cell, Picker, Swipe, SwipeItem, Field, Collapse, CollapseItem, VanImage
  },
  data() {
    return {
      ImgList: [
        { icon: require('@/assets/img/bgcImg.png') },
        { icon: require('@/assets/img/bgcImg2.png') }
      ],
      activeNames: [],
      phone: '',
      show: false,
      // isPhone: '',
      phoneType: '',
      userInfo: {},
      bindPhone: '',
      productList: [],
      title1: '',
      title2: '',
      ChinaMobileId: '',//移动Id
      ChinaUnionId: '',//联通Id
      ChinaTelcomId: '',//电信Id
      columns: [
        // 第一列
        {
          values: ['每月1日', '每月2日', '每月3日', '每月4日', '每月5日', '每月6日', '每月7日', '每月8日', '每月9日', '每月10日', '每月11日', '每月12日', '每月13日', '每月14日', '每月15日', '每月16日', '每月17日', '每月18日', '每月19日', '每月20日', '每月21日', '每月22日', '每月23日', '每月24日', '每月25日', '每月26日', '每月27日', '每月28日'],
          // defaultIndex: 1,
        },
        // 第二列
        {
          // values: ['自动充值50元', '自动充值100元', '自动充值200元', '自动充值300元'],
          values: [],
          // defaultIndex: 1,
        },
      ],
      indexList: [],
      isContract: '',
      disableBtn: false,
      autoRechargeData: {},
      showRecharge: false,
      userInfoNull: {
        headImgUrl: 'http://pic.616pic.com/ys_bnew_img/00/18/92/MM8TtBRjOv.jpg',
        nickname: '请点击登录'
      },
      mid: ''
    };
  },
  watch: {
    async phone(val) {
      if (val && val.length === 11) {
        // searchTel('https://www.baifubao.com/callback?cmd=1059&callback=phone&phone=' + val).then(res => {
        searchTel('https://www.mxnzp.com/api/mobile_location/aim_mobile?app_id=eppmhktrjlndmnop&app_secret=MWV2Snp5RVdkUnBBTUNQRlBuTnVTdz09&mobile=' + val).then(res => {
          // searchTel('http://apis.juhe.cn/mobile/get?key=165b6e290ba98e77c51bd1b522061da8&phone=' + val).then(res => {
          // searchTel('https://cx.shouji.360.cn/phonearea.php?number=' + val).then(res => {
          // searchTel2(url, data, config).then(res => {
          // checkPhone({ phone: val }).then(res => {
          let data = res
          console.log(res);

          if (res.code == 1) {
            this.phoneType = res.data.province + res.data.sp
            if (this.phoneType.indexOf('移动') > -1) {
              this.$nextTick(() => {
                this.getProductConfigInfo(this.ChinaMobileId)
              })

            }
            if (this.phoneType.indexOf('联通') > -1) {
              this.getProductConfigInfo(this.ChinaUnionId)
            }
            if (this.phoneType.indexOf('电信') > -1) {
              this.getProductConfigInfo(this.ChinaTelcomId)
            }
            this.columns[1].values.defaultIndex = 0
          } else {
            let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/; //移动
            let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|18[56])\d{8}$/; //联通
            let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199|191|193|)\d{8}$/; //电信
            if (isChinaMobile.test(val)) {
              this.phoneType = '移动'
              this.getProductConfigInfo(this.ChinaMobileId)
            } else if (isChinaUnion.test(val)) {
              this.phoneType = '联通'
              this.getProductConfigInfo(this.ChinaUnionId)
            } else if (isChinaTelcom.test(val)) {
              this.phoneType = '电信'
              this.getProductConfigInfo(this.ChinaTelcomId)
            } else {
              this.phoneType = ''
              return false
            }
            this.columns[1].values.defaultIndex = 0
          }
        })
        // let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/; //移动
        // let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|18[56])\d{8}$/; //联通
        // let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199|191|193|)\d{8}$/; //电信
        // if (isChinaMobile.test(val)) {
        //   this.isPhone = 1
        // } else if (isChinaUnion.test(val)) {
        //   this.isPhone = 3
        // } else if (isChinaTelcom.test(val)) {
        //   this.isPhone = 2
        // } else {
        //   this.isPhone = ''
        //   return false
        // }
      } else {
        this.phoneType = ''
      }
    },
  },
  computed: {

  },
  methods: {
    async getProductConfigInfo(id) {
      await getProductConfigInfo({ id }).then(res => {
        let list = res.data && res.data.productAttributeConfigVOList
        list.forEach(item => {
          this.productList.push({ value: `自动充值${item.originalPrice}元`, id: item.id })
        })
        this.columns[1].values = this.productList
        // .map(item => {
        //   // return `自动充值${item.value}元`
        //   return {
        //     value: `自动充值${item.value}元`
        //   }
        // })
      })
    },
    async getAutoRechargeByPhone() {
      await getAutoRechargeByPhone({ userPhone: this.bindPhone }).then(res => {
        if (res.code !== 200) return
        this.isContract = res.data.isContract
        this.autoRechargeData = res.data || {}
        if (this.isContract || this.isContract == 0) {
          this.phone = this.autoRechargeData.rechargeAccount
          // this.deductionTime = this.autoRechargeData.deductionTime
          this.title1 = `每月${this.autoRechargeData.deductionTime}日`
          this.title2 = `自动充值${this.autoRechargeData.price}元`
        }
      })
    },
    submit() {
      if (!this.phoneType) {
        Toast('请输入正确的手机号码')
        return
      }
      if (!this.title1 || !this.title1) {
        Toast('请选择扣款规则')
        return
      }
      let params = {}
      if (this.indexList && this.indexList[1]) {
        params.productId = this.columns[1].values[this.indexList[1]].id
      } else {
        params.productId = this.autoRechargeData.productId
      }
      params.mid = this.mid
      // params.productId = this.indexList && this.columns[1].values[this.indexList[1]].id || this.autoRechargeData.productId
      // params.deductionTime = this.indexList && this.indexList[0] && this.columns[0].values[this.indexList[0]].replace(/[^\d]/g, '') || this.deductionTime
      // params.price = this.indexList && this.indexList[1] && this.columns[1].values[this.indexList[1]].replace(/[^\d]/g, '') || this.price
      params.deductionTime = this.title1.replace(/[^\d]/g, '') || this.deductionTime
      params.price = this.title2.replace(/[^\d]/g, '') || this.price
      params.rechargeAccount = this.phone
      params.userPhone = this.bindPhone
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let success = async res => {
            await done()
            this.disableBtn = false
            if (res.code != 200) {
              Toast(res.msg || '开通失败')
              // this.$router.push({ path: '/login/index' })
              return
            }
            this.$router.push({ path: '/telephoneExpenses' })
          }
          if (this.isContract === null) {
            addAutoRecharge(params).then(success)
          } else {
            params.isContract = 1
            params.id = this.autoRechargeData.id
            updateAutoRecharge(params).then(success)
          }

        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '确认开通',
        confirmButtonColor: '#F14F44',
        beforeClose
      })
    },
    closeRecharge() {
      let params = {
        id: this.autoRechargeData.id,
        isContract: 0
      }
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let success = async res => {
            await done()
            this.disableBtn = false
            if (res.code != 200) {
              Toast(res.msg || '开通失败')
              return
            }
            this.$router.push({ path: '/telephoneExpenses' })
          }
          updateAutoRecharge(params).then(success)
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '确认关闭',
        confirmButtonColor: '#F14F44',
        beforeClose
      })
    },
    editRecharge() {
      this.showRecharge = true
      this.getAutoRechargeByPhone()
    },
    toThousands(str = '') {
      var re = /(\d+)/g;
      var newstr = str.replace(re, function (v) {
        return v.fontcolor('#FB584D')
      });
      return newstr;
    },
    showPhoneRule() {
      if (this.phoneType) {
        this.show = true
      } else {
        Toast('请输入正确的手机号码')
      }
    },
    onConfirm(value, index) {
      this.show = false
      this.indexList = index
      this.title1 = value[0]
      this.title2 = value[1].value
    },
    onCancel() {
      this.show = false
    },
  },
  created() {
    getJsJDK()
    if (storageGet('ChinaMobileId')) {
      this.ChinaMobileId = storageGet('ChinaMobileId')
    }
    if (storageGet('ChinaUnionId')) {
      this.ChinaUnionId = storageGet('ChinaUnionId')
    }
    if (storageGet('ChinaTelcomId')) {
      this.ChinaTelcomId = storageGet('ChinaTelcomId')
    }
    this.mid = storageGet('M_mid')
    this.userInfo = storageGet('userInfo')
    this.bindPhone = this.userInfo.bindPhone
    this.Itemcarlist = this.Itemlist
    this.getAutoRechargeByPhone()
    this.deductionTime = this.title1.replace(/[^\d]/g, '')
    this.price = this.title2.replace(/[^\d]/g, '')
  },
  mounted() { },
  destroyed() {
  }
};
</script>
<style lang="scss" scoped>
.box {
  padding: 0 15px;
  background: #f6f7f9;
  min-height: 100vh;
  height: auto;
  .Swipe-box {
    padding-top: 10px;
  }
  .content {
    background: #ffffff;
    border-radius: 6px;
    padding: 12px;
    .phone-title {
      font-size: 15px;
      line-height: 21px;
      color: #000000;
      opacity: 0.9;
      margin-bottom: 20px;
    }
    ::v-deep .van-cell {
      padding-left: 0;
    }
    ::-webkit-input-placeholder {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #000000;
      opacity: 0.3;
    }
    :-moz-placeholder {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #000000;
      opacity: 0.3;
    }
    ::-moz-placeholder {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #000000;
      opacity: 0.3;
    }
    :-ms-input-placeholder {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #000000;
      opacity: 0.3;
    }
    ::-ms-input-placeholder {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #000000;
      opacity: 0.3;
    }
    ::placeholder {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #000000;
      opacity: 0.3;
    }
    ::v-deep .van-field__control {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #000000;
    }
    .rule-title {
      margin-top: 20px;
      font-size: 15px;
      line-height: 21px;
      color: #000000;
      opacity: 0.9;
    }
    .custom-title {
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      /* identical to box height */
      color: #000000;
      opacity: 0.85;
    }
    .default-title {
      color: #000000;
      opacity: 0.3;
    }
  }
  .rule-detail {
    background: #ffffff;
    border-radius: 6px;
    padding: 12px;
    .rule-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: #000000;
      opacity: 0.6;
      .top-left {
        display: flex;
        // justify-content: space-between;
        align-items: center;
      }
    }
    .phone {
      font-weight: 400;
      font-size: 20px;
      line-height: 28px;
      /* identical to box height */
      color: #000000;
      opacity: 0.85;
      margin: 10px 0;
    }
    .payment-rule {
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 10px;
      .title {
        color: #000000;
        opacity: 0.5;
      }
      .money {
        color: #fb584d;
      }
    }
    .payment-type {
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.85);
      .title {
        color: #000000;
        opacity: 0.5;
      }
    }
  }
  .submit {
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 100px;
    padding: 12px 10px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    margin-top: 20px;
  }
  .btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .close {
      border: 1px solid #fb584d;
      border-radius: 100px;
      padding: 12px 10px;
      font-size: 16px;
      color: #fb584d;
      text-align: center;
      margin-top: 20px;
      width: 150px;
    }
    .sure {
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 100px;
      padding: 12px 10px;
      font-size: 16px;
      color: #fff;
      text-align: center;
      margin-top: 20px;
      width: 150px;
    }
  }

  .agreement {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.7);
    .show {
      color: #237bff;
    }
  }
  .problem {
    background: #ffffff;
    border-radius: 6px;
    padding: 12px;
    margin-top: 10px;
    .common-problem {
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      opacity: 0.9;
    }
    ::v-deep .van-cell {
      padding-left: 0;
    }
    ::v-deep .van-collapse-item__content {
      padding-left: 0;
    }
    .problem-title {
      display: flex;
      align-items: center;
      .title {
        margin-left: 4px;
        font-weight: 530;
        font-size: 14px;
        color: #000000;
        opacity: 0.9;
      }
      img {
        width: 22px;
        height: 22px;
      }
    }
    .problem-answer {
      display: flex;
      align-items: flex-start;
      .title {
        margin-left: 4px;
        font-weight: 530;
        font-size: 14px;
        color: #000000;
        opacity: 0.9;
      }
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
}
</style>