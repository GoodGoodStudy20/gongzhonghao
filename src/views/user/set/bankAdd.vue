<template>
  <div>
    <Form @submit="onSubmit">
      <Field v-model.trim="bankCard" name="bankCard" label="银行卡号" :rules="[{ required: true}]" @input="cardInput" placeholder="请填写银行卡号" />
      <Field v-model="bankName" name="bankName" label="所属银行" :placeholder="bankNameTips" :rules="[{ required: true}]" />
      <Field type="tel" v-model.number="reservePhone" name="reservePhone" label="预留手机号" placeholder="请填写预留手机号" :rules="[{ required: true, validator:validatorphone}]" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" />
      <Cell>
        <template #title>
          <Checkbox v-model="isDefault" name="isDefault">设为默认</Checkbox>
        </template>
      </Cell>
      <div style="margin: 16px;">
        <Button round block type="info" native-type="submit">保存</Button>
      </div>
    </Form>
    <Cell v-for="item in list" :key="item" :title="item" title-style="color:red"></Cell>
  </div>
</template>

<script>
import { Form, Field, Button, Cell, Toast, Switch, Checkbox } from 'vant';
import { addBankCard } from '@/api/user'
import { Debounce } from '@/utils/utils'
import { bankCardAttribution } from '@/common/bankCard.js'
export default {
  name: 'userBankAdd',
  components: { Form, Field, Button, Cell, Switch, Checkbox },
  data() {
    return {
      isDefault: false,
      reservePhone: '',
      bankCard: '',
      bankNameTips: '输入银行卡号后显示所属银行',
      bankName: '',
      cardAttrType: '',
      list: ['*只能添加本人名下的银行卡', '*只能添加I类储蓄卡']
    }
  },
  created() {

  },
  methods: {
    cardInput() {
      if (this.bankCard == '') {
        this.bankName = ''
        this.cardAttrType = 'error'
        this.bankNameTips = '输入银行卡号后显示所属银行'
        return
      }
      this.bankCard = this.bankCard.replace(/\s*/g, "");
      fetch(`https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=${this.bankCard}%20&cardBinCheck=true`).then(response => {
        return response.json();
      }).then(res => {
        console.log(111, res)
        this.cardAttrType = res;
        if (!res.validated) {
          this.bankName = ''
          this.cardAttrType = 'error'
          this.bankNameTips = '请换储蓄卡或者输入正确卡号'
          return
        }
        if (res.cardType === "DC") {
          this.bankName = bankCardAttribution(res.bank)
        } else {
          this.bankNameTips = '当前交易仅支持储蓄卡'
          this.cardAttrType = 'error'
        }
      })
    },

    validatorphone(val) {
      return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val);
    },
    onSubmit: Debounce(function (form) {
      let data = Object.assign({}, form)
      data.isDefault = Number(this.isDefault)
      data.phone = JSON.parse(localStorage.getItem('userPhone'))
      console.log(111, data)
      addBankCard(data).then(res => {
        if (res.code == 200) {
          Toast('添加成功')
          this.$router.go(-1)
        } else {
          Toast('添加失败')
        }
      })
    })
  }
}
</script>