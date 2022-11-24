<template>
  <div>
    <Field input-align="right" v-model="userInfo.bindPhone" name="手机号码" label="手机号码" readonly placeholder="手机号码" />
    <div v-if="user.id">
      <Form @submit="onSubmit">
        <Field input-align="right" v-model="form.name" name="姓名" label="姓名" placeholder="请填写姓名" readonly />
        <Field input-align="right" v-if="!user.number" v-model="form.number" name="工号" label="工号" placeholder="请填写工号" readonly />
        <Cell v-else title="工号" :value="number"></Cell>
        <Cell title="证件类型" :value="idCodeTypeName" @click="type == 2 ? showIdcodeType=true : ''"></Cell>
        <ActionSheet v-model="showIdcodeType" :actions="actions" @select="onSelect" />
        <Field input-align="right" v-model="form.idCode" name="证件号码" label="证件号码" placeholder="请填写证件号码" :readonly="type == 1" maxlength="18" />
        <div style="margin: 16px;">
          <Button class="btn" block type="primary" native-type="submit" v-show="type == 2">提交</Button>
        </div>
      </Form>
      <div style="margin: 16px;">
        <Button class="btn" block type="primary" @click="changeInfo" v-show="type == 1">修改</Button>
      </div>
    </div>
    <Cell icon="debit-pay" title="银行卡" :value='`${total}张`' is-link to="/user/set/bankList" v-show="type == 1"></Cell>
    <Cell :icon="user.isHide==1?'bulb-o':'delete-o'" :title="user.isHide==1?'激活':'注销'" is-link @click="hideClick" style="margin-top:15px"></Cell>
  </div>
</template>

<script>
import { Form, Field, Button, Cell, Toast, ActionSheet, Dialog } from 'vant';
import { getUserInfoByPhone, updateWlynUser, getBankCardByPhone, updateByUserIsHide } from '@/api/user'
import { Debounce, storageGet, CheckIdCard } from '@/utils/utils'
export default {
  name: 'setUser',
  components: { Form, Field, Button, Cell, ActionSheet },
  data() {
    return {
      type: '1',
      form: {
        id: '',
        phone: '',
        name: '',
        number: '',
        idCode: '',
        idCodeType: ''
      },
      userInfo: {},
      user: {},
      total: 0,
      idCodeTypeName: '请选择证件类型',
      showIdcodeType: false,
      actions: [{ name: '大陆居民身份证', id: '0' }, { name: '港澳居民身份证', id: '1' }, { name: '港澳居民内地通行证', id: '2' }]
    }
  },
  watch: {
    $route(to, from) {
      this.type = this.$route.meta.type
      if (this.type == 1) {
        this.onload()
      }
    }
  },
  computed: {
    number() {
      let str2 = this.user.number.replace(this.user.number.slice(1, -1), '****')
      return str2
    }
  },
  created() {
    this.userInfo = storageGet('userInfo') || {}
    console.log(this.userInfo)
    this.type = this.$route.meta.type
    console.log(this.type)
    if (this.type == 1) {
      this.onload()
    }
  },
  methods: {
    onload() {
      let phone = JSON.parse(localStorage.getItem('userPhone'))
      getUserInfoByPhone({ phone }).then(res => {
        this.user = res.data || {}
        //判断是否设置隐藏信息
        if (this.user.isHide) return
        this.form = {
          id: this.user.id,
          phone: this.user.phone,
          name: this.user.name,
          number: this.user.number,
          idCode: this.user.idCode,
          idCodeType: this.user.idCodeType,
        }
        let list = this.actions.find(item => {
          return item.id == this.user.idCodeType
        })
        console.log(list)
        if (list) {
          this.onSelect(list)
        }
      })
      getBankCardByPhone({ phone: phone }).then(res => {
        this.total = res.data.length || 0
      })
    },
    changeInfo() {
      this.$router.push('/user/set/user')
    },
    onSelect(item) {
      this.showIdcodeType = false
      this.idCodeTypeName = item.name
      this.form.idCodeType = item.id
    },
    onSubmit: Debounce(function () {
      console.log(!CheckIdCard(this.form.idCode))
      if (this.form.idCodeType == 0 && (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.form.idCode) || !CheckIdCard(this.form.idCode))) {
        Toast('请输入正确的身份证号')
        return
      }
      updateWlynUser(this.form).then(res => {
        if (res.code == 200) {
          Toast('修改成功')
          this.$router.go(-1)
        } else {
          Toast(res.msg || '修改失败')
        }
      })
    }),
    hideClick() {
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          let param = {
            id: this.user.id,
            isHide: this.user.isHide == 1 ? 0 : 1
          }
          updateByUserIsHide(param).then(async res => {
            await done()
            if (res.code == 200) {
              Toast('操作成功')
              location.reload()
            } else {
              Toast(res.msg || '操作失败')
            }
          })
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '提示',
        message: `<span style='color:red'>确定要${this.user.isHide == 1 ? '激活' : '注销'}当前账号吗？</span>`,
        beforeClose
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border-radius: 8px;
  border: none;
}
</style>