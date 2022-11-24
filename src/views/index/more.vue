<template>
  <div class="home-box">
    <div class="swipe-box">
      <Swipe :autoplay="3000" indicator-color="white" class="swipe" indicatorColor="#F46356">
        <SwipeItem v-if="!home1.childrenList || !home1.childrenList.length">
          <img style="height:100%;width:100%;" src="@/assets/img/banner111.jpg" />
        </SwipeItem>
        <SwipeItem v-for="item in home1.childrenList" :key="item.id">
          <img style="height:100%;width:100%;" :src="item.icon" />
        </SwipeItem>
      </Swipe>
    </div>
    <div v-for="home2 in list" class="menu-box" :key="home2.id">
      <p class="title-box">{{home2.label}}</p>
      <div class="product-box" v-if="home2.childrenList && home2.childrenList.length">
        <div class="product" v-for="(item,i) in home2.childrenList" :key="i" @click="jumpUrl(item)">
          <img class="img" v-lazy="item.icon" alt="">
          <p class="title">{{item.label}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storageGet, storageSet } from '@/utils/utils'
import { getAllMobileMenuList ,getJsJDK} from '@/api/user'
import { Swipe, SwipeItem, Lazyload, Toast, Icon, Grid, GridItem } from 'vant';
export default {
  components: {
    Swipe, SwipeItem, Lazyload, Icon, Grid, GridItem
  },
  name: 'more',
  data() {
    return {
      home1: {},//轮播图
      list: [],
      regionCode: storageGet('CityCode')
    }
  },
  created() {
    getJsJDK()
    this.onload()
  },
  computed: {
    provinceCode() {
      let code = this.regionCode ? (this.regionCode.substring(0, 2) + '0000') : ''
      return code
    }
  },
  methods: {
    onload() {
      //查询首页菜单
      getAllMobileMenuList({ type: 0, isDisable: 0 }).then(res => {
        this.menuList = res.data || []
        let arr = res.data || []
        arr.forEach(item => {
          let obj = JSON.parse(JSON.stringify(item))
          if (!obj.childrenList) return
          obj.childrenList = obj.childrenList.filter(item => {
            let regionCode = item.regionCode ? item.regionCode.split(',') : ''
            return ((!regionCode || regionCode.includes(this.provinceCode)) && item.isDisable == 0)
          })
          this[item.code] = obj
          if (!['home1', 'home2', 'home3', 'home4', 'home5', 'home6'].includes(item.code) && obj.childrenList && obj.childrenList.length) {
            let regionCode = item.regionCode ? item.regionCode.split(',') : ''
            if (!regionCode || regionCode.includes(this.provinceCode)) {
              this.list.push(obj)
            }
          }
        });
        // this.list = arr.filter(item => !['home1', 'home2', 'home3', 'home4', 'home5', 'home6'].includes(item.code) && item.childrenList && item.childrenList.length)
      })
    },
    jumpUrl(item) {
      if (item.path == '#') {
        Toast('敬请期待')
      } else {
        if (item.path.indexOf('http') != -1) {
          window.location.href = item.path
        } else {
          storageSet('Icon', item.icon)
          let path = item.path.indexOf('?') != -1 ? `${item.path}&id=${item.id}` : `${item.path}?id=${item.id}`
          if (path.indexOf(',') > -1) {
            let productIdList = []

            path.split(',').forEach(it => {
              let a = it.split('&')[0].split('=')[1]
              productIdList.push(a)
            })
            storageSet('productIdList', productIdList)
            let path1 = path.split(',')[1]
            this.$router.push(path1)
          } else {
            let productIdList = []
            let c = path.split('?')[1].split('&')[0].split('=')[1]

            productIdList.push(c)
            storageSet('productIdList', productIdList)
            this.$router.push(path)
          }

          // this.$router.push(`${item.path}?id=${item.id}`)
        }
      }
    },

  }
};
</script>
<style scoped lang="scss">
.home-box {
  background: #f1f4f8;
  height: 100vh;
  padding: 10px 12px 0;
  overflow: auto;
}
.title-box {
  height: 16px;
  padding: 0;
  margin: 0px 0 14px;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
}
.swipe-box {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transform: translateY(0);
  .swipe {
    height: 100%;
    border-radius: 8px;
  }
}
.menu-box {
  border-radius: 6px;
  background: #fff;
  padding: 10px 12px;
  margin-top: 10px;
}
.product-box {
  width: 100%;
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
  .product {
    margin-top: 14px;
    width: 25%;
    height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // text-align: center;
    flex-shrink: 0;
    .img {
      width: 48px;
      height: 48px;
    }
    .title {
      padding: 0;
      margin: 0;
      margin-top: 8px;
      // width: 25%;
      height: 16px;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      color: #000000;
      white-space: nowrap; /*规定段落中的文本不进行换行 */
    }
  }
}
</style>