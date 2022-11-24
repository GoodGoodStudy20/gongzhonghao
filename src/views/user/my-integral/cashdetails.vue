<template>
  <div class="box">
    <div class="form-box">
      <Form readonly>
        <Field border v-model="contactPeopleName" name="contactPeopleName" label="姓名" :rules="[{ required: true, }]" />

        <Field border v-model="idCodeType" name="idCode" label="证件类型" :rules="[{ required: true, }]" />
        <Field border v-model="idCode" name="idCode" label="证件号码" :rules="[{ required: true, }]" />
        <Field border v-model="cardNumber" name="cardNumber" label="银行卡号" :rules="[{ required: true, }]" />
        <Field border v-model="bankName" name="bankName" label="所属银行" :rules="[{ required: true, }]"></Field>
        <Field border v-model="contactPhone" name="contactPhone" label="预留号码" :rules="[{ required: true, }]" />
        <Field border v-model="amount" name="amount" label="提现金额" :rules="[{ required: true, }]"></Field>
        <Field border v-model="createTime" name="createTime" label="提交时间" :rules="[{ required: true, }]"></Field>
        <Field border v-model="integralWithdrawalState" name="integralWithdrawalState" label="当前状态" :rules="[{ required: true, }]"></Field>
        <div v-if="grantTimeisshow">
          <Field border v-model="grantTime" name="grantTime" label="发放时间" :rules="[{ required: true, }]"></Field>
        </div>
        <div v-if="returnTimeshow">
          <Field border v-model="returnTime" name="returnTime" label="退回时间" :rules="[{ required: true, }]"></Field>
        </div>
        <Field v-if="returnTimeshow" border v-model="returnReason" name="returnReason" label="退回原因" :rules="[{ required: true, }]"></Field>
        <div class="btn-box">
          <Button round block @click="gotodetail" class="detailsbutton" v-if="returnTimeshow" type="danger">修改</Button>
          <!-- <Button round block @click="gotoback" class="detailsbutton" type="primary">返回</Button> -->
        </div>
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
      </Form>
    </div>
    <!-- tips -->
  </div>
</template>

<script>
import { Form, Button, Field, Cell, CellGroup, DropdownMenu, DropdownItem, Area, Popup, DatetimePicker, Toast, ActionSheet } from 'vant'
import { selectById } from '@/api/user'
import { service_phone } from '@/utils/http'

export default {
  name: 'cashdetails',
  components: {
    Form, Button, Field, Cell, CellGroup, DropdownMenu, DropdownItem, Area, Popup, DatetimePicker, Toast, ActionSheet
  },
  props: {},
  data() {
    return {
      service_phone: service_phone,
      contactPeopleName: '',
      amount: '',
      countIntegral: '',
      cardNumber: '',
      idCode: '',
      contactPhone: '',
      bankName: '',
      createTime: '',
      grantTime: '',
      integralWithdrawalState: '',
      grantTimeisshow: '',
      returnTime: '',
      returnTimeshow: '',
      returnReason: '',
      idCodeType: ''
    };
  },
  watch: {},
  computed: {},
  methods: {
    gotodetail() {
      this.$router.push({
        path: '/user/my-integral/cashdetails/modifypage', query: {
          id: this.$route.query.id
        }
      })
    },
    onSubmit() {


    },
    cashrecord() {
      this.$router.push({ path: '/user/my-integral/Withdrawalrecord' })
    },
    gotoback() {
      this.$router.back(-1)
    }
  },
  created() { },
  mounted() {
    let params = {
      id: this.$route.query.id
    }
    selectById(params).then(res => {
      if (res.code == 200) {
        const item = res.data
        this.returnTime = item.returnTime
        this.returnTimeshow = item.integralWithdrawalState == 2 ? true : false
        this.returnReason = item.returnReason
        this.contactPeopleName = item.contactPeopleName
        this.amount = item.amount
        this.countIntegral = item.countIntegral
        this.cardNumber = item.cardNumber
        this.idCode = item.idCode
        this.contactPhone = item.contactPhone
        this.bankName = item.bankName
        this.createTime = item.createTime
        this.grantTime = item.grantTime
        this.grantTimeisshow = item.grantTime == null ? false : true
        this.integralWithdrawalState = item.integralWithdrawalState == 0 ? '未发放' : item.integralWithdrawalState == 1 ? '已发放' : '已退回'
        this.idCodeType = item.idCodeType == 0 ? '大陆居民身份证' : item.idCodeType == 1 ? '港澳居民身份证' : item.idCodeType == 2 ? '港澳居民内地通行证' : '大陆居民身份证'
      }
    })

  }
};
</script>
<style lang="scss" scoped>
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