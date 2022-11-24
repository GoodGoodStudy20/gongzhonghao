<template>
  <van-dialog v-model="show" title="您有被退回的提现记录" :beforeClose="beforeClose" @confirm="cancel">
    <div class="box">
      <Cell v-for="(item,index) in list" :key="index" :title="item.returnReason" :label="item.createTime" center>
        <template #icon>
          <span class="amountleft">{{item.amount}}</span>
        </template>
        <template #right-icon>
          <Button @click="gotodetail(item)" size="small" type="info" class="btn" round>去修改</Button>
        </template>
      </Cell>
      <Cell></Cell>
    </div>
  </van-dialog>
</template>

<script>
import { Cell, Dialog, Button } from 'vant'
export default {
  name: 'DrawalList',
  components: {
    Button, Cell, 'van-dialog': Dialog.Component
  },
  props: ['show', 'list'],
  methods: {
    beforeClose(action, done) {
      done(false)
    },
    cancel() {
      this.$emit('update:show', false)
    },
    gotodetail(item) {
      this.cancel()
      this.$router.push({
        path: '/user/my-integral/cashdetails/modifypage', query: {
          id: item.id
        }
      })
    },
  }
}
</script>

<style scoped>
.amountleft {
  font-size: 18px;
  color: orangered;
  padding-right: 30px;
}
.box {
  margin-top: 10px;
  border-top: 1px solid #f2f2f2;
  height: 300px;
  overflow: auto;
  /* background: #f5f5f5; */
}
.btn {
  width: 67px;
  height: 24px;
  background: #6cb9ff;
  border: none;
  padding: 10px;
}
</style>
