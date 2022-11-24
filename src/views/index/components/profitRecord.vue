<template>
  <div class="box">
    <div v-for="(item,index) in list.filter(it=>it.list.length!=0)" :key="index">
      <div v-if="item.list && item.list.length>0">
        <div class="all-top"><span class="left">{{item.text}}月获利权益{{item.sumIntegral}}</span> &nbsp;&nbsp;<span class="right">合计笔数{{item.sum}}</span></div>
        <!-- <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
        <div class="item-box" v-for="(item1,index1) in item.list" :key="index1">
          <Cell>
            <template #title>
              <div class="cell-top">
                <img src="@/assets/img/huoli.png" alt="">
                <div class="cell-title">充值账号：{{item1.refereesName}}</div>
              </div>
            </template>
            <template #default>
              <span class="cell-value" :style="{'color': item1.integralType==0?'rgba(0, 0, 0, 0.8)':item1.integralType==1?'#1BAF4E':item1.integralType==2?'#FF7121':''}">{{item1.integralType==0?`充值中(${item1.progress || '50%'})`:item1.integralType==1?'充值成功':item1.integralType==2?'充值失败':''}}</span>
              <!-- <span v-if="false" class="cell-value" style="color:#1BAF4E">充值成功</span>
            <span v-if="true" class="cell-value" style="color:#FF7121">充值失败</span> -->
            </template>
          </Cell>
          <div class="coupons-box2">
            <div class="amount">
              <!-- <span>充值金额：{{item1.refereesPhone | mobileType}}{{item1.price}}元</span> -->
              <span>充值金额：{{item1.refereesPhone | mobileType}}{{item1.price}}元</span>
            </div>
            <div class="top">
              <div class="time">
                充值时间：
                {{ item1.createTime || ''}}
              </div>
              <div style="text-align:right">
                <div class="top-title">{{item1.integralType==0?'预计获利':'已获利'}}</div>
              </div>
            </div>
            <div class="top">
              <div class="time" v-if="item1.updatetime">
                获利时间：
                {{ item1.updatetime || ''}}
              </div>
              <div class="time" v-else></div>
              <div style="text-align:right">

                <div class="top-right2" :style="{'color':item1.integralType==2 ? 'rgba(0, 0, 0, 0.9)':'#FB584D'}"><span v-if="item1.integralType !=2 ">+</span>{{item1.integral}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </List> -->
    </div>
    <div class="no-data" v-if="list.filter(it=>it.list.length!=0).length==0">
      暂无数据
    </div>
  </div>
</template>

<script>
import { storageGet } from '@/utils/utils'
import { Cell, List } from 'vant'
import { selectPromoteFx } from '@/api/user'
export default {
  name: 'profitRecord',
  components: {
    Cell, List,
  },
  props: {},
  data() {
    return {
      usedList2: ['未付款', '支付成功', '支付失败', '已退款', '退款中', '部分退款'],
      stateList: ['支付失败', '支付成功', '支付失败', '已退款'],
      list: [],
      loading: false,
      finished: false,
      total: '',
      pageNum: 1,
      sumIntegral: '',
      sum: ''
    };
  },
  created() {
    this.onLoad()
  },
  filters: {
    mobileType(str) {
      let isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|198|18[2-478])\d{8}$/ //移动
      let isChinaUnion = /^(?:13[0-2]|145|15[56]|166|176|18[56])\d{8}$/ //联通
      let isChinaTelcom = /^0?(133|149|153|17[34]|177|18[01]|189|199|193|191)\d{8}$/ //电信
      if (isChinaMobile.test(str)) {
        return '移动'
      } else if (isChinaUnion.test(str)) {
        return '联通'
      } else if (isChinaTelcom.test(str)) {
        return '电信'
      } else {
        return ''
      }
    }
  },
  computed: {

  },
  methods: {
    onLoad(type) {
      let params = {
        pageNum: this.pageNum,
        pageSize: 10,
      }
      if (type == 'date') {
        params.date = this.date
      }
      let userInfo = storageGet('userInfo')
      params.openId = userInfo.openid
      selectPromoteFx({ ...params, phone: userInfo.bindPhone }).then(res => {
        console.log(res);
        // this.total = res.data.list.total
        // this.sumIntegral = res.data.sumIntegral
        this.sum = res.data.sum
        if (res.code == 200) {
          this.list = res.data || []
          // this.pageNum++
        }
      })
    },
  },
};
</script>
<style  scoped lang="scss">
.box {
  padding: 10px 15px;
  background: #f6f7f9;
  min-height: 100vh;
  height: auto;
  .all-top {
    font-style: normal;
    font-weight: 550;
    font-size: 16px;
    color: #000000;
    opacity: 0.9;
    margin: 10px 0 20px 10px;
  }
  .item-box {
    background: #fff;
    margin-bottom: 10px;
    border-radius: 8px;
    padding-top: 5px;
    .cell-top {
      display: flex;
      align-items: center;
      .cell-title {
        font-style: normal;
        font-weight: 550;
        font-size: 13px;
        color: #000000;
        opacity: 0.8;
        margin-top: 2px;
      }
      .cell-value {
        font-style: normal;
        font-weight: 500;
        font-size: 13px;
        color: #000000;
        opacity: 0.8;
        margin-top: 2px;
      }
      img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
    }
  }
}
::v-deep .van-cell__title {
  flex: auto !important;
}
::v-deep .van-cell__value {
  flex: auto !important;
}
.coupons-box2 {
  padding: 5px 11px;
  .amount {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    color: #000000;
    opacity: 0.8;
    margin: 6px 0;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    .time {
      font-weight: 400;
      font-size: 12px;
      color: #000000;
      opacity: 0.5;
      // margin-bottom: 4px;
    }
    // .top-right {
    //   font-weight: 400;
    //   font-size: 12px;
    //   color: #000000;
    //   opacity: 0.8;
    // }
    .top-title {
      font-weight: 400;
      font-size: 12px;
      color: #000000;
      opacity: 0.8;
      margin-bottom: 4px;
    }
    .top-right2 {
      font-weight: 400;
      font-size: 14px;
      color: #fb584d;
    }
  }
}
.no-data {
  margin-top: 50px;
  text-align: center;
  font-weight: 400;
  font-size: 12px;
  color: #000000;
  opacity: 0.8;
}
</style>