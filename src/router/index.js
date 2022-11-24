import { storageGet, storageSet } from "@/utils/utils";
import { wxLoginAuthor, wxLoginAuthorS } from "@/api/user";
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
export const constantRoutes = [
  {
    path: "/",
    redirect: "/index/index",
  },
  {
    path: "/index/index",
    name: "home",
    component: () => import("@/views/index/index.vue"),
    meta: {
      title: "九华保",
    },
  },
  {
    path: "/login/index",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/user/my-coupons/index",
    name: "myCoupons",
    component: () => import("@/views/user/my-coupons/index.vue"),
    meta: {
      title: "我的优惠券",
    },
  },
  {
    path: "/user/my-coupons/washCar",
    name: "myCouponsWashCar",
    component: () => import("@/views/user/my-coupons/washCar.vue"),
    meta: {
      title: "我的洗车券",
    },
  },
  {
    path: "/user/my-coupons/detail",
    name: "myCouponsDetail",
    component: () => import("@/views/user/my-coupons/detail.vue"),
    meta: {
      title: "我的优惠券",
    },
  },
  {
    path: "/user/my-coupons/use_success",
    name: "useSuccess",
    component: () => import("@/views/user/my-coupons/use_success.vue"),
    meta: {
      title: "成功",
    },
  },
  {
    path: "/user/my-integral/index",
    name: "myIntegral",
    component: () => import("@/views/user/my-integral/index.vue"),
    meta: {
      title: "我的权益",
    },
  },

  {
    path: "/user/my-integral/history",
    name: "myIntegralHistory",
    component: () => import("@/views/user/my-integral/components/history.vue"),
    meta: {
      title: "权益历史",
    },
  },
  {
    path: "/user/my-integral/cashpage",
    name: "cashpage",
    component: () => import("@/views/user/my-integral/cashpage.vue"),
    meta: {
      title: "权益提现",
    },
  },
  {
    path: "/user/my-integral/Withdrawalrecord",
    name: "Withdrawalrecord",
    component: () => import("@/views/user/my-integral/Withdrawalrecord.vue"),
    meta: {
      title: "提现记录",
    },
  },
  {
    path: "/user/my-integral/cashdetails",
    name: "cashdetails",
    component: () => import("@/views/user/my-integral/cashdetails.vue"),
    meta: {
      title: "提现详情",
    },
  },
  {
    path: "/user/my-integral/cashdetails/modifypage",
    name: "modifypage",
    component: () => import("@/views/user/my-integral/modifypage.vue"),
    meta: {
      title: "重新提交",
    },
  },
  {
    path: "/user/my-integral/detail",
    name: "myIntegralDetail",
    component: () => import("@/views/user/my-integral/detail.vue"),
    meta: {
      title: "我的权益详情",
    },
  },
  {
    path: "/user/index",
    name: "userIndex",
    component: () => import("@/views/user/index/index.vue"),
    meta: {
      title: "个人中心",
    },
  },
  {
    path: "/user/getIntegral",
    name: "getIntegral",
    component: () => import("@/views/user/index/getIntegral.vue"),
    meta: {
      title: "工号领取权益",
    },
  },
  {
    path: "/user/getOil",
    name: "getOil",
    component: () => import("@/views/user/index/getOil.vue"),
    meta: {
      title: "领取油券",
    },
  },
  {
    path: "/user/set/index",
    name: "setUser",
    component: () => import("@/views/user/set/index.vue"),
    meta: {
      title: "个人信息",
      type: "1",
    },
  },
  {
    path: "/user/set/user",
    name: "setUser",
    component: () => import("@/views/user/set/index.vue"),
    meta: {
      title: "修改个人信息",
      type: "2",
    },
  },
  {
    path: "/user/set/bankList",
    name: "userBankList",
    component: () => import("@/views/user/set/bankList.vue"),
    meta: {
      title: "我的银行卡",
    },
  },
  {
    path: "/user/set/bankAdd",
    name: "userBankAdd",
    component: () => import("@/views/user/set/bankAdd.vue"),
    meta: {
      title: "添加银行卡",
    },
  },
  {
    path: "/interests",
    name: "interests",
    component: () => import("@/views/index/interests.vue"),
    meta: {
      title: "权益领取",
    },
  },
  {
    path: "/recharge_success",
    name: "rechargeSuccess",
    component: () => import("@/views/index/recharge_success.vue"),
    meta: {
      title: "充值成功",
    },
  },
  {
    path: "/Address",
    name: "address",
    component: () => import("@/views/index/addresspage.vue"),
  },
  {
    path: "/oilFilling/index",
    name: "oilFilling",
    component: () => import("@/views/oilFilling/index.vue"),
    meta: {
      title: "特惠加油",
    },
  },
  {
    path: "/oilFilling/oilCard",
    name: "oilCard",
    component: () => import("@/views/oilFilling/oilCard.vue"),
    meta: {
      title: "油卡记录",
    },
  },
  {
    path: "/oilFilling/list",
    name: "oilFillingList",
    component: () => import("@/views/oilFilling/list.vue"),
    meta: {
      title: "充值记录",
    },
  },
  {
    path: "/oilFilling/success",
    name: "oilFillingSuccess",
    component: () => import("@/views/oilFilling/success.vue"),
    meta: {
      title: "充值成功",
    },
  },
  {
    path: "/oilFilling/successOil",
    name: "oilFillingSuccess",
    component: () => import("@/views/oilFilling/successOil.vue"),
    meta: {
      title: "充值成功",
    },
  },
  {
    path: "/prepaidRefill/index",
    name: "prepaidRefill",
    component: () => import("@/views/prepaidRefill/index.vue"),
    meta: {
      title: "话费充值",
    },
  },
  {
    path: "/prepaidRefill/success",
    name: "prepaidRefillSuccess",
    component: () => import("@/views/prepaidRefill/success.vue"),
    meta: {
      title: "充值成功",
    },
  },
  {
    path: "/washCar/index",
    name: "washCar",
    component: () => import("@/views/washCar/index.vue"),
    meta: {
      title: "优惠洗车",
      type: 1,
    },
  },
  {
    path: "/repairCar/index",
    name: "repairCar",
    component: () => import("@/views/washCar/index.vue"),
    meta: {
      title: "保养",
      type: 2,
    },
  },
  {
    path: "/washCar/purchase",
    name: "washCarPurchase",
    component: () => import("@/views/washCar/purchase.vue"),
    meta: {
      title: "购买",
    },
  },
  {
    path: "/washCar/shop",
    name: "washCarShop",
    component: () => import("@/views/washCar/shop.vue"),
    meta: {
      title: "洗车店",
    },
  },
  {
    path: "/recharge/index",
    name: "rechargeIndex",
    component: () => import("@/views/recharge/index.vue"),
    meta: {
      title: "优惠充值",
    },
  },
  {
    path: "/recharge/jdECard",
    name: "rechargeJdECard",
    component: () => import("@/views/recharge/jdECard.vue"),
    meta: {
      title: "优惠充值",
    },
  },
  {
    path: "/recharge/setMeal",
    name: "rechargeSetMeal",
    component: () => import("@/views/recharge/setMeal.vue"),
    meta: {
      title: "卡券套餐",
    },
  },
  {
    path: "/index/more",
    name: "indexMore",
    component: () => import("@/views/index/more.vue"),
    meta: {
      title: "吃喝玩乐",
    },
  },
  {
    path: "/index/newsInfo",
    name: "newsInfo",
    component: () => import("@/views/index/newsInfo.vue"),
    meta: {
      title: "新闻详情",
    },
  },
  {
    path: "/index/newsList",
    name: "newsList",
    component: () => import("@/views/index/newsList.vue"),
    meta: {
      title: "新闻列表",
    },
  },
  {
    path: "/oilFilling/oilFingHome",
    name: "oilFingHome",
    component: () => import("@/views/oilFilling/oilFingHome.vue"),
    meta: {
      title: "特惠加油",
    },
  },
  {
    path: "/oilFilling/oilBuy",
    name: "oilBuy",
    component: () => import("@/views/oilFilling/oilBuy.vue"),
    meta: {
      title: "特惠加油",
    },
  },
  {
    path: "/oilFilling/oilDetail",
    name: "oilDetail",
    component: () => import("@/views/oilFilling/oilDetail.vue"),
    meta: {
      title: "特惠加油",
    },
  },
  {
    path: "/seniorExecutiveEelect/index",
    name: "seniorExecutiveEelectHome",
    component: () => import("@/views/seniorExecutiveEelect/index.vue"),
    meta: {
      title: "更多甄选",
    },
  },
  {
    path: "/seniorExecutiveEelect/addAdress",
    name: "addAdress",
    component: () => import("@/views/seniorExecutiveEelect/addAdress.vue"),
    meta: {
      title: "新增地址",
    },
  },
  {
    path: "/seniorExecutiveEelect/detail",
    name: "seniorExecutiveEelectDetail",
    component: () => import("@/views/seniorExecutiveEelect/detail.vue"),
    meta: {
      title: "商品详情",
    },
  },
  {
    path: "/seniorExecutiveEelect/goodCar",
    name: "seniorExecutiveEelectGoodCar",
    component: () => import("@/views/seniorExecutiveEelect/goodCar.vue"),
    meta: {
      title: "购物车",
    },
  },
  {
    path: "/seniorExecutiveEelect/sureOrder",
    name: "seniorExecutiveEelectSureOrder",
    component: () => import("@/views/seniorExecutiveEelect/sureOrder.vue"),
    meta: {
      title: "确认订单",
    },
  },
  {
    path: "/seniorExecutiveEelect/orderDetail",
    name: "seniorExecutiveEelectOrderDetail",
    component: () => import("@/views/seniorExecutiveEelect/orderDetail.vue"),
    meta: {
      title: "订单详情",
    },
  },
  {
    path: "/seniorExecutiveEelect/returnGoods",
    name: "seniorExecutiveEelectReturnGoods",
    component: () => import("@/views/seniorExecutiveEelect/returnGoods.vue"),
    meta: {
      title: "退换商品",
    },
  },
  {
    path: "/telephoneExpenses",
    name: "telephoneExpenses",
    component: () => import("@/views/index/components/telephoneExpenses.vue"),
    meta: {
      title: "话费优惠充值",
    },
  },
  {
    path: "/telephoneExpenses/success",
    name: "telephoneExpenses_success",
    component: () => import("@/views/index/components/success.vue"),
    meta: {
      title: "充值成功",
    },
  },
  {
    path: "/seniorExecutiveEelect/logisticsDetail",
    name: "logisticsDetail",
    component: () =>
      import("@/views/seniorExecutiveEelect/logisticsDetail.vue"),
    meta: {
      title: "订单详情",
    },
  },
  {
    path: "/seniorExecutiveEelect/orderList",
    name: "orderList",
    component: () => import("@/views/seniorExecutiveEelect/orderList.vue"),
    meta: {
      title: "我的订单",
    },
  },
  {
    path: "/telephoneExpenses/autoRecharge",
    name: "orderList",
    component: () => import("@/views/index/components/autoRecharge.vue"),
    meta: {
      title: "话费自动充值",
    },
  },
  {
    path: "/telephoneExpenses/rechargeRecord",
    name: "orderList",
    component: () => import("@/views/index/components/rechargeRecord.vue"),
    meta: {
      title: "话费充值记录",
    },
  },
  {
    path: "/seniorExecutiveEelect/telephoneDetail",
    name: "telephoneDetail",
    component: () =>
      import("@/views/seniorExecutiveEelect/component/telephoneDetail.vue"),
    meta: {
      title: "话费充值详情",
    },
  },
  {
    path: "/powerRecharge",
    name: "powerRecharge",
    component: () => import("@/views/index/components/powerRecharge.vue"),
    meta: {
      title: "电费充值",
    },
  },
  {
    path: "/powerRechargeDetail",
    name: "powerRechargeDetail",
    component: () => import("@/views/index/components/powerRechargeDetail.vue"),
    meta: {
      title: "电费充值",
    },
  },
  {
    path: "/telephoneExpenses/profitRecord",
    name: "profitRecord",
    component: () => import("@/views/index/components/profitRecord.vue"),
    meta: {
      title: "获利记录",
    },
  },
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    mode: "hash",
    routes: constantRoutes,
  });

const router = createRouter();

const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
router.beforeEach((to, from, next) => {
  if (window.location.href.includes("code")) {
    storageSet("user_CODEURL", window.location.href);
  }

  if (to.fullPath.includes("&shareOPENID=")) {
    return next();
  }
  if (window.location.href.includes("&__biz=")) {
    return next();
  }

  if (
    !storageGet("openId") ||
    "null" == storageGet("openId") ||
    storageGet("openId").length < 10
  ) {
    if (to.name === "telephoneExpenses") {
      if (to.fullPath === "/telephoneExpenses?shareId=1") {
        if (window.location.href.includes("code")) {
          console.log("href", window.location.href);
          // return
        }
      } else {
        wxLoginAuthorS();
      }
    } else {
      wxLoginAuthor();
    }
  }
  return next();
});
export default router;
