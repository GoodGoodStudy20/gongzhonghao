<template>
  <div class="main">
    <Row :gutter="20" class="top-box">
      <Col :span="11"><span class="top-title">时间</span></Col>
      <Col :span="5"><span class="top-title" style="margin-left:16px">状态</span></Col>
      <Col :span="4"><span class="top-title">金额</span></Col>
      <Col :span="4"><span class="top-title">详情</span></Col>
    </Row>
    <List v-model=" loading" :finished="finished" finished-text=" " @load="onLoad">
      <Row class="banner-box" :gutter="20" @click="detailspage(item.id,item.integralWithdrawalState)" v-for="(item,index) in list" :key="index">
        <Col :span="12"><span class="time-text">{{item.createTime}}</span></Col>
        <Col :span="4"><span class="time-text" :style="{color:colorList[item.integralWithdrawalState]}">{{stateList[item.integralWithdrawalState]}}</span></Col>
        <Col :span="4"><span class="time-text" style="font-weight: bold;">￥{{item.amount}}</span></Col>
        <Col :span="4" style="text-align:center">
        <Icon name="arrow" size="14" />
        </Col>
      </Row>
    </List>
  </div>
</template>

<script>
import { storageGet, storageSet } from '@/utils/utils'
import { Cell, List, Row, Col, Icon } from 'vant'
import { getIntegralWithdrawalList } from '@/api/user'
export default {
  name: 'Withdrawalrecord',
  components: {
    Cell, List, Row, Col, Icon
  },
  props: {},
  data() {
    return {
      list: [],
      stateList: ['未发放', '已发放', '已退回'],
      colorList: ['#333333', '#005DE9', '#F14F44'],
      loading: false,
      finished: false,
      total: '',
      pageNum: 1
    };
  },
  watch: {},
  computed: {},
  methods: {
    onLoad() {
      // 异步更新数据
      let params = {
        isPage: 0,
        pageNum: this.pageNum++,
        pageSize: 10
      }
      let userInfo = storageGet('userInfo')
      getIntegralWithdrawalList({ ...params, userPhone: userInfo.bindPhone }).then(res => {
        this.total = res.total
        if (res.code == 200) {
          for (let Item of res.data.records) {
            this.list.push(Item)
          }
        }
      })
      // 加载状态结束
      this.loading = false;

      // 数据全部加载完成
      if (this.list.length >= this.total) {
        this.finished = true;
      }
    },
    // 详情
    detailspage(id, type) {
      this.$router.push({
        path: '/user/my-integral/cashdetails', query: {
          id
        }
      })
    }
  },
  created() {
  },

  mounted() { }
};
</script>
<style lang="scss" scoped>
.main {
  width: 100vw;
  min-height: 100vh;
  background: #f1f4f8;
  padding: 5px 12px;
}
.top-box {
  width: 351px;
  height: 44px;
  background: #ffffff;
  line-height: 44px;
  box-shadow: 0px 0.8px 0px rgba(0, 0, 0, 0.1);
  .top-title {
    font-weight: bold;
    font-size: 15px;
    color: #000000;
    margin-left: 13px;
  }
}
.banner-box {
  width: 351px;
  padding: 2px 10px;
  height: 44px;
  background: #ffffff;
  position: relative;
  &::after {
    position: absolute;
    box-sizing: border-box;
    width: 331px;
    content: " ";
    pointer-events: none;
    right: 10px;
    bottom: 0;
    border-bottom: 1px solid #00000030;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .time-text {
    font-weight: normal;
    font-size: 13px;
    color: #333333;
  }
}
</style>