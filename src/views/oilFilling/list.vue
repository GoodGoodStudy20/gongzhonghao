<template>
  <div>
    <div class="top-box">
      <Field readonly clickable :value="startTime" :border="false" placeholder="点击选择开始时间" @click="checkTime(1)"></Field>
      <div>至</div>
      <Field readonly clickable :value="endTime" placeholder="点击选择结束时间" @click="checkTime(2)"></Field>
      <Popup v-model="showPicker" position="bottom">
        <DatetimePicker type="date" @confirm="onConfirm" @cancel="showPicker = false"></DatetimePicker>
      </Popup>
    </div>
    <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="cell-box" v-for="(item,index) in list" :key="index">
        <Cell :title="item.productName" :label="item.createTime" center>
          <template #default>
            <div style="color:#1eb049">{{stateList[item.payStatus]}}</div>
            <div class="amountleft">{{item.rechargeAccount}}</div>
            <div style="color:#333"><span v-if="item.payIntegral">- {{item.payIntegral}} 权益 </span><span v-if="item.payAmount"> - {{item.payIntegral}} 元</span> </div>
          </template>
          <template #icon>
            <img :src="item.icon" alt="" style="width:45px;height:45px;margin-right:20px">
          </template>
          <!-- <template #right-icon>
            <div style="color:#999;font-size:13px">{{item.createTime}}</div>
          </template> -->
        </Cell>
        <div v-if="item.code && item.code!='null'" style="font-size:14px;" @click="copyContentH5(item.code)">卡密：<span style="color:#0099ff">{{item.code}}</span>
          <span style="color:#0099ff;float:right">复制</span></div>
      </div>
    </List>
  </div>
</template>

<script>
import { storageGet, formatDate } from '@/utils/utils'
import { Cell, List, Field, Popup, DatetimePicker, Toast } from 'vant'
import { getWlynProductRechargePage } from '@/api/user'
export default {
  name: 'oilFillingList',
  components: {
    Cell, List, Field, Popup, DatetimePicker
  },
  props: {},
  data() {
    return {
      stateList: ['支付失败', '支付成功', '支付失败', '已退款'],
      list: [],
      loading: false,
      finished: false,
      total: '',
      pageNum: 1,
      showPicker: false,
      timeType: 1,
      startTime: '',
      endTime: '',
    };
  },
  methods: {
    onLoad() {
      let params = {
        pageNum: this.pageNum,
        pageSize: 10,
        startTime: this.startTime,
        endTime: this.endTime
      }
      let userInfo = storageGet('userInfo')
      getWlynProductRechargePage({ ...params, userPhone: userInfo.bindPhone }).then(res => {
        this.total = res.total
        if (res.code == 200) {
          this.list = this.pageNum == 1 ? res.data.records : [...this.list, ...res.data.records]
          this.pageNum++
        }
      })
      this.loading = false;
      if (this.list.length >= this.total) {
        this.finished = true;
      }
    },
    checkTime(type) {
      this.showPicker = true
      this.timeType = type
    },
    onConfirm(value) {
      this.timeType == 1 ? this.startTime = formatDate(value) : this.endTime = formatDate(value)
      this.pageNum = 1
      this.onLoad()
      this.showPicker = false
    },
    //h5复制文本到剪切板
    copyContentH5(content) {
      var copyDom = document.createElement('div');
      copyDom.innerText = content;
      copyDom.style.position = 'absolute';
      copyDom.style.top = '0px';
      copyDom.style.right = '-9999px';
      document.body.appendChild(copyDom);
      //创建选中范围
      var range = document.createRange();
      range.selectNode(copyDom);
      //移除剪切板中内容
      window.getSelection().removeAllRanges();
      //添加新的内容到剪切板
      window.getSelection().addRange(range);
      //复制
      var successful = document.execCommand('copy');
      copyDom.parentNode.removeChild(copyDom);
      try {
        var msg = successful ? "successful" : "failed";
        Toast('复制成功')
      } catch (err) {
        Toast('复制失败')
      }
    }
  },
};
</script>
<style  scoped lang="scss">
.amountleft {
  color: #000;
}
.top-box {
  display: flex;
  font-size: 16px;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
}
.cell-box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 5px;
  width: 96%;
  margin: 10px auto;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
}
</style>