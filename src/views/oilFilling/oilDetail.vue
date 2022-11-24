<template>
  <div class="oilDetail">
    <div class="cat-img"><img src="@/assets/img/Frame115.png" alt=""></div>
    <div class="address">
        <div class="address-name">{{$store.state.addressDetail.stationName}}</div>
        <div class="address-time"><Icon class="clock" name='clock-o' size='18'></Icon>24小时营业</div>
        <div class="address-text">
            <div class="address-text-item" @click="showSheet = true">
                <span class="location"><Icon name='location-o' size='18'></Icon></span>
                <span class="stationAddress">{{$store.state.addressDetail.stationAddress}}</span>
                <span class="navigation"><Icon name='guide-o' size="18"></Icon><i>导航</i></span>
            </div>
            <div class="address-text-distance">距{{$store.state.addressDetail.distance}}km</div>
        </div>
    </div>
    <div v-if="$store.state.active==0 && $store.state.product && $store.state.product.name">
        <ElectronicVoupons :list="$store.state.vouchersList" :mid="$store.state.mid" :product="$store.state.product" :city="$store.state.city"></ElectronicVoupons>
    </div>
    <div v-show="($store.state.active==1 || $store.state.active2==1) && $store.state.product2 && $store.state.product2.name">
        <Recharge :mid="$store.state.mid" :list="$store.state.vouchersList2" :product='$store.state.product2' :city="$store.state.city"></Recharge>
    </div>
    <div class="hint">
        <span class="hint-title">温馨提示</span>
        <span class="hint-ban">1.请在车内操作手机，站内严禁拨打手机;</span>
        <span class="hint-phone">2.如有疑问，请咨询 <i>400-6310-818</i>。</span>
    </div>
    <ActionSheet cancel-text="关闭" v-model="showSheet" duration=0.4>
      <a class="map-jump-btn" :href="gaodeMap">高德地图</a>
      <a class="map-jump-btn" :href="baiduMap">百度地图</a>
    </ActionSheet>
    <!-- <Popup v-model="showSheet" position="bottom" :style="{ height: '30%' }" >
      <a class="map-jump-btn" :href="gaodeMap">高德地图</a>
      <a class="map-jump-btn" :href="baiduMap">百度地图</a>
    </Popup> -->
  </div>
</template>

<script>
import { Icon,ActionSheet,Toast,Popup} from "vant";
// import { Icon,Toast} from "vant";
import { bd_encrypt } from '@/utils/utils'
import ElectronicVoupons from './electronicVoupons.vue'
import Recharge from './recharge.vue'
export default {
components:{ElectronicVoupons,Recharge,Icon,ActionSheet,Toast,Popup},
// components:{ElectronicVoupons,Recharge,Icon,Toast},
data(){
    return {
        showSheet:false,
        // showSelectShop:false
    }
},
 computed: {
    gaodeMap() {
      return 'https://uri.amap.com/marker?position=' + this.$store.state.addressDetail["lng"] + ',' + this.$store.state.addressDetail["lat"] + '&name=' + this.$store.state.addressDetail["stationName"] + '-' + this.$store.state.addressDetail["stationAddress"]
    },
    baiduMap() {
      let item = bd_encrypt(this.$store.state.addressDetail["lng"], this.$store.state.addressDetail["lat"])
      return 'https://api.map.baidu.com/marker?location=' + item["lat"] + ',' + item["lng"] + '&title=' + this.$store.state.addressDetail["stationName"] + '&content=' + this.$store.state.addressDetail["stationAddress"] + '&output=html'
    },
  },
created(){
console.log('addressDetail',this.$store.state.addressDetail);
}

}
</script>

<style lang="scss" scoped>
.oilDetail{
    // padding: 0 10px;
    // filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
    // margin: 0 10px;
    .cat-img{
        opacity: 0.6;
        filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
        width: 351px;
        margin: 12px auto 0;
        height: 280px;
        margin-bottom: -200px ;
        // background-color: rgba(0, 0, 0, 0.08);
        // background:url('/src/assets/img/Frame 115.png');
        // background-size:"cover";
        // background-position:left top;
        border-radius: 8px;
        box-sizing: border-box;
        img{
            width: 100%;
        }
    }
    .address{
        filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.08));
        margin: 12px 10px;
        padding: 12px 10px;
        background-color: #fff;
        border-radius: 6px;
        &-name{
            color: #333333;
            font-size: 16px;
            font-weight: 700;
        }
        &-time{
            font-size: 13px;
            color: #333333;
            padding: 14px 0;
            border-bottom: 1px solid #ddd;
            .clock{
                margin-right: 9px;
            }
        }
        &-text{
            margin-top: 14px;
            &-item{
                display: flex;
                font-size: 13px;
                .location{
                    margin-right: 9px;
                }
                .stationAddress{
                    flex:1;
                }
                .navigation{
                    display: flex;
                    flex-direction: column;
                    justify-items: center;
                    align-items: center;
                    i{
                        font-size: 10px;
                        margin-top: 4px;
                        font-style: normal;
                    }
                }
            }
            &-distance{
                font-size: 12px;
                opacity: 0.6;
                margin-left: 22px;
            }
        }
    }
    .hint{
        margin: 22px 22px 48px;
        display: flex;
        flex-direction: column;
        font-size: 13px;
        &-title{
            font-size: 16px;
            color: #333333;
            // opacity: 0.9;
        }
        &-ban{
            margin: 14px 0;
            // color: #707070;
        }
        // &-phone{
        //     font-size: 12px;
        // }
        i{
          font-style: normal;
          color: #005de9;
        }
    }
}
.map-jump-btn {
  color: #333333;
  width: 100%;
  display: inline-block;
  text-align: center;
  font-size: 18px;
  padding: 10px 0px;
  line-height: 30px;
}
.map-jump-btn:first-child {
  border-bottom: 1px solid #eee;
}

</style>