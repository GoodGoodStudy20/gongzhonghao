<template>
  <div class="wrap-box">
    <WashShop :shopInfo="shopInfo" @changeShop="changeShopInfo" :isUsed="items.isUsed" :showCheckOther="!items.shopId" :search="search">
      <template #coupons>
        <div class="coupons-box">
          <div class="left-box">
            <p>{{items.vouchersTitle}}</p>
            <p>{{items.vouchersExplain}}</p>
          </div>
          <div class="right-box">{{stateList[items.isUsed]}}</div>
        </div>
      </template>
    </WashShop>
    <div class="content-box">
      <div class="code-box" v-if="items.isUsed == 0 && items.couponCode && items.couponStatus">
        <div class="code-tips">出示二维码时向店员说明服务来自于“{{items.recharge == 1 ? (items.remark || '鹤大师') :'车多'}}”平台</div>
        <div ref="qrcode" id="qrcode" style="width:125px;height:125px;">
          <vue-qr :text="items.couponCode" :size="125"></vue-qr>
        </div>
        <div class="code-tips">有效期至{{items['expireDate']}}</div>
      </div>
      <div class="used-box" v-if="items.couponStatus==0">
        <div v-if="items.recharge == 1">
          <p>车牌号</p>
          <CarSelect class="car-box" :area.sync="licensePlateArea" :number.sync="licenseNumber" />
        </div>
        <div class="msg-box2" v-if="showCarNumber">
          <p>VIN</p>
          <div style="flex:1;padding:0 20px">
            <Field input-align="center" style="border-bottom:1px solid #eee" v-model="vin" placeholder="请输入vin"></Field>
          </div>
        </div>
        <div class="btn-box">
          <Button type="primary" class="btn" @click="activationClick">立即激活</Button>
        </div>
      </div>
    </div>
    <div class="rule-content">
      <div class="common-title">卡券说明</div>
      <div class="rich-text" v-html="items['ruleContent']"></div>
    </div>
  </div>
</template>
<script>
import { Toast, Cell, Button, Dialog, Field } from 'vant';
import { getH5VouchersInfo, getVouchersListByVouchersId, getShopPage, activationVouchers } from '@/api/user'
import { storageSet, storageGet, bd_encrypt } from '@/utils/utils'
import WashShop from '@/components/WashShop.vue'
import CarSelect from '@/components/CarSelect.vue'
import vueQr from 'vue-qr'
export default {
  components: {
    WashShop, CarSelect, Button, Cell, Field, vueQr
  },
  name: 'myCouponsWashCar',
  data() {
    return {
      interval: null,
      shopInfo: {},
      items: {},
      regionCode: '',
      lat: '',
      lng: '',
      rid: '',
      isUsed: '',
      vouchersId: '',
      total: 1,
      licensePlateArea: '',
      licenseNumber: '',
      vin: '',
      stateList: ["未使用", "已使用", "已过期", "已赠送",],
    }
  },
  created() {
    this.rid = this.$route.query.rid
    this.isUsed = this.$route.query.isUsed
    this.vouchersId = this.$route.query.vouchersId
    this.lat = storageGet('lat')
    this.lng = storageGet('lng')
    this.regionCode = storageGet('regionCode')
    this.getDetail();
  },
  computed: {
    search() {
      let params = {
        servicesCode: this.items.recharge ? this.items.externalNumber : this.items.couponType,
        type: this.items.recharge
      }
      return params
    },
    showCarNumber() {//鹤大师保养券需要填写车牌号及vin码
      return this.items.recharge == 1 && [8, 19, 20].includes(this.items.couponType)
    }
  },
  methods: {
    getShop() {//查第一条（最近）满足使用条件店铺
      let params = {
        distance: 0,
        pageSize: 1,
        pageNum: 1,
        lat: storageGet('lat'),
        lng: storageGet('lng'),
        regionCode: storageGet('CityCode'),
        shopId: this.items.shopId,
        ...this.search
      }
      getShopPage(params).then(res => {
        this.shopInfo = res.data.records[0] || {}
      })
    },
    changeShopInfo(item) {
      this.shopInfo = JSON.parse(JSON.stringify(item))
    },
    checkStatus() {//轮训当前卡券状态
      if (this.items['isUsed'] == 0) {
        this.interval = setInterval(() => {
          getH5VouchersInfo({ rId: this.items.rid, lat: this.lat, lng: this.lng })
            .then((response) => {
              if (response.code == 200) {
                this.items = response.data;
                // this.createCode(this.items['couponCode']);
                if (response.data['isUsed'] != 0) {
                  this.$nextTick(() => {
                    clearInterval(this.interval)
                    this.items['isUsed'] = response.data['isUsed']
                  })
                }
              }
            })
        }, 5000)
      }
    },
    getDetail() {
      console.log(23123)
      let success = (res) => {
        this.items = res;
        // this.createCode(this.items['couponCode']);
        this.checkStatus();
        this.getShop()
      }
      if (this.rid) {//查单条
        getH5VouchersInfo({ rId: this.rid, lat: this.lat, lng: this.lng }).then((response) => {
          if (response.code == 200) {
            success(response.data)
          }
        })
      }
      if (this.vouchersId) {//查列表
        let params = {
          isUsed: this.isUsed,
          vouchersId: this.vouchersId,
          phone: storageGet('userPhone'),
          pageNum: 1,
          pageSize: 1,
          lat: this.lat,
          lng: this.lng
        }
        getVouchersListByVouchersId(params).then(res => {
          if (res.code != 200) return
          this.total = res.data.total
          console.log(res, this.total)
          success(res.data.records[0])
        })
      }
    },
    createCode(code) {//生成核销码
      if (!code) return
      if (qrCode) return
      this.$nextTick(() => {
        qrCode = new QRCode('qrcode', {
          text: '',
          width: 125,
          height: 125, //图像高度
          colorDark: "#000000", //前景色
          colorLight: "#ffffff", //背景色
          typeNumber: 4,
          correctLevel: QRCode.CorrectLevel.H
        })

        qrCode.clear();
        qrCode.makeCode(code);
      })
    },
    activationClick() {//激活卡券
      let params = {
        rId: this.items.rid
      }
      if (this.items.recharge == 1) {
        if (!this.shopInfo || !this.shopInfo.shopId) {
          Toast('请选择店铺')
          return
        }
        params.shopId = this.shopInfo.shopId
        if (!this.licensePlateArea || !this.licenseNumber || (this.licensePlateArea + this.licenseNumber).length < 7) {
          Toast('请输入正确的车牌号')
          return
        }
        params.licenseNumber = this.licensePlateArea + this.licenseNumber
      }
      if (this.showCarNumber) {
        if (!this.vin) {
          Toast('请输入vin')
          return
        }
        params.vin = this.vin
      }
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          activationVouchers(params).then(async res => {
            await done()
            if (res.code == 200) {
              Toast('激活成功，可前往门店使用')
              clearInterval(this.interval)
              this.checkStatus()
            } else {
              Toast(res.msg || '使用失败，请稍后再试')
            }
          })
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '提示',
        message: "<span style='color:red'>确定激活此券吗，激活后将生成核销码，可前往门店使用核销</span>",
        beforeClose
      })
    }

  },
  beforeDestroy() {
    if (this.interval) { //如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.interval)
      this.interval = null;
    }
  },
};
</script>
<style scoped lang="scss">
.content-box {
  width: 351px;
  padding: 10px 0;
  margin: 7px auto;
  background: #ffffff;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
.coupons-title {
  float: left;
  font-size: 18px;
  color: #000000;
  font-weight: bolder;
  line-height: 25px;
}
.rule-content {
  width: 351px;
  padding: 10px;
  margin: 7px auto;
  background: #ffffff;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  font-size: 15px;
}

.code-box {
  width: 100%;
}
.code-image {
  width: 100%;
  height: 160px;
  text-align: center;
  padding: 10px 20px;
}
.code-image img {
  margin: 0px;
}
#qrcode {
  width: 150px;
  height: 150px;
  text-align: center;
  margin: 0px auto;
}
#qrcode img {
  margin: 0px;
}
.code-tips {
  font-size: 14px;
  color: #f14f44;
  text-align: center;
  width: 100%;
  margin: 14px 0;
}
.wrap-box {
  width: 100%;
  background-color: #f1f1f1;
  min-height: 100vh;
  padding-bottom: 10px;
}
.used-box {
  width: 96%;
  background: #fff;
  // padding: 20px 0;
  margin: 0 auto;
  border-radius: 6px;
  p {
    margin: 0;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
  }
  .car-box {
    padding: 0 15px;
    margin: 14px 0;
  }
  .msg-box2 {
    margin: 20px 0;
    display: flex;
    align-items: flex-end;
  }
  .btn-box {
    margin-top: 20px;
    text-align: center;
    .btn {
      width: 194px;
      height: 40px;
      background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      border-radius: 39px;
      border: none;
    }
  }
}
.coupons-box {
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 0.5px 0px #dddddd;
  .left-box {
    flex: 1;
    p {
      padding: 0;
      margin: 0;
    }
    p:nth-child(1) {
      font-weight: bold;
      font-size: 16px;
      color: #333333;
    }
    p:nth-child(2) {
      margin-top: 10px;
      font-weight: normal;
      font-size: 13px;
      color: #666666;
    }
  }
  .right-box {
    width: 65px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    border-radius: 35px;
    color: #fff;
    font-weight: bold;
    font-size: 13px;
    text-align: center;
    padding: 5px 10px;
  }
}
</style>
