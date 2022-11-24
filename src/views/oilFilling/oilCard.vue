<template>
  <div class="history-box">
    <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload">
      <Cell v-for="(item,index) in list" :key="index" :title="item.createTime" :value="`${typeList[item.amountType]}${item.integral}权益`">
        <template>
          <span style="float:left;color: #333333;" :style="{color:item.amountType==1?'red':'green'}">{{typeList[item.amountType]}}</span>
          <span style="color: #333333;">{{item.amount}} 油卡余额</span>
        </template>
      </Cell>
    </List>
  </div>
</template>

<script>
import { storageGet, storageSet } from '@/utils/utils'
import { Cell, List } from 'vant'
import { getWlynOilCardRecordPage } from '@/api/user'
export default {
  name: 'oilCard',
  components: {
    Cell, List
  },
  props: {},
  data() {
    return {
      typeList: ['领取', '充值'],
      list: [],
      loading: false,
      finished: false,
      active: 0,
      pageNum: 1, //　页码
      pageSize: 10, // 条数
      phone: '',   //电话
      total: ''
    };
  },
  created() {
    this.changeParpms()
  },
  methods: {
    changeParpms() {
      // 进来先清空
      let userInfo = storageGet('userInfo')
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        usedPhone: userInfo.bindPhone,
      }
      getWlynOilCardRecordPage(
        params
      ).then(res => {
        this.total = res.data.total
        if (res.code == 200) {
          this.list = [...this.list, ...res.data.records]
        }
        setTimeout(() => {
          // 加载状态结束
          this.loading = false;
        }, 800)
        // 数据全部加载完成
        if (this.list.length >= this.total || this.total == 0) {
          this.finished = true;
        }
        console.log('this.finished', this.finished)
      })
    },
    onload() {
      this.pageNum++
      this.changeParpms()
    },
    changeActive(name) {
      this.list = []
      this.finished = false;
      this.pageNum = 1
      if (name == 0) {
        this.changeParpms()
      } else {
        this.changeParpms(name - 1)
      }
    },
  },
};
</script>
<style lang="scss">
.history-box {
  .van-tabs__line {
    width: 20px;
    background-color: #f46356;
  }
}
</style>