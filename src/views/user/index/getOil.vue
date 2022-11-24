<template>
  <div class="box">
    <div class="step-box">
      <Steps :active="active" active-color="#FE665C" @click-step="clickStep ">
        <Step>
          <template #active-icon>
            <div class="step">
              <img src="@/assets/img/user/active1.png" alt="">
              <p>基本信息</p>
            </div>
          </template>
          <template #inactive-icon>
            <div class="step">
              <img src="@/assets/img/user/inactive1.png" alt="">
              <p>基本信息</p>
            </div>
          </template>
          <template #finish-icon>
            <div class="step">
              <img src="@/assets/img/user/active1.png" alt="">
              <p>基本信息</p>
            </div>
          </template>
        </Step>
        <Step>
          <template #active-icon>
            <div class="step">
              <img src="@/assets/img/user/active2.png" alt="">
              <p>实名认证</p>
            </div>
          </template>
          <template #inactive-icon>
            <div class="step">
              <img src="@/assets/img/user/inactive2.png" alt="">
              <p>实名认证</p>
            </div>
          </template>
          <template #finish-icon>
            <div class="step">
              <img src="@/assets/img/user/active2.png" alt="">
              <p>实名认证</p>
            </div>
          </template>
        </Step>
        <Step>
          <template #active-icon>
            <div class="step">
              <img src="@/assets/img/user/active3.png" alt="">
              <p>领取成功</p>
            </div>
          </template>
          <template #inactive-icon>
            <div class="step">
              <img src="@/assets/img/user/inactive3.png" alt="">
              <p>领取成功</p>
            </div>
          </template>
          <template #finish-icon>
            <div class="step">
              <img src="@/assets/img/user/active3.png" alt="">
              <p>领取成功</p>
            </div>
          </template>
        </Step>
      </Steps>
    </div>
    <div v-show="active==0">
      <div class="input-box">
        <Field label="真实姓名：" v-model="form.realName" placeholder="请选择真实姓名" readonly>
          <template #right-icon>
            <Popover v-model="showName" placement="bottom-end" theme="dark" trigger="click" :actions="realNameList" @select="onSelect">
              <template #reference>
                <Icon name="arrow-down"></Icon>
              </template>
            </Popover>
          </template>
        </Field>
        <!-- <ActionSheet v-model="showName" :actions="realNameList" @select="onSelect" /> -->
        <Field label="证件号码：" v-model="form.idNum" name="idNum" maxlength="18" placeholder="请输入证件号码"></Field>
        <Field label="充值号码：" readonly v-model="form.phone" placeholder="请输入充值号码"></Field>
        <div class="btn-box">
          <Button class="btn" :disabled="!form.realName || !form.idNum || !form.phone || !checked" round block type="primary" @click="nextStep">下一步</Button>
        </div>
        <Checkbox v-model="checked" class="yinsi" label-disabled checked-color="#F14F44" icon-size="16px">
          <span>我已阅读并同意</span>
          <span @click="open" style="color:#f14f44;float:right">《隐私条款》</span>
        </Checkbox>
      </div>
      <div class="rule-box">
        <div class="common-title">领取须知</div>
        <p v-for="(item,i) in tipList1" :key="i">{{i+1}}. <span v-html="item"></span></p>
      </div>
    </div>
    <div v-show="active==1">
      <div class="msg-box">
        <img src="@/assets/img/user/人像.png" alt="">
        <p>请点击下方摄像头录制<span>3~10秒</span>的视频</p>
        <p>(视频中需包含<span>点头、摇头</span>动作)</p>
      </div>
      <p class="remark">{{failMsg ? `${failMsg},请重新录制` : ' '}}</p>
      <div class="camera-box">
        <div class="camera">
          <input type="file" accept="video/*" @change="beforeUpload" ref="inputer" capture="user">
        </div>
      </div>
    </div>
    <div v-show="active==2">
      <div class="qrcode-img">
        <p>恭喜您获得加油券 <span>{{moeny}}元 </span></p>
        <div class="gd-code">
          <wx-open-launch-weapp id="launch-btn" username="gh_85d236dfcbaa" path="">
            <script type="text/wxtag-template">
              <div style="height:150px;width:150px;opcity:0"></div>
            </script>
          </wx-open-launch-weapp>
        </div>
        <div class="bottom-tips">点击即可去加油</div>
      </div>
      <div class="rule-box">
        <div class="common-title">注意事项</div>
        <p v-for="(item,i) in tipList" :key="i">{{i+1}}. <span v-html="item"></span></p>
      </div>
    </div>
    <Pdftext :showpdf.sync="showpdf"></Pdftext>
    <GetOilSuccess :show.sync="showSuccess" :form="form" :moeny="moeny" @confirm="active=2"></GetOilSuccess>
  </div>
</template>

<script>

import wx from 'weixin-js-sdk'
import lrz from 'lrz'
import { getJsJDK, baiduUploadFile, getOilCardAndInterests } from '@/api/user'
import { Step, Steps, Field, Toast, Button, Checkbox, ActionSheet, Popover, Icon } from 'vant';
import { Debounce, CheckIdCard } from '@/utils/utils'
import Pdftext from '@/components/Pdftext'
import GetOilSuccess from './components/GetOilSuccess'
export default {
  components: { Step, Steps, Field, Button, Pdftext, GetOilSuccess, Checkbox, ActionSheet, Popover, Icon },
  data() {
    return {
      realNameList: [],
      showName: false,
      active: 0,
      moeny: '',
      form: {
        idNum: '',
        phone: JSON.parse(localStorage.getItem('userPhone')),
        realName: '',
        imgUrl: ''
      },
      checked: false,
      showpdf: false,
      showSuccess: false,
      failMsg: '',
      tipList1: [
        '请输入您的真实姓名和身份证号码，否则不能领取成功。',
        '为了确保是您本人领取权益我们会采集您的脸部照片进行实名验证。',
        '每个账号每天只能验证3次，请确保输入正确的信息和录入清晰的照片。',
        "领取成功之后金额将充值到广东中石化小程序<span style='color:#0099ff'>“大家来加油”</span>。"],
      tipList: [
        '广东省内任意中石化直营加油站可以使用，有效期180天。',
        '活动赠送优惠，不可开具发票。',
        '每月第一天和最后一天为中石化电子渠道内部结算日期，这两天不可以使用。',
        "如有疑问，请咨询<a style='color:#0099ff;text-decoration: none' href='tel:4006310818'>400-6310-818</a>"],
    }
  },
  created() {
    this.realNameList = JSON.parse(this.$route.query.list)
    if (this.realNameList.length == 1) {
      this.onSelect(this.realNameList[0])
    }
    getJsJDK()
  },
  methods: {
    onSelect(item) {
      this.showName = false
      this.form.realName = item.text
      console.log(item)
    },
    nextStep() {
      if (this.active == 0) {
        if (!CheckIdCard(this.form.idNum)) {
          Toast('请输入正确的身份证号')
          return
        }
      }
      this.active++
    },
    clickStep(index) {
      if (index == 0) {
        this.active = 0
      }
    },
    open() {
      this.showpdf = true
      this.checked = true
    },
    beforeUpload() {
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      let fil = inputDOM.files[0];
      let url = URL.createObjectURL(fil);//获取录音时长
      let audioElement = new Audio(url);//audio也可获取视频的时长            const video=videoRef.current;
      audioElement.setAttribute('playsinline', 'true');
      audioElement.setAttribute('autoplay', 'false');
      audioElement.setAttribute('preload', 'auto');
      audioElement.setAttribute('webkit-playsInline', 'true');
      audioElement.setAttribute('x-webkit-airplay', 'allow');
      audioElement.setAttribute('x5-video-player-type', 'h5');
      audioElement.setAttribute('x5-video-player-fullscreen', 'true');
      audioElement.setAttribute('x5-video-orientation', 'landscape|portrait');
      if (window.WeixinJSBridge) {
        window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
          audioElement.play();
          audioElement.pause();
        }, false);
      }
      audioElement.addEventListener('loadedmetadata', () => {
        let duration = Number(audioElement.duration);
        console.log(111111, duration, this.active);
        if (duration > 10 || duration < 3) {
          Toast('请录制3~10秒的视频');
          return
        }
        //判断是否需要压缩
        console.log('上传前的大小', fil.size / 1024 / 1024)
        // if (fil.size > 15 * 1024 * 1024) {
        // Toast('请录制15M以内的视频！');
        // this.lrzImg()
        // return
        // }
        this.uploadFile(fil)
      })
      console.log('这是后面')
    },
    async lrzImg(file) {//视频压缩
      await lrz(file, { quality: 0.8, fieldName: Math.floor(Math.random() * 1000 + 1) }).then(rst => {
        let size = rst.file.size
        console.log('压缩后', size / 1024 / 1024)
        if (size > 1 * 1024 * 1024) {
          this.lrzImg(rst.file)
          return
        }
        this.uploadFile(rst.file)
      })
    },
    uploadFile(fil) {//上传视频
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '上传比对中,请勿关闭页面',
      });
      // let reader = new FileReader()
      // let rs = reader.readAsDataURL(fil)
      // reader.onload = e => {
      //   let base = e.target.result.split(',')[1]
      //   this.submit(base)
      // }
      // return
      let mfile = new File([fil], fil.name, { type: "video/*" });
      let data = new FormData()
      data.append('mfile', mfile)
      console.log(mfile)
      console.log('上传后', mfile.size / 1024 / 1024)
      baiduUploadFile(data).then(res => {
        if (res.code == 200) {
          this.form.imgUrl = res.data
          this.submit()
        } else {
          Toast('上传失败')
        }
      }).catch(err => {
        Toast.clear()
        Toast('上传失败')
      })
    },
    submit() {
      let param = Object.assign({}, this.form)
      console.log('触发了')
      getOilCardAndInterests(param).then(res => {
        Toast.clear()
        if (res.code == 200) {
          this.moeny = res.data
          // this.active = 2
          this.showSuccess = true
        } else {
          this.failMsg = res.msg
          Toast.fail({
            duration: 3000, // 持续展示 toast
            forbidClick: true,
            message: res.msg,
          });
        }
      }).catch(err => {
        Toast.clear()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 12px 6px;
  background: #fdfeff;
}
.common {
  width: 351px;
  background: #ffffff;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  margin: 0 auto 8px;
}
.step-box {
  @extend .common;
  padding: 15px 13px;
  .step {
    text-align: center;
    width: 51px;
    height: 76px;
    img {
      width: 48px;
      height: 48px;
    }
    p {
      margin: 0;
      margin-top: 8px;
      font-weight: normal;
      font-size: 13px;
      white-space: nowrap;
    }
  }
}
.input-box {
  @extend .common;
  padding: 8px 0px;
  .btn-box {
    margin-top: 10px;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    text-align: center;
    .btn {
      color: #fff;
      width: 325px;
      height: 40px;
      margin: 0px auto;
      text-align: center;
      line-height: 40px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      border: none;
    }
  }
  .yinsi {
    font-size: 13px;
    width: 200px;
    margin: 15px auto;
  }
}
.remark {
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
  color: #f14f44;
}
.msg-box {
  width: 240px;
  height: 240px;
  background: url("../../../assets/img/user/box.png");
  background-size: 100% 100%;
  margin: 52px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    width: 150px;
    height: 150px;
    margin-top: -30px;
  }
  p {
    margin: 0;
    margin-bottom: 10px;
    white-space: nowrap;
    span {
      color: #f14f44;
    }
  }
  p:nth-child(2) {
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }
  p:nth-child(3) {
    font-weight: normal;
    font-size: 15px;
    color: #666666;
  }
}
.camera-box {
  width: 100%;
  position: fixed;
  bottom: 34px;
  .camera {
    // display: block;
    margin: 0 auto;
    width: 72px;
    height: 72px;
    // border: none;
    background: url("../../../assets/img/user/camera.png");
    background-size: 100% 100%;
    input {
      width: 72px;
      height: 72px;
      opacity: 0;
    }
  }
}
.qrcode-img {
  @extend .common;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 20px;
  .gd-code {
    background: url("https://gz.bcebos.com/v1/zhijianche/691983a5-1f6c-4f41-8bd8-a5449d4f5293.png");
  }
  .gd-code {
    height: 150px;
    width: 150px;
    background-size: 100% 100%;
    border-radius: 15px;
  }
  p {
    font-weight: bold;
    font-size: 19px;
    margin: 14px 0 22px;
    span {
      font-weight: bold;
      font-size: 20px;
      color: #f14f44;
    }
  }
  .bottom-tips {
    font-weight: normal;
    font-size: 13px;
    color: #333333;
  }
}
.rule-box {
  @extend .common;
  padding: 14px 10px;
  .common-title {
    margin-bottom: 14px;
  }
  p {
    margin: 0 0 12px;
    font-weight: normal;
    font-size: 12px;
    color: #333333;
  }
}
</style>
<style lang="scss">
.step-box {
  .van-steps--horizontal {
    height: 76px;
  }
  .van-step {
    flex: 0 1 auto !important;
    width: 130px !important;
  }
  .van-step--horizontal .van-step__line {
    // height: 1px;
    // border-bottom: 1px dashed #fe665c;
  }
}
</style>