<!--
 * @Author: your name
 * @Date: 2021-01-20 19:07:05
 * @LastEditTime: 2021-01-21 14:00:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\zhijianche_mobile\src\App.vue
-->
<template>
  <router-view v-wechat-title="$route.meta.title" :nCity="City" :nCityCode="CityCode" />
</template>

<script>
import { getVersion } from "@/api/user.js";
import { storageGet, storageSet, storageRemove } from "@/utils/utils";
(function () {
  if (
    typeof WeixinJSBridge == "object" &&
    typeof WeixinJSBridge.invoke == "function"
  ) {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", handleFontSize);

      document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
    }
  }

  function handleFontSize() {
    // 设置网页字体为默认大小

    WeixinJSBridge.invoke("setFontSizeCallback", { fontSize: 0 });

    // 重写设置网页字体大小的事件

    WeixinJSBridge.on("menu:setfont", function () {
      WeixinJSBridge.invoke("setFontSizeCallback", { fontSize: 0 });
    });
  }
})();
import axios from "@/utils/http";
import wx from "weixin-js-sdk";
export default {
  name: "App",
  data() {
    return {
      City: "",
      CityCode: "",
    };
  },
  async created() {
    await this.wxH5Share.getConfig('话费充值只要94折', '电信、联通、移动三大运营商都在！', window.location.href)
    this.$store.replaceState(
      Object.assign(
        this.$store.state,
        JSON.parse(sessionStorage.getItem("beforeunload"))
      )
    );
    window.addEventListener("beforeunload", () => {
      let state = JSON.stringify(this.$store.state);
      console.log("刷新", state);
      sessionStorage.setItem("beforeunload", state);
    });
    this.getNowPosition();
    // this.getCityPosition();
    getVersion().then((res) => {
      let result = res.data || "";
      if (localStorage.getItem("version") != result) {
        localStorage.setItem("version", result);
        location.reload(true);
      }
    });
  },
  methods: {
    getConfig() {
      //自定义分享所需要的参数
      axios
        .get("/wxUser/getJsJDK", {
          params: {
            url: location.href.split("#")[0],
          },
        })
        .then(async (res) => {
          await wx.config({
            debug: true, //测试时候用true 能看见wx.config的状态是否是config:ok
            appId: res.data.appId, // 必填，公众号的唯一标识（公众号的APPid）
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: [
              "onMenuShareTimeline", // 分享给好友
              "onMenuShareAppMessage", // 分享到朋友圈
              "updateAppMessageShareData", // 分享给好友1.4
              "updateTimelineShareData", // 分享到朋友圈1.4
              "onMenuShareQQ",
              "onMenuShareWeibo",
            ], // 必填，需要使用的JS接口列表
            openTagList: ["wx-open-launch-app"], // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
          });
          wx.ready(function () {
            var shareData = {
              title: "九华保1111", // 分享标题
              desc: "23212", // 分享描述
              link: window.location.href.includes('?') ? window.location.href.split('?')[0] : window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl:
                "https://jinshang-hz.oss-cn-hangzhou.aliyuncs.com/data/share/images/recruit_action.jpg", // 分享图标
              success: (res) => {
                console.log("设置成功");
              },
            };
            //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
            wx.updateAppMessageShareData(shareData);
            // wx.onMenuShareTimeline(shareData);
            // wx.onMenuShareAppMessage(shareData);
            //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
            wx.updateTimelineShareData(shareData);
            // wx.onMenuShareQQ(shareData);
            // wx.onMenuShareWeibo(shareData);
          });

          wx.error(function (res) {
            console.log(res);
          });
        });
    },
    onload() {
      this.getNowPosition(); //获取当前位置
    },
    getCityPosition() {
      let that = this;
      var map, geolocation;
      map = new AMap.Map("map", {
        resizeEnable: true,
      });
      map.plugin("AMap.Geolocation", function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 5000,
        });
        geolocation.getCityInfo(getCity);
      });
      function getCity(status, result) {
        if (status != "complete") {
          console.log("定位失败");
        } else {
          console.log("定位成功", result);
          //  这里获取自动定位的城市 以及城市编码
          that.City = result.city
          that.CityCode = result.adcode
          storageSet("City", result.city);
          storageSet("CityCode", result.adcode);
          storageSet("Province", result.province);
          console.log(that.City, that.CityCode);

          // that.SeachKeyCode(result.city);
        }
      }
    },
    toAMap(lng, lat) {
      const X_PI = (Math.PI * 3000.0) / 180.0;
      let x = lng - 0.0065;
      let y = lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
      let amap_lng = z * Math.cos(theta);
      let amap_lat = z * Math.sin(theta);
      return {
        lng: amap_lng,
        lat: amap_lat,
      };
    },
    bMapTransAMap(lng, lat) {
      let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
      let x = lng - 0.0065;
      let y = lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      let lngs = z * Math.cos(theta);
      let lats = z * Math.sin(theta);

      return {
        lng: lngs,
        lat: lats,
      };
    },
    bMapTransQQMap(lng, lat) {
      let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
      let x = lng - 0.0065;
      let y = lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      let lngs = z * Math.cos(theta);
      let lats = z * Math.sin(theta);

      return {
        lng: lngs,
        lat: lats,
      };
    },
    //百度地图
    getNowBaiduPosition() {
      // var geolocation = new BMap.Geolocation();
      let that = this;
      // console.log('geolocation', geolocation);
      var geolocation = new BMap.Geolocation();
      // 开启SDK辅助定位
      // newGeolocation.enableSDKLocation();
      geolocation.getCurrentPosition(
        function (data) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            let positionData = that.bMapTransAMap(data.point.lng, data.point.lat)
            // var baidu = [data.point.lng, data.point.lat];
            // AMap.convertFrom(baidu, 'baidu', function (status, result) {
            //   if (result.info === 'ok') {
            //     var lnglats = result.locations; // Array.<LngLat>
            //   }
            // });
            storageSet("lat", positionData.lat);
            storageSet("lng", positionData.lng);
            storageSet("Province", data.address.province);
            that.SeachKeyCode(data.address.city);
            // that.SeachKeyCodeBaiDu(positionData.lng, positionData.lat);
            console.log("百度精准定位成功：", data);
          } else {
            console.log("百度定位精准位置错误：");
          }
        },
        {
          // 指示浏览器获取高精度的位置，默认为false
          enableHighAccuracy: true,
          // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
          timeout: 5000,
          // 最长有效期(30S)，在重复获取地理位置时，此参数指定多久再次获取位置
          // maximumAge: 30 * 1000,
        }
      );
    },

    //高德地图
    getNowPosition() {
      let that = this;
      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 5000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });
        // console.log(geolocation, '1111');
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);
        function onComplete(data) {
          console.log("高德精准定位成功：", data);
          storageSet("lat", data["position"].lat);
          storageSet("lng", data["position"].lng);
          storageSet("Province", data.addressComponent.province);
          // if (!that.$store.state.hasLocation) {//判断是否修改过城市
          // that.getCityPosition()
          that.SeachKeyCode(data.addressComponent.city);
          // }
        }
        function onError(data) {
          console.log('未进入百度地图导航');
          that.getNowBaiduPosition();
          console.log("高德定位精准位置错误：", data);
          // 定位出错
          // that.getlnglatLaction()
        }
      });
    },
    SeachKeyCode(city) {
      var that = this;
      AMap.plugin("AMap.Geocoder", function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        });
        geocoder.getLocation(city, function (status, result) {
          console.log("定位,", status, result);
          if (status === "complete" && result.info === "OK") {
            // 判断是否获取过定位
            that.City = city;
            that.CityCode = result.geocodes[0].adcode;
            storageSet("City", city);
            storageSet("CityCode", result.geocodes[0].adcode);
            console.log(that.City, that.CityCode);

            //通过当前地区code查询洗车供应商
            // if (!that.City && !that.CityCode) {
            //   that.getCityPosition()
            // }
          }
        });
      });
    },
  },
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
  margin: 0;
  -webkit-text-size-adjust: 100% !important;

  text-size-adjust: 100% !important;

  -moz-text-size-adjust: 100% !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* top-bar */
.top-bar {
  position: fixed;
  left: 0;
  width: 100%;
  height: 45px;
  background-color: #ffffff;
  z-index: 10;
  display: inline-block;
  text-align: center;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
}
.top-bar-title {
  color: #000000;
  line-height: 45px;
  font-size: 16px;
  font-weight: bolder;
  font-weight: 600;
}
.back-icons {
  position: absolute;
  left: 0;
  top: 0;
  padding: 14px 20px 10px 10px;
}
.back-icons svg {
  width: 20px;
  height: 20px;
  float: left;
}

.text-ellipsis {
  overflow: hidden; /*超出部分隐藏*/
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
}
.rich-text {
  img {
    width: 100%;
  }
  p {
    margin: 2px;
    padding: 2px;
    color: #666;
    font-size: 14px;
  }
}
.extend-title {
  content: " ";
  width: 32px;
  height: 13px;
}
.common-title {
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after {
    @extend .extend-title;
    margin-left: 6px;
    background: url("assets/img/right.png");
    background-size: 100% 100%;
  }
  &::before {
    @extend .extend-title;
    margin-right: 6px;
    background: url("assets/img/left.png");
    background-size: 100% 100%;
  }
}
.van-radio {
  align-items: flex-start !important;
}
</style>
