<template>
  <div class="box">
    <div class="form-box">
      <Form @submit="onSubmit">
        <Field border v-model="name" name="name" label="姓名" :readonly="isUpdate!=1" :rules="[{ required: true, }]" />

        <!-- <Field v-if="numbershow" border v-model="numbertext" name="numbertext" label="编号" placeholder="请输入编号" :rules="[{ required: true,validator:validatornumber }]" /> -->
        <Field label="证件类型" v-model="idCodeTypeName" name="idCodeTypeName" readonly @click="showIdcodeType=true"></Field>
        <ActionSheet v-model="showIdcodeType" :actions="actions" @select="onSelect" />
        <Field border v-model.trim="idCode" name="idCode" label="身份证号码" maxlength="18" :rules="[{ required: true,validator:validatoridnumber }]" />
        <Field border v-model.trim="cardNumber" name="cardNumber" @change="cardInput" label="银行卡号" maxlength="19" placeholder="请输入一类银行卡号" :rules="[{ required: true, }]">
          <template #button>
            <Icon name="arrow" @click.stop="showPicker=true" v-show="columns&&columns.length" />
            <!-- <span style="color:#0099ff">选择银行卡</span> -->
          </template>
        </Field>
        <Field border v-model="bankName" readonly type="text" name="bankName" label="所属银行" :placeholder="bankNameTips" :rules="[{ required: true, }]"></Field>
        <Field type="number" border v-model="contactPhone" name="contactPhone" label="预留号码" maxlength="11" :rules="[{ required: true,validator:validatorphone }]" />
        <Field border v-model="amount" name="amount" label="提现金额" placeholder="单笔最少10" :rules="[{ required: true, validator:validatorcash}]"></Field>
        <div class="btn-box">
          <Button round block type="info" :disabled="disableBtn" class="detailsbutton">确认重新提交</Button>
        </div>
      </Form>
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
      <Popup v-model="showPicker" round position="bottom">
        <Picker show-toolbar :columns="columns" value-key="bankName" @cancel="showPicker = false" @confirm="onConfirm" />
      </Popup>
    </div>
  </div>
</template>

<script>
import { bankCardAttribution } from '@/common/bankCard.js'
import { service_phone } from '@/utils/http'
import { storageGet, storageSet, CheckIdCard } from '@/utils/utils'
import { Form, Button, Field, Cell, CellGroup, DropdownMenu, DropdownItem, Area, Popup, DatetimePicker, Toast, ActionSheet, Dialog, Picker, Icon } from 'vant'
import { selectById, getUserInfoByPhone, modifyIntegralWithdrawal, getBankCardByPhone, countVouchersInterests } from '@/api/user'
export default {
  name: 'modifypage',
  components: {
    Form, Button, Field, Cell, CellGroup, DropdownMenu, DropdownItem, Area, Popup, DatetimePicker, Toast, ActionSheet, Dialog, Picker, Icon
  },
  props: {},
  data() {
    return {
      service_phone: service_phone,
      bankNameTips: '输入银行卡号后显示所属银行',
      amount: '',
      amount2: '',
      countIntegral: '',
      cardNumber: '',
      idCode: '',
      contactPhone: '',
      bankName: '',
      // number: '',
      // numbershow: '',
      name: '',
      // numbertext: '',
      cardType: '',
      showPicker: false,
      columns: [],
      idCodeType: '',
      idCodeTypeName: '请选择证件类型',
      showIdcodeType: false,
      isUpdate: 0,
      actions: [{ name: '大陆居民身份证', id: '0' }, { name: '港澳居民身份证', id: '1' }, { name: '港澳居民内地通行证', id: '2' }],
      disableBtn: false,
    };
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
    onload() {
      console.log('32133');
      if (storageGet('userInfo') !== null) {
        let userInfo = storageGet('userInfo')
        countVouchersInterests(userInfo.bindPhone).then(res => {
          if (res.code == 200) {
            // 更新
            console.log('34343');
            sessionStorage.setItem('my_integral', res.data.countIntegral ? res.data.countIntegral : 0);
            this.countIntegral = sessionStorage.getItem('my_integral')
          }
        })
      }
    },
    validatorcash(val) {
      if (Number(val) >= 10 && Number(val) <= Number(this.NumberAdd([Number(this.countIntegral), Number(this.amount2)]))) {
        return true
      }
      return false
    },
    cardInput() {
      if (this.cardNumber == '') {
        this.bankName = ''
        this.cardType = 'error'
        this.bankNameTips = '输入银行卡号后显示所属银行'
        return
      }
      fetch(`https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=${this.cardNumber}%20&cardBinCheck=true`).then(response => {
        return response.json();
      }).then(res => {
        console.log(111, res)
        this.cardType = res;
        if (!res.validated) {
          this.bankName = ''
          this.cardType = 'error'
          this.bankNameTips = '请换储蓄卡或者输入正确卡号'
          return
        }
        if (res.cardType === "DC") {
          this.bankName = bankCardAttribution(res.bank)
        } else {
          this.bankNameTips = '当前交易仅支持储蓄卡'
          this.cardType = 'error'
        }
      })
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
    onSelect(item) {
      this.showIdcodeType = false
      this.idCodeTypeName = item.name
      this.idCodeType = item.id
    },
    onConfirm(value) {
      console.log(value)
      if (value) {
        this.contactPhone = value.reservePhone
        this.cardNumber = value.bankCard
        this.bankName = value.bankName
        this.cardInput()
      }
      this.showPicker = false;
    },
    onSubmit() {
      if (this.cardType == 'error') {
        Toast('请换储蓄卡或者输入正确卡号')
        return
      }

      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          this.disableBtn = true
          let params = {
            contactPeopleName: this.name,
            amount: this.amount,
            bankName: this.bankName,
            cardNumber: this.cardNumber,
            contactPhone: this.contactPhone,
            idCode: this.idCode,
            id: this.$route.query.id,
            // number: this.numbertext,
            idCodeType: this.idCodeType
          }
          modifyIntegralWithdrawal(params).then(async res => {
            await done()
            this.disableBtn = false
            if (res.code == 200) {
              this.$router.push({ path: '/user/my-integral/index' })
            } else {
              Toast(res.msg || '修改失败，请检查后稍后再试')
            }
          })
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '确认提交',
        message: "<span style='color:red'>*提交之后3个工作日内到账</span>",
        beforeClose
      })
    },
  },
  created() {
    let params = {
      id: this.$route.query.id
    }
    let userInfo = storageGet('userInfo')
    getUserInfoByPhone({ phone: userInfo.bindPhone }).then(res => {
      let user = res.data || {}
      //判断是否设置隐藏信息
      if (user.isHide) return
      // this.name = user.name
      this.isUpdate = user.isUpdate
      // this.number = user.number
      // this.numbershow = user.number ? true : false
    })
    selectById(params).then(res => {
      if (res.code == 200) {
        const item = res.data
        this.amount = item.amount
        this.amount2 = item.amount
        this.name = item.contactPeopleName
        // this.countIntegral = item.countIntegral
        this.cardNumber = item.cardNumber
        this.idCode = item.idCode
        this.contactPhone = item.contactPhone
        this.bankName = item.bankName
        this.idCodeType = item.idCodeType
        this.idCodeTypeName = item.idCodeType == 0 ? '大陆居民身份证' : item.idCodeType == 1 ? '港澳居民身份证' : item.idCodeType == 2 ? '港澳居民内地通行证' : '大陆居民身份证'
      }
    })
    this.onload()
    console.log(this.countIntegral);
    getBankCardByPhone({ phone: userInfo.bindPhone }).then(res => {
      this.columns = res.data || []
      let item = this.columns.find(item => {
        return item.isDefault == 1
      })
      if (item) {
        this.onConfirm(item)
      }
    })
  }
};
</script>
<style  scoped lang="scss">
.box {
  width: 100vw;
  min-height: 100vh;
  padding: 12px;
  background: #f1f4f8;
  .form-box {
    overflow: hidden;
    background: #ffffff;
    border-radius: 6px;
    padding-bottom: 40px;
  }
  .btn-box {
    margin: 20px 0 60px;
    width: 100%;
    .detailsbutton {
      margin: 0 auto;
      width: 208px;
      height: 42px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
      border-radius: 57px;
      border: none;
    }
  }
  .tipstext2 {
    padding: 10px;
    font-size: 13px;
    color: #333333;
    line-height: 20px;
    margin-bottom: 6px;
    .phone {
      color: #005de9;
    }
  }
  .blod {
    font-weight: 700;
  }
}
</style>