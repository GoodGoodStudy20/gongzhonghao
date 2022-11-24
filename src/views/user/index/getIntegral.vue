<template>
  <div>
    <div style="font-size:16px;margin:30px auto;text-align:center">输入真实姓名及编号确认校验后自动领取权益</div>
    <Field label="真实姓名：" input-align="right" v-model="real_name" placeholder="请输入真实姓名"></Field>
    <Field label="编号：" input-align="right" v-model="number" placeholder="请输入编号"></Field>
    <div class="btn-box">
      <div class="btn" @click="submintRealName">领取</div>
    </div>
  </div>
</template>

<script>
import { storageGet, storageSet, Debounce } from '@/utils/utils'
import { Field, Cell, Dialog, Button, Toast } from 'vant'
import { threeFourPhone, getUserInfoByPhone } from '@/api/user'
export default {
  name: 'getIntegral',
  components: {
    Field, Cell, 'van-dialog': Dialog.Component
  },
  data() {
    return {
      real_name: '',
      number: ''
    }
  },
  created() {
    let phone = JSON.parse(localStorage.getItem('userPhone'))
    getUserInfoByPhone({ phone }).then(res => {
      let user = res.data || {}
      this.real_name = user.name
    })
  },
  methods: {
    submintRealName: Debounce(function () {
      if (!this.real_name) {
        Toast('请输入真实姓名')
        return
      }
      if (!this.number) {
        Toast('请输入编号')
        return
      }
      let userInfo = storageGet('userInfo')
      let params = {
        realName: this.real_name,
        number: this.number,
        phone: userInfo.bindPhone,
      }
      threeFourPhone(params)
        .then((response) => {
          console.log('请求', response)
          if (response.code == 200) {
            Toast(`恭喜您！成功领取${response.data}权益`)
            this.$router.go(-1)
          } else {
            Toast(res.msg || '信息核验错误或您的权益已经领取了')
          }
        }).catch(err => {
          Toast(err.msg || '信息核验错误或您的权益已经领取了')
        })
    }, 5000),
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
  margin-top: 40px;
  font-size: 16px;
  width: 100%;
  bottom: 0;
  background: #fff;
  padding: 10px 0;
  .btn {
    color: #fff;
    width: 80%;
    height: 40px;
    margin: 0px auto;
    text-align: center;
    line-height: 40px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 5px;
  }
}
</style>