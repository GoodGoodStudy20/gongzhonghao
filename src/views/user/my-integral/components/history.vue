<template>
  <div class="history">
    <div class="title">
      <img src="@/assets/img/Allintegral.png" alt="" />
      <span>{{ countIntegral }}</span>
    </div>
    <div class="history-conter">
      <Tabs
        v-model="active"
        sticky
        @change="changeActive"
        swipeable
        title-active-color="#F46356"
        color="#F46356"
      >
        <Tab title="权益收支明细"> </Tab>
        <Tab title="权益兑换记录"> </Tab>
        <div class="history-conter-button" v-if="!type">
          <button
            :class="{ active: Active == 0 }"
            @click="Active = 0"
            style="margin-right:14px"
          >
            全部
          </button>
          <button
            :class="{ active: Active == 3 }"
            @click="Active = 3"
            style="margin-right:14px"
          >
            已获取
          </button>
          <button :class="{ active: Active == 2 }" @click="Active = 2">
            已使用
          </button>
        </div>
        <List
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onload"
        >
          <Cell
            v-for="(item, index) in list"
            :key="index"
            :value="`${typeList[item.integralType]}${item.integral}权益`"
          >
            <template>
              <div class="list-box">
                <div class="time">
                  <span class="time-title">{{
                    item.sourceType != 12
                      ? typeList[item.sourceType]
                      : `${typeList[item.sourceType]} - ${
                          item.refereesPhone
                        } - ${item.refereesName}`
                  }}</span>
                  <span class=" time-item">{{ item.createTime }}</span>
                </div>
                <div
                  class="Num-minus"
                  v-if="item.integralType == 0 || item.integralType == 4 "
                >
                  +{{ item.integral }}
                </div>
                <div class="Num-add" v-else>
                  <span v-if="!type">-</span> {{ item.integral }}
                </div>
              </div>
            </template>
          </Cell>
        </List>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { storageGet, storageSet } from '@/utils/utils'
import { Tab, Tabs, Cell, List } from 'vant'
import { selectPromote } from '@/api/user'
export default {
  name: 'myIntegralHistory',
  components: {
    Tab, Tabs, Cell, List
  },

  data() {
    return {
      start:false,
      countIntegral: 0,
      endTime:null,
      type: 0,
      Active: 0,
      // typeList: ['兑换码兑换权益', '换取权益', '提现', '领取前三后四权益', '广东中石化', '河南中石化', '广东中石油', '变蛙', '京东云', '微云', '卡卷套餐', '充值'],
      typeList: ['其他','兑换码领取权益', '领取权益', '提现', '领取前三后四权益', '广东中石化', '河南中石化', '广东中石油', '腾讯vip', '京东E卡', '话费充值', '卡券套餐', '充值', '分享获利'],
      list: [],
      loading: true,
      finished: true,
      active: 0,
      integralType: '', //历史类型
      isPage: 0, //不分页
      pageNum: 1, //　页码
      pageSize: 10, // 条数
      phone: '',   //电话
      total: ''
    };
  },
  watch: {
    Active(val) {
      console.log('val', val);
      this.list = []
      this.pageNum = 1
      this.changeParpms(val,true)
      
    }
  },
  created() {
    this.changeParpms(0)
    if ((this.$route.query.countIntegral ?? '') !== '') {
      this.countIntegral = this.$route.query.countIntegral
    }
  },
  methods: {
    async changeParpms(e,t) {
      // 进来先清空
      let userInfo = storageGet('userInfo')
      let params = {
        type: e,
        isPage: this.isPage,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        phone: userInfo.bindPhone,
      }
      console.log(this.pageNum);
      await selectPromote(
        params
      ).then(res => {
        if (res.code == 200) {
          this.total = res.data.total
          if(t) {
            this.list = []
          }
          res.data.records.forEach(item => {
            this.list.push(item)
          })
        }
        setTimeout(() => {
          // 加载状态结束
          this.loading = false;
        }, 500)
        // 数据全部加载完成
        if (this.list.length >= this.total || this.total == 0 || this.pageSize > res.data.records.length) {
          this.finished = true;
        } else {
          this.pageNum++
          this.finished = false;
        }
        console.log('this.finished', this.finished)
      })
    },
    onload() {
      console.log('onload', this.finished);
      if (this.type == 1) {
        this.changeParpms(1)
      } else {
        this.changeParpms(this.Active)
      }
    },
    changeActive(name) {
      this.list = []
      this.pageNum = 1
      this.type = name
      console.log('name', name);
      this.changeParpms(name)
    },
  },
}
</script>

<style scoped lang="scss">
.history {
  padding: 10px 16px;
  background-color: #f6f7f9;
  min-height: 100vh;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    img {
      width: 28px;
      height: 28px;
    }
  }
  &-conter {
    background-color: #fff;
    border-radius: 6px;
    &-button {
      margin: 10px 12px 10px;
      padding-top: 12px;
      border-top: 1px solid #eee;
      button {
        width: 67px;
        height: 26px;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 50px;
        border: none;
        opacity: 0.4;
      }
      .active {
        opacity: 10;
        color: #fff;
        background: linear-gradient(145.43deg, #ffaf9b 10.56%, #f14f44 91.33%);
      }
    }
  }
  .list-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .time {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      margin-right: 10px;
      &-title {
        font-size: 14px;
        opacity: 0.8;
      }
      &-item {
        font-size: 12px;
        opacity: 0.5;
      }
    }
    .Num-add {
      font-size: 15px;
      opacity: 0.9;
    }
    .Num-minus {
      font-size: 15px;
      color: #fb584d;
    }
  }
}
</style>
