<template>
  <div class="login-box">
    <div class="welcome">登录即可享受加油、洗车等优惠服务</div>
    <div class="input-box">
      <Field v-model="name" placeholder="请输入姓名" v-show="showNumber" />
      <Field v-model="number" placeholder="请输入工号" v-show="showNumber" />
      <Field v-model="form.phone" :class="{'phone-field':form.phone}" type="tel" maxlength="11" clearable oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入手机号码" />
      <Field v-model="form.code" :class="{'code-field':form.code}" center clearable maxlength="6" type="number" border placeholder="请输入短信验证码">
        <template #button>
          <Button size="small" class="code-btn" :class="{'noPhone':!form.phone}" @click="subVerf" type="primary" :disabled="verfThrottling || !form.phone">{{verfText}}</Button>
        </template>
      </Field>
      <Field readonly />
    </div>
    <div class="sub-button" :style="islogin?'opacity:1;':'opacity:.5;'" @click="subLogin">登录</div>
    <p class="login-pdf">登录即表示同意<span @click="showpdf=true" style="color:#f14f44">《隐私协议》</span></p>
    <!-- <div @click="showNumber = !showNumber" class="show-number">{{showNumber ? '<<普通登录' : '工号登录>>'}}</div> -->
    <div class="policy_tip" v-show="hideShow">
      <p>©共幸科技（深圳）有限公司</p>
      <p>
        <Icon name="phone-o" size="14" style="margin-right:5px" />
        <a :href="'tel:'+service_phone">{{service_phone}}</a>
      </p>
    </div>
    <Pdftext :showpdf.sync="showpdf"></Pdftext>
  </div>
</template>

<script>
import { Field, Button, Lazyload, Toast, Icon } from 'vant';
import { Debounce, storageSet, storageGet } from '@/utils/utils'
import { service_phone } from '@/utils/http'
import { userRegister, getSMSCode, bindNumber, getOpenidUserInfo, wxLoginAuthor } from '@/api/user'
import Pdftext from '@/components/Pdftext'
export default {
  components: {
    Field, Button, Lazyload, Pdftext, Icon
  },
  name: 'login',
  data() {
    return {
      showNumber: false,
      service_phone: service_phone,
      show: true,
      form: {
        phone: '',
        code: '',
        openId: storageGet('openId')
      },
      islogin: false,
      verfText: '获取验证码',   //验证码按钮文本
      wait: 60,                //验证码倒计时
      verfThrottling: false,   //验证码节流控制
      showpdf: false,
      name: '',
      number: '',
      docmHeihht:'0', //默认屏幕高度
      showHeight:'0', //当前屏幕高度
      hideShow:true,  //显示或者隐藏policy_tip
      isResize:false  //默认屏幕高度是否以获取
    }
  },
  mounted(){
    window.onresize=()=>{
      return (()=>{
        if(!this.isResize){
          this.docmHeihht=document.documentElement.clientHeight,
          this.isResize = true
        }
        //实时屏幕⾼度
          this.showHeight = document.body.clientHeight 
      })()
    }
  },
  watch:{
    showHeight(){
      if(this.docmHeihht===this.showHeight){
        this.hideShow = false
      }else{
        this.hideShow = true
      }
    }
  },
  created() {
    localStorage.removeItem('userPhone')
    let userInfo = storageGet('userInfo')
    userInfo.bindPhone = ''
    storageSet('userInfo', userInfo)

    //查询微信用户信息
    getOpenidUserInfo({ openid: storageGet('openId') }).then(res => {
      if (res.code == 200) {
        if (!res.data) {//没有查到微信用户信息 需要重新授权并登录
          wxLoginAuthor()
          console.log('无效openid')
          return
        }
      }
    })
  },
  methods: {
    subLogin() {
      if (!this.form.phone || this.form.phone.length < 11) {
        Toast('请填写正确手机号', 1200);
        return false;
      }
      if (!this.form.code || this.form.code.length != 6) {
        Toast('请填写验证码', 1200);
        return false;
      }
      if (this.showNumber) {
        if (!this.name) {
          Toast('请输入姓名')
          return
        }
        if (!this.number) {
          Toast('请输入工号')
          return
        }
        let param = Object.assign({}, this.form)
        param.name = this.name
        param.number = this.number
        this.loginByNumber(param)
      } else {
        let param = Object.assign({}, this.form)
        this.loginByPhone(param)
      }
    },
    loginByPhone(param) {
      userRegister(param).then(res => {
        if (res.code == 200) {
          var phone = this.form.phone
          let userInfo = storageGet('userInfo')
          userInfo.bindPhone = this.form.phone
          storageSet('userInfo', userInfo)
          this.$router.push({ path: '/index/index' })
        } else {
          let msg = res.msg || '登录失败'
          Toast(msg)
        }
      }).catch(err => {
        let msg = err.msg || '登录失败'
        Toast(msg)
      })
    },
    loginByNumber(param) {
      bindNumber(param).then(res => {
        if (res.code == 200) {
          var phone = this.form.phone
          let userInfo = storageGet('userInfo')
          userInfo.bindPhone = this.form.phone
          storageSet('userInfo', userInfo)
          this.$router.push({ path: '/index/index' })
        } else {
          let msg = res.msg || '登录失败'
          Toast(msg)
        }
      }).catch(err => {
        let msg = err.msg || '登录失败'
        Toast(msg)
      })
    },
    time() {
      if (this.wait == 0) {
        this.verfThrottling = false;
        this.verfText = "获取验证码";
        this.wait = 60;
      } else {
        this.verfThrottling = true;
        this.verfText = "重新发送(" + this.wait + "S)";
        this.wait--;
        setTimeout(() => {
          this.time();
        }, 1000)
      }
    },
    subVerf() {
      if (this.verfThrottling == false && this.form.phone && this.form.phone.length >= 11) {
        getSMSCode(this.form.phone)
          .then((response) => {
            if (response.code == 200) {
              this.islogin = true
            }
          })
        this.time();
      } else {
        if (!this.form.phone || this.form.phone.length < 11) {
          Toast('请填写正确手机号', 1200);
          return false;
        }
      }

    },
  }
};
</script>
<style scoped lang="scss">
.login-box {
  height: 100vh;
  overflow: hidden;
}
.welcome {
  margin: 62px 0 50px;
  font-weight: bold;
  font-size: 19px;
  line-height: 20px;
  text-align: center;
  color: #010101;
}
.input-box {
  width: 345px;
  margin: 0 auto;
  .code-btn {
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 8px;
    border: none;
  }
  .noPhone {
    background: none;
    border-radius: 8px;
    border: 1px solid #00000050;
    color: #000000;
  }
}
.sub-button {
  width: 313px;
  margin: 0 auto;
  padding: 13px 0;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border-radius: 8px;
}
.login-pdf {
  font-weight: normal;
  font-size: 13px;
  line-height: 20px;
  color: #000000;
  text-align: center;
}
.policy_tip {
  width: 100%;
  position: fixed;
  left: 0;
  z-index: 20;
  bottom: 48px;
  font-size: 12px;
  line-height: 20px;
  color: #00000090;
  text-align: center;
  a {
    color: #005de9;
  }
}
.show-number {
  text-align: center;
  font-size: 18px;
  color: rgb(2, 173, 69);
}
</style>
<style lang="scss">
.input-box {
  .van-field__clear {
    color: #ef3c3c;
  }
  // .van-cell::after {
  //   border-bottom: 1px solid rgba(241, 79, 68, 0.5);
  // }
}
.phone-field::after,
.code-field::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 4.26667vw;
  bottom: 0;
  left: 4.26667vw;
  border-bottom: 1px solid #ef3c3c;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>