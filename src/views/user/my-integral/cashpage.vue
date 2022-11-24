<template>
  <div class="main">
    <div class="contennier">
      <div class="fens">
        <div class="top-text1">
          <img class="img" src="@/assets/img/integral.png" alt="">
          您有{{countIntegral}}权益
        </div>
        <div class="top-text2">可提现<span>{{countIntegral}}</span>元</div>
      </div>
      <div class="record" @click="cashrecord">提现记录</div>
    </div>
    <div class="cashform">
      <Form @submit="onSubmit">
        <Field border :readonly="isUpdate!=1" v-model="name" name="contactPeopleName" label="真实姓名" maxlength="16" placeholder="请输入名称" :rules="[{ required: true,}]" />

        <!-- <Field v-if="numbershow" border v-model="numbertext" name="numbertext" label="编号" maxlength="20" placeholder="请输入编号" :rules="[{ required: true,validator:validatornumber }]" /> -->
        <Field label="证件类型" v-model="idCodeTypeName" name="idCodeTypeName" readonly @click="showIdcodeType=true"></Field>
        <ActionSheet v-model="showIdcodeType" :actions="actions" @select="onSelect" />
        <Field type="text" border class="Idcodeclss" v-model.trim="idCode" name="idCode" label="证件号码" maxlength="18" placeholder="请输入证件号码" :rules="[{ required: true, validator:validatoridnumber}]" />
        <Field border type="number" v-model.trim="cardNumber" name="cardNumber" label="银行卡号" maxlength="19" placeholder="请输入一类银行卡号" @input="cardInput" :rules="[{ required: true, }]">
          <template #button>
            <!-- <span style="color:#0099ff" @click.stop="chooseBank" v-show="columns&&columns.length">选择银行卡</span> -->
            <Icon name="arrow" @click.stop="showPicker=true" v-show="columns&&columns.length" />
          </template>
        </Field>
        <Field border type="text" v-model="bankName" readonly name="bankName" label="所属银行" maxlength="50" :placeholder="bankNameTips" :rules="[{ required: true,  }]"></Field>
        <Field type="number" border v-model="contactPhone" name="contactPhone" label="预留号码" maxlength="11" placeholder="请输入手机号码" :rules="[{ required: true, validator:validatorphone,}]" />
        <Field @input="checkCashnuber" border type="number" v-model="amount" name="amount" label="提现金额" maxlength="7" placeholder="单笔最少10, 最多95824" :rules="[{ required: true, validator:validatorcash}]">
          <template #right-icon>
            <span style="color:#f14f44" @click.stop="allcash">全部</span>
          </template>
        </Field>
        <div class="btn">
          <Button class="submit-btn" :disabled="!checked || disableBtn" round block type="primary" native-type="submit">确定提现</Button>
        </div>
      </Form>
      <Checkbox v-model="checked" class="yinsi" label-disabled checked-color="#F14F44" icon-size="16px">
        <span>我已阅读并同意</span>
        <span @click="open" style="color:#f14f44;float:right">《隐私条款》</span>
      </Checkbox>
      <!-- tips -->
      <!-- <div class="tipstext">*提交之后3个工作日内到账</div>
      <div class="tipstext">*提交之后不可撤销，请认真核对信息</div>
      <div class="tipstext2">客服电话：<a :href="'tel:'+service_phone" class="phone">{{service_phone}}</a></div>
      <div class="tipstext2">服务时间：工作日 09:30 ~ 18:30</div> -->
      <div class="tipstext2">
        <div style="font-size:16px;margin-bottom:10px">温馨提示</div>
        1、提交之后3个工作日内到账，不含节假日；
        </br><span class="blod">2、真实姓名、手机号码、证件号码、银行卡号需真实完全匹配，否则不能到账；</span>
        </br>3、为保障权益安全，真实姓名不可以更改，如有特殊要求，请咨询客服；
        </br>4、如所属银行名称不能显示或提示年龄不符合，请联系客服处理；
        </br>5、如收到【九华保】权益退回短信，请根据提示内容进行修改并重新提交；
        </br><span class="blod">6、根据央行规定二类卡每天交易限额1万，全年限额20万。如您使用的为二类卡，请检查交易金额是否超限，如超限请更换卡或在限制额度内交易；</span>
        </br>7、客服电话：<a :href="'tel:'+service_phone" class="phone">{{service_phone}}</a>
        </br>8、服务时间：工作日 09:30~18:30，紧急情况请在公众号直接留言。
      </div>

    </div>
    <Pdftext :showpdf.sync="showpdf"></Pdftext>
    <Popup v-model="showPicker" round position="bottom">
      <Picker show-toolbar :columns="columns" value-key="bankName" @cancel="showPicker = false" @confirm="onConfirm" />
    </Popup>
    <van-dialog v-model="showRemindDoalog" :before-close="beforeClose" class="" :showConfirmButton="false">
      <div slot="title" class="header-title">
        <img class="img" src="@/assets/img/tips3.png" alt="">
        <span class="reminder">温馨提示</span>
        <div class="border"></div>
      </div>

      <div class="remind-dialog">
        <!-- <div class=""> -->
        <!-- <div class="title">
          <img class="img" src="@/assets/img/tips3.png" alt="">
          <span class="reminder">温馨提示</span>
        </div> -->

        <div style="padding:10px 0">
          1、提交之后3个工作日内到账，不含节假日；
          </br><span class="blod">2、真实姓名、手机号码、证件号码、银行卡号需真实完全匹配，否则不能到账；</span>
          </br>3、为保障权益安全，真实姓名不可以更改，如有特殊要求，请咨询客服；
          </br>4、如所属银行名称不能显示或提示年龄不符合，请联系客服处理；
          </br>5、如收到【九华保】权益退回短信，请根据提示内容进行修改并重新提交；
          </br><span class="blod">6、根据央行规定二类卡每天交易限额1万，全年限额20万。如您使用的为二类卡，请检查交易金额是否超限，如超限请更换卡或在限制额度内交易；</span>
          </br>7、客服电话服务时间：
          </br>工作日 09:30~18:30，紧急情况请在公众号直接留言。
        </div>
      </div>
      <div slot="default" class="footer">
        <Button class="know-btn" round block @click="knowClick" type="primary">我知道了</Button>
        <Checkbox v-model="checked2" class="next-no-remind" checked-color="#ee0a24"><span class="tixing">下次不再提醒</span></Checkbox>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { Form, Button, Field, Cell, CellGroup, DropdownMenu, DropdownItem, Area, Popup, DatetimePicker, Toast, Dialog, Checkbox, CheckboxGroup, Icon, Picker, ActionSheet } from 'vant'
import { addIntegralWithdrawal, countVouchersInterests, getIntegralWithdrawalList, getBankCardByPhone, getUserInfoByPhone } from '@/api/user'
import { bankCardAttribution } from '@/common/bankCard.js'
import { service_phone } from '@/utils/http'
import { Debounce, storageSet, storageGet, CheckIdCard } from '@/utils/utils'
import Pdftext from '@/components/Pdftext'
export default {
  name: 'cashpage',
  components: {
    Icon, Form, Button, Field, Cell, CellGroup, DropdownMenu, DropdownItem, Area, Popup, DatetimePicker, Toast, Dialog, Checkbox, CheckboxGroup, Pdftext, Picker, ActionSheet, 'van-dialog': Dialog.Component
  },
  props: {},
  data() {
    return {
      bankNameTips: '输入银行卡号后显示所属银行',
      service_phone: service_phone,
      contactPeopleName: '',
      amount: '',
      countIntegral: '',
      cardNumber: '',
      idCode: '',
      contactPhone: '',
      bankName: '',
      show: false,
      // numbershow: '',
      // number: "",
      // numbertext: '',
      checked: false,
      showpdf: false,
      dialogShow: false,
      cardAttrType: '',
      name: '',
      disabled: false,
      showPicker: false,
      isUpdate: 0,//是否可修改姓名
      columns: [],
      idCodeType: '',
      idCodeTypeName: '请选择证件类型',
      showIdcodeType: false,
      actions: [{ name: '大陆居民身份证', id: '0' }, { name: '港澳居民身份证', id: '1' }, { name: '港澳居民内地通行证', id: '2' }],
      disableBtn: false,
      showRemindDoalog: true,
      checked2: false
    };
  },
  created() {
    let isChecked = localStorage.getItem('isChecked')
    if (isChecked) {
      this.showRemindDoalog = false
    }
    this.onload()

  },
  watch: {
    idCode: {
      handler(val, oldVal) {
        if (this.idCode.indexOf('x') !== -1) {
          this.idCode = this.idCode.replace('x', 'X')
        }
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    validatorcash(val) {
      console.log(val, this.countIntegral)
      if (Number(val) >= 10 && Number(val) <= Number(this.countIntegral)) {
        return true
      }
      return false
    },
    clickDiaLog() {
      if (moment().isBefore(moment('2022-10-08'))) {
        Dialog.alert({
          title: '通知',
          message: '温馨提示：因国庆期间放假，9月30日14: 00之前提交的权益30日当天可到账；14: 00之后提交的将在10月8号到账。祝您假期愉快！',
        }).then(() => {
          console.log('3232');

        });
      }
    },
    knowClick() {
      console.log(this.checked2);
      this.showRemindDoalog = false
      if (this.checked2) {
        localStorage.setItem('isChecked', this.checked2)
      }
    },
    beforeClose() { },
    cardInput() {
      if (this.cardNumber == '') {
        this.bankName = ''
        this.cardAttrType = 'error'
        this.bankNameTips = '输入银行卡号后显示所属银行'
        return
      }
      fetch(`https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=${this.cardNumber}%20&cardBinCheck=true`).then(response => {
        return response.json();
      }).then(res => {
        console.log(111, res)
        this.cardAttrType = res;
        if (!res.validated) {
          // this.bankName = ''
          this.cardAttrType = 'error'
          this.bankNameTips = '请换储蓄卡或者输入正确卡号'
          return
        }
        if (res.cardType === "DC") {
          if (bankCardAttribution(res.bank) == 'error') {
            console.log(this.bankName);
          } else {
            this.bankName = bankCardAttribution(res.bank)
          }
          console.log(this.bankName, '44');
        } else {
          this.bankNameTips = '当前交易仅支持储蓄卡'
          this.cardAttrType = 'error'
        }
      })
    },
    open() {
      this.showpdf = true
      this.checked = true
    },
    onSelect(item) {
      this.showIdcodeType = false
      this.idCodeTypeName = item.name
      this.idCodeType = item.id
    },
    checkCashnuber() {
      let exp = /^(\-)*(\d+)\.(\d\d).*$/;
      this.amount = this.amount.replace(exp, '$1$2.$3');
    },
    validatorcash(val) {
      console.log(val, this.countIntegral)
      if (Number(val) >= 10 && Number(val) <= 95824 && Number(val) <= Number(this.countIntegral)) {
        return true
      }
      return false
    },
    validatorphone(val) {
      return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val);
    },
    validatoridnumber(val) {
      if (this.idCodeType == 0) {
        return (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val) && CheckIdCard(val))
      } else {
        return true
      }
    },
    // validatornumber(val) {
    //   if (this.numbershow && !this.numbertext) {
    //     Toast('请输入编号')
    //     return false
    //   }
    //   if (this.numbershow && this.number != this.numbertext) {
    //     Toast('请输入正确的编号')
    //     return false
    //   }
    //   return true
    // },
    onSubmit(value) {
      console.log(1);

      if (this.cardAttrType == 'error') {
        return Toast('请换储蓄卡或者输入正确卡号')
      }



      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let userInfo = storageGet('userInfo')
          addIntegralWithdrawal({ ...value, userPhone: userInfo.bindPhone, idCodeType: this.idCodeType }).then(async res => {
            await done()
            this.disableBtn = false
            if (res.code == 200) {
              Toast('提现已受理')
              this.$router.back(-1)
            } else {
              Toast(res.msg || '提现失败，请检查后稍后再试')
            }
          })
        } else {
          done();
        }
      }
      if (moment().isBefore(moment('2022-10-08'))) {
        Dialog.alert({
          title: '温馨提示',
          message: '因国庆期间放假，9月30日14: 00之前提交的权益30日当天可到账；14: 00之后提交的将在10月8号支付。祝您假期愉快！',
        }).then(() => {
          Dialog.confirm({
            title: '确认提交',
            message: "<span style='color:red'>*提交之后3个工作日内到账</span>",
            beforeClose
          })

        });
      } else {
        Dialog.confirm({
          title: '确认提交',
          message: "<span style='color:red'>*提交之后3个工作日内到账</span>",
          beforeClose
        })
      }
      // Dialog.confirm({
      //   title: '确认提交',
      //   message: "<span style='color:red'>*提交之后3个工作日内到账</span>",
      //   beforeClose
      // })
    },
    cashrecord() {
      this.$router.push({ path: '/user/my-integral/Withdrawalrecord' })
    },
    allcash() {
      console.log(this.countIntegral)
      /// 全部
      this.amount = Number(this.countIntegral) > 90000 ? 90000 : this.countIntegral
    },
    chooseBank() {
      console.log('点了')
      this.showPicker = true
    },
    onConfirm(value) {
      // this.value = value;
      console.log(value)
      if (value) {
        this.contactPhone = value.reservePhone
        this.cardNumber = value.bankCard
        this.bankName = value.bankName
        this.cardInput()
      }
      this.showPicker = false;
    },
    onload() {
      if (storageGet('userInfo') !== null) {
        let userInfo = storageGet('userInfo')
        countVouchersInterests(userInfo.bindPhone).then(res => {
          if (res.code == 200) {
            // 更新
            sessionStorage.setItem('my_integral', res.data.countIntegral ? res.data.countIntegral : 0);
            this.countIntegral = sessionStorage.getItem('my_integral')
          }
        })
      }
      let phone = JSON.parse(localStorage.getItem('userPhone'))
      getBankCardByPhone({ phone: phone }).then(res => {
        this.columns = res.data || []
        let item = this.columns.find(item => {
          return item.isDefault == 1
        })
        if (item) {
          this.onConfirm(item)
        }
      })
      getUserInfoByPhone({ phone }).then(res => {
        let user = res.data || {}
        //判断是否设置隐藏信息
        if (user.isHide) return
        this.idCode = user.idCode || ''
        let list = this.actions.find(item => {
          return item.id == user.idCodeType
        })
        console.log(list)
        if (list) {
          this.onSelect(list)
        }
        this.name = user.name
        this.isUpdate = user.isUpdate
        // this.number = user.number
        // this.numbershow = user.number ? true : false
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  background: #f1f4f8;
}
.common {
  padding: 5px;
  width: 351px;
  margin: 0px auto;
  background: #fff;
  filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
  border-radius: 6px;
}
.contennier {
  @extend .common;
  margin-top: 9px;
  height: 86px;
  display: flex;
  padding: 0 11px;
  justify-content: space-between;
  align-items: center;
  .fens {
    font-size: 16px;
    font-weight: bold;
    .img {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      // margin-left: -11px;
      margin-right: 2px;
    }
    .top-text1 {
      font-weight: bold;
      font-size: 16px;
      color: #333333;
      height: 30px;
      border-radius: 2px 0px 0px 2px;
    }
    .top-text2 {
      color: #333333;
      height: 20px;
      font-weight: bold;
      font-size: 14px;
      span {
        font-size: 18px;
        margin: 0 5px;
        color: #ffb256;
      }
    }
  }
  .record {
    // padding: 10px;
    width: 90px;
    text-align: center;
    height: 34px;
    line-height: 34px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    box-shadow: 0px 3px 10px rgba(188, 0, 0, 0.2);
    border-radius: 57px;
    font-weight: bold;
    font-size: 14px;
    color: #fff;
  }
}
.cashform {
  width: 351px;
  background: #ffffff;
  border-radius: 6px;
  margin: 8px auto;
  padding-bottom: 30px;
  overflow: hidden;
  .yinsi {
    width: 200px;
    margin: 0 auto 34px;
    font-size: 13px;
    color: #333333;
  }
  .tipstext2 {
    padding: 10px;
    font-size: 13px;
    color: #333333;
    line-height: 24px;
    margin-bottom: 6px;
    .phone {
      color: #005de9;
    }
  }

  .btn {
    width: 100%;
    height: 40px;
    margin: 20px auto 17px;
    .submit-btn {
      width: 208px;
      height: 42px;
      margin: 0 auto;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
      border: none;
    }
  }
}
.header-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000;
  position: relative;
  height: 48px;
  width: 100%;
  padding: 0 10px;
  .reminder {
    line-height: 48px;
  }
  .img {
    height: 48px;
    width: 48px;
    position: absolute;
    left: 35px;
  }
}
.border {
  height: 1px;
  background: #eaeaea;
  transform: scaleY(0.5);
}

.remind-dialog {
  position: relative;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  padding: 15px;
  // height: auto;
  height: 55vh;
  overflow: auto;
  // .title {
  //   text-align: center;
  //   font-size: 16px;
  //   font-weight: 700;
  //   color: #000;
  //   position: relative;
  //   height: 48px;
  //   width: 100%;
  //   // border-bottom: 1px solid #eaeaea;
  //   .reminder {
  //     line-height: 48px;
  //   }
  // }

  .img {
    height: 48px;
    width: 48px;
    position: absolute;
    left: 20px;
  }
}
.footer {
  // display: block;
  // height: 50px;
  // position: fixed;
  margin: 5px 0;
}
// .bottom {
//   margin-top: 20px;
//   margin-bottom: 10px;
// }
.blod {
  font-weight: 700;
}
.know-btn {
  width: 180px;
  margin: 0 auto;
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border-radius: 42px;
  height: 40px;
  border: none;
}
.next-no-remind {
  width: 180px;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  .tixing {
    color: #000;
    opacity: 0.5;
    font-size: 12px;
  }
}
::v-deep .van-checkbox__icon {
  font-size: 15px;
}
::v-deep .van-dialog {
  top: 50%;
}
</style>