<template>
  <div class="wrap-box">
    <WashShop :shopInfo="shopInfo" @changeShop="changeShopInfo"></WashShop>
    <div class="content-box" v-if="(list && list.length) || (list2 && list2.length)">
      <div class="title-bar" v-if="list && list.length">洗车券</div>
      <WashCoupons v-if="list && list.length" :list="list" :city="city" :regionCode="regionCode"></WashCoupons>
      <div class="title-bar" v-if="list2 && list2.length">保养券</div>
      <WashCoupons v-if="list2 && list2.length" :list="list2" :city="city" :regionCode="regionCode"></WashCoupons>
    </div>
    <div class="text-box">
      <!-- <div class="common-title">洗车说明</div> -->
      <div class="text-box-title">服务介绍</div>
      <!-- <div v-for="(text,i) in textList" :key="i" class="text">{{text}}</div> -->
      <div v-for="(v,i) in textList" :key="i" class="item">
        <div class="item-title">{{v.title}}</div>
        <div class="item-text" v-html="v.text" ></div>
      </div>
    </div>
    <UseProcess></UseProcess>
  </div>
</template>
<script>
import { Toast, Swipe, SwipeItem, Popup, DropdownMenu, DropdownItem, ActionSheet, Image as VanImage, Icon } from 'vant';
import { getVouchers, getHeDaShiShopInfo, getCheDuoShopInfo } from '@/api/user'
import { storageGet, bd_encrypt } from '@/utils/utils'
import SelectShop from '@/components/SelectShop.vue'
import WashShop from '@/components/WashShop.vue'
import WashCoupons from '@/components/WashCoupons'
import UseProcess from '@/components/UseProcess'
export default {
  components: {
    SelectShop, WashShop, WashCoupons, UseProcess, Swipe, SwipeItem, Popup, DropdownMenu, DropdownItem, ActionSheet, VanImage, Icon
  },
  name: 'washCarShop',
  data() {
    return {
      list: [],
      list2: [],
      shopInfo: {
        shopName: '',
        tradeTime: '',
        shopAddress: '',
      },
      regionCode: '',
      lat: '',
      lng: '',
      rid: '',
      city: storageGet('City'),
      textList: [
        {title:'【标准洗车】',
        text:'<span style="line-height: 25px;opacity: 0.7;" >接待、验车、取脚垫、冲水、打泡沫、擦洗、再次冲水、拖水、擦水、吹水、擦内室、洗脚垫、脚垫还原、轮胎上光、交车、送车。</span>'
        },
        {title:'【精致洗车】',
        text:'<span style="line-height: 25px;opacity: 0.7;">标准洗车+喷除胶剂&泼电脑水蜡</span>'
        },
        {title:'【温馨提示】',
        text:'<span style="line-height: 25px;opacity: 0.7;">1.部分MPV、大型SUV等特殊车厢需向店家额外支付费用；</span><br><span style="line-height: 25px;opacity: 0.7;">2.商品有效期30天，支持过期自动退款。</span>'
        },
      ],
    }
  },
  computed: {
    carType() {
      return this.$route.query.type
    }
  },

  created() {
    console.log(1231, this.$route)
    this.lat = storageGet('lat')
    this.lng = storageGet('lng')
    this.regionCode = storageGet('CityCode')
    this.changeShopInfo(this.$route.query)
  },
  methods: {
    async getList() {
      for (let i = 1; i < 3; i++) {//i==1 查洗车券 i==2 查保养券
        let params = {
          pageNum: 1,
          pageSize: 10,
          vouchersType: i,
          regionCode: this.regionCode
        }
        await getVouchers(params).then(res => {
          let arr = res.data ? res.data.records : []
          arr = arr.filter(item => item.supplierType == this.carType)
          console.log(this.carType, arr)
          if (this.carType == 1) {//鹤大师
            //筛选当前店铺提供的服务
            arr = arr.filter(item => this.shopInfo.services.includes(item.externalNumber))
          }
          if (i == 1) {
            this.list = arr
          } else {
            this.list2 = arr
            if (!this.list.length && !this.list2.length) {
              Toast('该店铺暂无服务')
              // this.$router.go(-1)
            }
          }
        })
      }
    },
    async changeShopInfo(row) {
      console.log(this.carType)
      if (this.carType == 1) {
        await getHeDaShiShopInfo({ id: row.id }).then(res => {
          let item = res.data || {}
          this.shopInfo = item
          this.shopInfo.type = 1
          this.shopInfo.services = this.shopInfo.services.split(',')
          // this.shopInfo.services = item.list.map(i => i.serviceCode)
          this.getList();
        })
      } else if (this.carType == 0) {
        getCheDuoShopInfo({
          shopCode: row.shopCode,
          lat: storageGet('lat'),
          lng: storageGet('lng'),
        }).then(res => {
          let item = res.data || {}
          this.shopInfo = {
            phone: item.contactMobile || item.contactMobile2,
            distance: item.distance,
            lat: item.lat,
            lng: item.lng,
            address: item.shopAddress,
            logo: item.shopIcon,
            shopCode: item.shopCode,
            name: item.shopName,
            tradeTime: item.tradeTime,
            type: 0
          }
          console.log('shopInfo',this.shopInfo);
          this.getList();
        })
      }
    },

    gotoBuy(item) {
      console.log(item)
      this.$router.push(`/washCar/purchase?city=${this.city}&regionCode=${this.regionCode}&vouchersId=${item.vouchersId}`)
    }
  },
};
</script>
<style scoped lang="scss">
@mixin title{
    width: 110px;
    height: 28px;
    margin: 0 auto;
    text-align: center;
    line-height: 28px;
    font-size: 14px;
    color: #FB584D;
    background-image: url('../../assets/img/Rectangle 165.png');
    background-position: top;
    background-size: 110px 28px;
    background-repeat: no-repeat;
    margin-bottom: 14px;
}
.wrap-box {
  width: 100%;
  background-color: #F6F7F9;
  padding-bottom: 20px;
}

.content-box {
  margin-top: -7px !important;
  margin: 0px auto;
  width: 351px;
  border-radius: 6px;
  .title-bar {
    font-size: 18px;
    margin-bottom: 10px;
    padding: 0px 8px;
    font-weight: 400;
    opacity: 0.9;
    font-size: 17px;
    width: 94%;
  }
}
.text-box {
  padding: 0 10px 20px 10px;
  margin: 7px auto;
  width: 351px;
  background: #ffffff;
  // box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  &-title{
    @include title;
  }
  .item{
      // margin-top: 14px;
    .item-title{
      margin-top: 8px;
      font-size: 14px;
      font-weight: 700;
      opacity: 0.8;
    }
    .item-text{
      margin-top: 4px;
      font-size: 12px;
    }
  }
}
</style>
