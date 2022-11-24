<template>
  <div style="background:#f5f5f5;height:100%">
    <PullRefresh v-model="refreshing" @refresh="onRefresh" v-if="list && list.length">
      <CellGroup v-for="item in list" :key="item.id" style="margin:10px;box-sizing:border-box;border-radius:15px;overflow:hidden">
        <Cell :title="item.bankName" :value="item.bankCard" @click="chooseOne(item)"></Cell>
        <Cell v-if="!type">
          <template #title>
            <Checkbox v-model="item.isDefault" @click="chooseClick(item)">设为默认</Checkbox>
          </template>
          <template #right-icon>
            <Button type="danger" style="margin-left:10px" @click="deleteOne(item)" size="small">删除</Button>
          </template>
        </Cell>
      </CellGroup>
    </PullRefresh>
    <Empty description="暂无银行卡" v-else />
    <div class="footer" v-if="!type">
      <Button plain icon="plus" type="primary" @click="addClick" style="width:50%">添加银行卡</Button>
    </div>
  </div>
</template>

<script>
import { Dialog, Cell, List, PullRefresh, Button, CellGroup, Checkbox, CheckboxGroup, Toast, Empty } from 'vant';
import { getBankCardByPhone, updateBankCardIsDefault, deleteBankCard } from '@/api/user'
export default {
  name: 'userBankList',
  components: { Cell, List, PullRefresh, Button, CellGroup, Checkbox, CheckboxGroup, Empty },
  props: ['type'],
  data() {
    return {
      list: [],
      finished: false,
      refreshing: false,
    }
  },
  created() {
    this.onLoad()
    console.log(this.$route)
  },
  methods: {
    onLoad() {
      let phone = JSON.parse(localStorage.getItem('userPhone'))
      getBankCardByPhone({ phone: phone }).then(res => {
        this.list = res.data
        this.refreshing = false
      })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      this.onLoad();
    },
    deleteOne(item) {
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          deleteBankCard({ id: item.id }).then(async res => {
            await done()
            if (res.code == 200) {
              Toast('删除成功', 1200);
              this.onRefresh()
            } else {
              Toast('删除失败', 1200);
            }
          }).catch(err => {
            done()
            Toast('删除失败', 1200);
          })
        } else {
          done();
        }
      }
      Dialog.confirm({
        title: '确认删除',
        beforeClose
      })
    },
    chooseClick(item) {
      updateBankCardIsDefault({ id: item.id }).then(res => {
        if (res.code == 200) {
          Toast('修改成功', 1200);
          this.onRefresh()
        } else {
          Toast('修改失败', 1200);
        }
      })
    },
    addClick() {
      this.$router.push('/user/set/bankAdd')
    },
    chooseOne(item) {
      this.$emit('click', item)
    }
  }
}
</script>
<style scoped>
.footer {
  position: fixed;
  bottom: 10px;
  width: 100vw;
  display: flex;
  justify-content: center;
}
</style>