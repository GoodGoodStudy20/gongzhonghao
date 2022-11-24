<template>
  <van-dialog title="赠送他人" v-model="show" show-cancel-button :before-close="beforeClose" @cancel="cancel" @confirm="cancelOrderConfirm">
    <div class="select-box">
      <Field label="姓名" input-align="right" required v-model="form.giveName" placeholder="姓名"></Field>
      <Field label="手机号" input-align="right" required v-model="form.givePhone" placeholder="手机号" maxlength="11" type="number" oninput="value=value.replace(/[^\d]/g,'')"></Field>
      <Cell required title="数量">
        <Stepper v-model="num" disable-input min="1" :max="total" />
      </Cell>
      <Cell required title="请确认手机号码，赠送之后不可撤销" style="color:red"></Cell>
    </div>
  </van-dialog>
</template>

<script>
import { Toast, Dialog, Field, Cell, Stepper } from 'vant';
import { oilVouchersGive } from '@/api/user'
import { Debounce } from '@/utils/utils'

export default {
  name: 'give',
  props: ['show', 'id', 'phone', 'total'],
  components: { Field, [Dialog.Component.name]: Dialog.Component, Cell, Stepper },
  data() {
    return {
      logisticsNo: '',
      form: {
        giveName: '',
        givePhone: '',
      },
      num: 1
    }
  },
  methods: {
    cancel() {
      this.$emit('update:show', false)
    },
    beforeClose(action, done) {
      done(false)
    },
    cancelOrderConfirm: Debounce(function () {
      if (!this.form.giveName) {
        Toast('请输入姓名!');
        return
      }
      if (!this.form.givePhone) {
        Toast('请输入手机号!');
        return
      }
      if (this.form.givePhone == this.phone) {
        Toast('不可转赠给自己!');
        return
      }
      let param = Object.assign({}, this.form)
      // param.id = this.id.slice(0, this.num)
      param.id = String(this.id)
      oilVouchersGive(param).then(res => {
        if (res.code == 200) {
          Toast.success('操作成功!');
          this.cancel()
          this.$parent.onload()
        } else {
          Toast.fail('操作失败')
        }
      })
    })
  }
}
</script>

<style scoped>
.select-box {
  margin: 10px 0;
}
</style>