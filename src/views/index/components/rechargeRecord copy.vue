<template>
  <div class="box">
    <div class="top-box">
      <div class="date-container">
        <div @click="checkTime(1)">{{date}}月</div>
        <Icon name="arrow-down" style="margin-left:5px"></Icon>
      </div>
      <!-- <div class="payment">支出</div> -->
    </div>
    <Popup v-model="showPicker" position="bottom">
      <DatetimePicker type="year-month" v-model="currentDate" :min-date="minDate" :max-date="maxDate" :formatter="formatter" @confirm="onConfirm" @cancel="showPicker = false"></DatetimePicker>
    </Popup>
    <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="item-box" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
        <Cell>
          <template #title>
            <span class="cell-title">话费充值</span>
          </template>
          <template #default>
            <span class="cell-value" v-if="item.payStatus == 0">未付款</span>
            <span class="cell-value" v-else>{{ usedList2[item.isUsed] }}</span>
          </template>
        </Cell>
        <div class="coupons-box2">
          <img class="coupons-img" v-if="item['icon'] && item.oilCouponType == null" :src="item['icon']" alt="" />
          <div class="right-info">
            <div class="r-top">
              <span class="title" v-if="item.type == 1 || item.type == 0">{{
                item.vouchersExplain
              }}</span>
              <span class="title title-name" v-else-if="
                  item.oilCouponType == 2 ||
                    item.oilCouponType == 0 ||
                    item.oilCouponType == 1
                ">{{ item.name }}</span>

              <span class="title">充值账号:{{ item.rechargeAccount }}</span>
              <span class="title">{{
                item.type == 3 || item.type == 4 ? '' : '消费金额'
              }}</span>
            </div>
            <div class="r-bottom">
              <span v-if="item.expireDate">有效期：{{ item.expireDate }}</span>
              <span v-else-if="
                  item.oilCouponType == 2 ||
                    item.oilCouponType == 0 ||
                    item.oilCouponType == 1
                "></span>
              <span v-else>{{ item.type == 3 ? '到账面额' : '原价' }}：￥{{
                  item.price
                }}</span>
              <span>{{ item.payAmount ? '￥' + item.payAmount : ''
                }}{{ item.payIntegral ? '权益' + item.payIntegral : '' }}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom-item">
            购买时间：
            {{ item.createTime }}
          </div>
          <div v-if="item.type == 1 && item.isUsed == 0" @click="usedClick(item)" class="bottom-text">
            去使用
          </div>
          <div v-if="item.type == 4 && item.isUsed == 0" @click="edaijiaClick(item)" class="bottom-text">
            去使用
          </div>
          <!-- 广东石油加油券暂时停止跳转 -->
          <!-- <div v-if="item.oilCouponType==2 && item.payStatus==1" @click="usedCilck2(item)">去使用</div> -->
          <div v-if="item.oilCouponType == 2 && item.payStatus == 1" class="bottom-text">
            去使用
          </div>
          <div v-if="
              (item.oilCouponType == 0 || item.oilCouponType == 1) &&
                item.payStatus == 1
            " @click="usedCilck3(item)" class="bottom-text">
            去使用
          </div>
          <div v-if="item.type == 1 && item.isUsed != 0" class="bottom-text">
            {{ usedList[item.isUsed] }}
          </div>
          <div v-if="item.type == 0" @click="usedClick(item)" class="bottom-text">
            {{ usedList[item.isUsed] }}
          </div>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
import { storageGet, formatDate } from '@/utils/utils'
import { Cell, List, Field, Popup, DatetimePicker, Toast, Icon } from 'vant'
import { getWlynProductRechargePage, getJsJDK } from '@/api/user'
import moment from 'moment';
export default {
  name: 'rechargeRecord',
  components: {
    Cell, List, Field, Popup, DatetimePicker, Icon
  },
  props: {},
  data() {
    return {
      usedList2: ['未付款', '支付成功', '支付失败', '已退款', '退款中', '部分退款'],
      date: moment().startOf('month').format('YYYY-MM'),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
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
  filters: {
    format(val) {
      if (val === null || val === "") {
        return "";
      }
      return moment(val).format('YYYY-MM')
    }
  },
  created() {
    getJsJDK()
  },
  methods: {
    toDetail(item) {
      this.$router.push(`/seniorExecutiveEelect/telephoneDetail?id=${item.id}`)
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }
      return val;
    },
    onLoad() {
      let params = {
        pageNum: this.pageNum,
        pageSize: 10,
        startTime: this.startTime,
        endTime: this.endTime,
        supplierType: 3,
        date: this.date,
      }
      console.log(params.date, '-----------');
      let userInfo = storageGet('userInfo')
      params.openId = userInfo.openid
      getWlynProductRechargePage({ ...params, userPhone: userInfo.bindPhone }).then(res => {
        this.total = res.total
        if (res.code == 200) {
          this.list = this.pageNum == 1 ? res.data.records : [...this.list, ...res.data.records]
          if (res.data.records == 0) {
            this.finished = true;
          }
          this.pageNum++
          this.loading = false;
          console.log(this.list.length);
          // if (this.list.length >= this.total) {

        }
      })
    },
    checkTime(type) {
      this.showPicker = true
      this.timeType = type
    },
    PrefixZero(num) {
      if (Number(num) < 10) {
        num = '0' + num;
      }
      return String(num);
    },
    formatMonth(date) {
      return `${date.getFullYear()}-${this.PrefixZero(date.getMonth() + 1)}`;
    },
    onConfirm(value) {
      this.date = this.formatMonth(value)
      this.pageNum = 1
      this.list = []
      this.onLoad()
      this.finished = false;
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
.box {
  padding: 0 15px;
  background: #f6f7f9;
  min-height: 100vh;
  height: auto;
  .item-box {
    background: #fff;
    margin-bottom: 10px;
    border-radius: 8px;
    padding-top: 5px;
  }
}
.date-container {
  display: flex;
  align-items: center;
  font-size: 16px;
  padding-top: 10px;
  margin-bottom: 20px;
}
.payment {
  font-size: 16px;
}
.bottom {
  margin-top: 8px;
  height: 31px;
  padding: 0 11px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-item {
    font-weight: normal;
    font-size: 12px;
    line-height: 11px;
    color: #00000050;
  }
  &-txet {
    padding: 5px 12px;
    background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
    box-shadow: 0px 3px 10px rgba(234, 77, 58, 0.3);
    border-radius: 28px;
    color: #fff;
  }
}
.coupons-box2 {
  padding: 5px 11px;
  display: flex;
  .coupons-img {
    background: no-repeat center;
    background-size: 70px 70px;
    width: 80px;
    height: 80px;
    margin-right: 11px;
  }
  .right-info {
    flex: 1;
    .r-top,
    .r-bottom {
      display: flex;
      margin-top: 15px;
      justify-content: space-between;
    }
    .r-bottom {
      font-weight: bold;
      font-size: 13px;
      line-height: 12px;
      color: #ff9519;
    }
    .title {
      font-weight: bold;
      font-size: 14px;
      line-height: 19px;
      color: #000000;
    }
    // 加油券名称过长 挤压消费金额
    .title-name {
      width: 175px;
    }
    .goods {
      width: 165px;
      // flex-wrap: wrap;
      // display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>