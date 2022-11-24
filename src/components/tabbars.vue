<template>
  <div>
    <Tabbar v-model="tabbarActive" style="border-top:1px solid #EAEAEA;" :route="true" active-color="#F46356">
      <TabbarItem url="/#/index/index">
        <span :style="!tabbarActive?'color:#F46356':''">首页</span>
        <template #icon>
          <img :src="!tabbarActive ? tabbarIcon[0] : tabbarIcon[1]" style="width:24px;height:24px" />
        </template>
      </TabbarItem>
      <TabbarItem url="/#/user/index">
        <span :style="tabbarActive?'color:#F46356':''">我的</span>
        <template #icon>
          <img :src="tabbarActive ? tabbarIcon[2] : tabbarIcon[3]" style="width:24px;height:24px" />
        </template>
      </TabbarItem>
    </Tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from 'vant';
export default {
  name: 'tabbar',
  props: ['active'],
  components: {
    Tabbar, TabbarItem
  },
  data() {
    return {
      tabbarIcon: [
        require('@/assets/img/tabbaritem/icon_home_n@3x.png'),
        require('@/assets/img/tabbaritem/icon_home_h@3x.png'),
        require('@/assets/img/tabbaritem/icon_my_n@3x.png'),
        require('@/assets/img/tabbaritem/icon_my_h@3x.png'),
      ],
      tabbarActive: 1,
    }
  },
  mounted() {
    this.tabbarActive = this.active
  }
}
</script>