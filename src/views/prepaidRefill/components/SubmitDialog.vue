<template>
  <div>
    <Popup v-model="show" class="box" closeable close-icon-position="top-left" @click-close-icon="beforeClose">
      <div class="content">
        <p>话费充值</p>
        <p><span>￥</span>{{item.label}}</p>
        <!-- <div class="cell">
          <span>充值号码：</span>
          <div class="text">{{item.phone}}</div>
        </div>
        <div class="cell">
          <span>充值金额：</span>
          <div class="text">{{item.type==1?'慢充':'快充'}}{{item.label}}元</div>
        </div>
        <div class="cell">
          <span>付款金额：</span>
          <div class="text" style="color:red;">{{item.value}}元</div>
        </div> -->
        <Cell :title="`权益支付 (剩余权益${item.integral})`" v-if="Number(item.integral)>=Number(item.value)" :border="false">
          <template #right-icon>
            <Radio v-model="radio" name="1" checked-color="#F14F44" icon-size="16px"></Radio>
          </template>
        </Cell>
        <Cell title="微信支付" :border="false">
          <template #right-icon>
            <Radio v-model="radio" name="2" checked-color="#F14F44" icon-size="16px"></Radio>
          </template>
        </Cell>
        <div style="margin: 80px 14px 0">
          <Button class="btn" :disabled="!radio" round block type="primary" @click="submit">确定充值</Button>
        </div>
        <!-- <div class="cell">
          <span>支付方式：</span>
          <RadioGroup v-model="radio" style="font-size:13px" checked-color="#F14F44" icon-size="15px">
            <Radio name="1" v-if="Number(item.integral)>=Number(item.value)">
              <div class="text">权益支付 (剩余权益{{item.integral}})</div>
            </Radio>
            <Radio name="2" style="margin:10px 0">微信支付</Radio>
            <Radio name="3" v-if="item.integral>0 && Number(item.integral)<Number(item.value)">
              <div class="text">组合支付</div>
              <div class="text">(微信￥{{money}}+权益{{item.integral}}）</div>
            </Radio>
          </RadioGroup>
        </div> -->
      </div>
    </Popup>
  </div>
</template>

<script>
import { Dialog, Popup, Cell, RadioGroup, Radio, Button } from 'vant'
import wx from 'weixin-js-sdk'
export default {
  props: ['item', 'show'],
  components: {
    [Dialog.Component.name]: Dialog.Component, Popup, Cell, RadioGroup, Radio, Button
  },
  data() {
    return {
      radio: 0,
      money: 0
    }
  },
  methods: {
    beforeClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped lang="scss">
.cell {
  display: flex;
  margin: 8px 20px;
  padding: 10px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #f4f4f4;
  justify-content: space-between;
  span {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
.text {
  text-align: left;
  color: #666;
}
.box {
  width: 321px;
  height: 382px;
  background: #ffffff;
  border-radius: 8px;
  .content {
    margin-top: 56px;
    p {
      text-align: center;
      margin: 0;
    }
    p:nth-child(1) {
      font-weight: bold;
      font-size: 15px;
      color: #333333;
    }
    p:nth-child(2) {
      margin: 14px 0 30px;
      font-weight: bold;
      font-size: 34px;
      color: #000000;
      span {
        font-weight: bold;
        font-size: 20px;
        color: #000000;
      }
    }
  }
}
.btn {
  background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
  border: none;
  border-radius: 8px;
}
</style>