/*
 * @Author: ken
 * @Date: 2020-12-11 10:19:31
 * @LastEditTime: 2021-01-22 13:36:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \scweb\src\main.js
 */
import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import VueWechatTitle from "vue-wechat-title"; //页面头部
import vueCity from "vue-city-select"; //城市选择插件
// import BaiduMap from 'vue-baidu-map'
import automaticLogOn from "@/components/automaticLogOn/index.js";
Vue.use(automaticLogOn);
import { Lazyload } from "vant";
Vue.use(Lazyload, {
  lazyComponent: true,
});
Vue.use(vueCity);
Vue.use(VueWechatTitle);
// Vue.use(BaiduMap, {
//     ak: '9nZCCaSAzsq2ONsQHLaN4zMS4sr0HggR'
//   })
import "amfe-flexible";
Vue.config.productionTip = false;
//调试工具
import VConsole from "vconsole";
// if (
//   process.env.VUE_APP_TYPE == "test" ||
//   process.env.VUE_APP_TYPE == "development"
// ) {
if (process.env.VUE_APP_TYPE == "test") {
  let vc = new VConsole();
}
import wechat from "./utils/wechat.js";
Vue.prototype.wxH5Share = wechat;
Vue.config.ignoredElements = ["wx-open-launch-weapp"]; //注册跳转小程序标签

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
