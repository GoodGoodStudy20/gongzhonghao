<!--
 * @Author: your name
 * @Date: 2021-01-20 15:17:48
 * @LastEditTime: 2021-01-22 10:50:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\zhijianche_mobile\src\views\apply\review.vue
-->
<template>
  <div>
    <div class="car-number-box-wr" @click="carAreaSelect = true">
      <label class="car-number-box">
        <div class="show-box">{{area}}</div>
        <div class="show-box">{{number.charAt(0)}}</div>
        <div class="circular"></div>
        <div class="show-box">{{number.charAt(1)}}</div>
        <div class="show-box">{{number.charAt(2)}}</div>
        <div class="show-box">{{number.charAt(3)}}</div>
        <div class="show-box">{{number.charAt(4)}}</div>
        <div class="show-box">{{number.charAt(5)}}</div>
        <div class="show-box">{{number.charAt(6)}}</div>
      </label>
    </div>
    <Popup v-model="carAreaSelect" position="bottom" :style="{ height: '290px',width: '100%',overflow:'hidden' }" :close-on-click-overlay="true">
      <div class="input-box">{{area}}{{number}}</div>
      <div class="select-area-box" v-if="levelKey == 1" style="height:205px;">
        <div class="select-area-text" v-for="(value,index) in carAreaArr" :key="value" @click="getCarArea(index)" v-text="value"></div>
      </div>
      <div class="select-area-box" v-if="levelKey == 2" style="height:205px;">
        <div class="select-area-text" v-for="(value,index) in letterNumberArr" :key="value" @click="setCardNumber(index)" v-text="value" v-show="index < 26 || number.length > 0"></div>
      </div>
      <div class="select-area-box">
        <Button class="select-area-btn" style="color:#2aadee" :disabled="levelKey == 1" @click="levelKey = 1">返回上一级键盘</Button>
        <Button class="select-area-btn" size="20" icon="arrow-left" @click="delNumber">删除</Button>
        <Button class="select-area-btn" icon="close" style="" @click="carAreaSelect = false">关闭</Button>
        <Button class="select-area-btn" style="color:#2aadee;padding:0px 20px" @click="carAreaSelect = false"> 确定 </Button>
      </div>
    </Popup>
  </div>
</template>
<script>
import { Popup, Icon, Button, Toast } from 'vant';
let letterNumberArr = []
for (var i = 0; i < 36; i++) {
  if (i <= 25) {
    letterNumberArr.push(String.fromCharCode(65 + i))
  } else {
    letterNumberArr.push(i - 26)
  }
}
export default {
  props: ['number', 'area', 'manageType'],
  components: {
    Popup, Icon, Button
  },
  data() {
    return {
      levelKey: 1,
      carAreaSelect: false,
      letterNumberArr: letterNumberArr,
      carAreaArr: [
        '京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁',
        '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽',
        '贵', '粤', '青', '藏', '川', '宁', '琼', '使', '领'],
    }
  },
  watch: {
    number(val, val2) {
      if (String(val).length > 6) {
        this.carAreaSelect = false
      }
    },
  },
  methods: {
    delNumber() {
      this.$emit('update:number', this.number.substr(0, this.number.length - 1))
    },
    setCardNumber(e) {
      if (String(this.number).length > 6) {
        this.carAreaSelect = false
        Toast('车牌号最多支持7位')
        return false;
      }
      this.$emit('update:number', (this.number + '' + this.letterNumberArr[e]).toUpperCase())
    },
    getCarArea(e) {
      this.levelKey = 2
      this.$emit('update:area', this.carAreaArr[e])
    },
  }
}
</script>
<style scoped lang="scss">
.car-number-box-wr {
  display: flex;
  font-size: 16px;
  color: #000000;
  height: 34px;
  margin: 4px 0px 0px;
  width: 100%;
  border-radius: 2px;
  .sel-btn {
    height: 24px;
    margin: 4px 0px 0px;
    font-size: 14px;
    text-align: center;
    padding: 2px 2px 0px;
    text-align: center;
    border-right: 1px solid #c7c7c7;
    width: 23%;
  }
  .car-number-box {
    margin: 5px 0px;
    flex: 1;
    display: flex;
    align-items: center;
    .show-box {
      height: 30px;
      font-weight: bolder;
      line-height: 30px;
      flex: 1;
      text-align: center;
      font-size: 16px;
      background: radial-gradient(
        50% 50% at 50% 50%,
        rgba(237, 244, 255, 0) 0%,
        #e0edff 100%
      );
      border-radius: 4px;
      margin: 0 5px;
    }
    .circular {
      height: 5px;
      width: 5px;
      border-radius: 50%;
      background: #e0edff;
    }
  }
}
.input-box {
  padding: 10px;
  font-size: 14px;
  color: #000;
}
.select-area-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  background-color: #dfdfdf;
  padding: 2px 0px 2px 2px;
  .select-area-btn {
    font-size: 15px;
    min-width: 35px;
    height: 35px;
    line-height: 35px;
    padding: 0px 10px;
    color: #a71c21;
    text-align: center;
    border-radius: 4px;
    background-color: #ffffff;
    margin: 4px 3px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  .select-area-text {
    font-size: 24px;
    min-width: 35px;
    height: 35px;
    line-height: 35px;
    padding: 0px 4px;
    color: #333;
    text-align: center;
    border-radius: 4px;
    background-color: #ffffff;
    margin: 4px 3px 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
}
</style>
