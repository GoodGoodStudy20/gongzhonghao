/*
 * @Author: your name
 * @Date: 2020-12-11 10:19:32
 * @LastEditTime: 2021-02-19 16:39:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \scweb\src\api\user.js
 */
import { post, fetch, patch, put } from "@/utils/http";
import axios from "@/utils/http";
import { storageSet } from "@/utils/utils";
import wx from "weixin-js-sdk";
//提现修改
export function modifyIntegralWithdrawal(params) {
  return post("/wlynIntegralWithdrawal/modifyIntegralWithdrawal", params);
}
//　　　提现详情
export function selectById(params) {
  return fetch(`/wlynIntegralWithdrawal/selectById`, params);
}
// 新增提现
export function addIntegralWithdrawal(params) {
  return post("/wlynIntegralWithdrawal/addIntegralWithdrawal", params);
}
// 提现记录
export function getIntegralWithdrawalList(params) {
  return post(`/wlynIntegralWithdrawal/getIntegralWithdrawalLists`, params);
}
// 退回提现记录
export function getIntegralWithdrawalByPhone(params) {
  return fetch(`/wlynIntegralWithdrawal/getIntegralWithdrawalByPhone`, params);
}

// checkCode 检索核销码类型 0.兑换码 1.核销码 2.油券 3不存在
export function checkCode(params) {
  return fetch(`/mobile/checkCode`, params);
}

// 按类型获取兑换券
export function getVouchers(params) {
  return fetch(`/mobile/getVouchers`, params);
}

// 获取门店列表
export function getShopList(params) {
  return fetch(`/cheDuo/getShopList`, params);
}

// 获取积分兑换卡券列表
export function getIntegralExchangeList(params) {
  return fetch(`/mobile/getIntegralExchangeList`, params);
}

// 激活卡劵
export function activationVouchers(params) {
  return axios.get("/wlynVouchersUserRelation/activationVouchers", {
    params,
  });
}

// 积分兑换
export function integralExchange(params) {
  return post(`/mobile/integralExchange`, params);
}

//获取公众号版本
export function getVersion(params) {
  return axios.get("/WlynVersion/getVersion", {
    params,
  });
}
// 新登录
export function userRegister(params) {
  return post("/mobile/bindPhone", params);
}
// 工号登录
export function bindNumber(params) {
  return post("/mobile/bindNumber", params);
}
//是否开启隐藏(0.否 1.是)
export function updateByUserIsHide(params) {
  return axios.post("/wlynUser/updateByUserIsHide", params);
}
//权益列表
export function rightsAndInterests(params) {
  return fetch("/mobile/rightsAndInterests?phone=" + params);
}
// 确认权益
export function getRightsAndInterests(params) {
  return post("/mobile/getRightsAndInterests", params);
}
// 领取权益 积分
export function getIntegralCodeExchange(params) {
  return post("/mobile/getIntegralCodeExchange", params);
}
// 领取权益 河南油券
export function getVouchersCodeExchange(params) {
  return post("/mobile/getVouchersCodeExchange", params);
}
//  领取权益 前三后四
export function threeFourPhone(params) {
  return axios.get("/threeFourPhone/getRightsAndInterests", {
    params,
  });
}
// 优惠券和积分
export function countVouchersInterests(params) {
  return fetch(`/mobile/countVouchersInterests/` + params);
}
// 积分历史
export function getIntegralHistory(params) {
  return fetch("/mobile/getIntegralHistory", params);
}
// 积分有效期
export function getIntegralList(params) {
  return fetch("/mobile/getIntegralList", params);
}
// 使用核销码、实名发放充值接口
export function usedRecharge(params) {
  return post("/code/usedRecharge", params);
}
// 校验前三后四手机号是否存在（积分）
export function checkPhoneExists(params) {
  return fetch("/threeFourPhone/checkPhoneExists/" + params);
}

// 校验前三后四手机号是否存在（油券）
export function checkOilCardInterests(params) {
  return fetch("/threeFourPhone/checkOilCardInterests/" + params);
}
// 领取油卡权益
export function getOilCardAndInterests(params) {
  return axios.get("/threeFourPhone/getOilCardAndInterests", {
    params,
  });
}
// 上传文件
export function baiduUploadFile(params) {
  return axios.post("/uploadFile/baiduUploadFile", params);
}
// 获取验证码
export function getSMSCode(params) {
  return fetch("/wlynUser/getSMSCode?phone=" + params);
}
// 支付订单关闭后通知后端
export function closeOrder(params) {
  return post("/wxPay/closeOrder/" + params);
}

//广东油券 wx支付
export function weChatPayNow(params) {
  return post("/wxPay/weChatPayNow", params);
}
//河南油券 wx支付
export function hnWeChatPayNow(params) {
  return post("/wxPay/hnWeChatPayNow", params);
}
// coupons
// 获取列表
export function userCouponsGetList(params) {
  return post("/wlynVouchersUserRelation/getPhoneVouchersList", params);
}
// 获取折扣券详情
export function getH5VouchersInfo(params) {
  return fetch("/wlynVouchersUserRelation/getH5VouchersInfo", params);
}
// 根据卡劵关系id查询支付记录
export function getVouchersPayInfoByRId(params) {
  return axios.get("/wlynVouchersPayInfo/getVouchersPayInfoByRId", {
    params,
  });
}
// H5根据抵扣券id获取卡券列表
export function getVouchersListByVouchersId(params) {
  return axios.post(
    "/wlynVouchersUserRelation/getVouchersListByVouchersId ",
    params
  );
}

// 获取列表
export function exchangeVouchersUsed(params) {
  return post("/mobile/exchangeVouchersUsed", params);
}
//油劵赠送
export function oilVouchersGive(params) {
  return post("/wlynVouchersUserRelation/oilVouchersGive", params);
}

// 获取银行卡列表
export function getBankCardByPhone(params) {
  return axios.get("/wlynBankCard/getBankCardByPhone", {
    params,
  });
}
//添加银行卡
export function addBankCard(params) {
  return axios.post("/wlynBankCard/addBankCard", params);
}
//修改银行卡
export function updateBankCardIsDefault(params) {
  return axios.get("/wlynBankCard/updateBankCardIsDefault", {
    params,
  });
}
//删除银行卡
export function deleteBankCard(params) {
  return axios.get("/wlynBankCard/deleteBankCard", {
    params,
  });
}
//查询用户信息
export function getUserInfoByPhone(params) {
  return axios.get("/wlynUser/getUserInfoByPhone", {
    params,
  });
}
//修改用户信息
export function updateWlynUser(params) {
  return axios.post("/wlynUser/updateWlynUser", params);
}

//查询油劵充值分页列表
export function getWlynProductRechargePage(params) {
  return axios.post("/WlynProductRecharge/getWlynProductRechargePage", params);
}
//新增广东油劵充值
export function addGdOilCouponRecharge(params) {
  return axios.post("/WlynProductRecharge/addGdOilCouponRecharge", params);
}
//新增河南油劵充值
export function addWlynProductRecharge(params) {
  return axios.post("/WlynProductRecharge/addWlynProductRecharge", params);
}
//新增产品充值
export function addProductRecharge(params) {
  return axios.post("/WlynProductRecharge/addProductRecharge", params);
}
//优惠劵充值
export function vouchersRecharge(params) {
  return axios.post("/wlynVouchersUserRelation/vouchersRecharge", params);
}
// 获取折扣券详情
export function getVouchersInfo(params) {
  return axios.get("/wlynVouchers/getVouchersInfo", {
    params,
  });
}
// 分页查询加油站列表
export function getGasStationPage(params) {
  return axios.get("/wlynGasStation/getGasStationPage", {
    params,
  });
}

// 根据地区Code查询劵赠送配置
export function getVouchersGiveConfigByRegionCode(params) {
  return axios.get(
    "/wlynVouchersGiveConfig/getVouchersGiveConfigByRegionCode",
    {
      params,
    }
  );
}

// 获取洗车门店列表
export function getCheckOutShopPage(params) {
  return axios.get("/wlynShop/getCheckOutShopPage", {
    params,
  });
}
// 获取检测站点列表
export function getShopPage(params) {
  return axios.get("/wlynShop/getShopPage", {
    params,
  });
}
// 根据id获取鹤大师门店详情
export function getHeDaShiShopInfo(params) {
  return axios.get("/wlynShop/getHeDaShiShopInfo", {
    params,
  });
}
// 根据鹤大师门店id获取鹤大师门店详情
export function getHeDaShiShopInfoByShopId(params) {
  return axios.get("/wlynShop/getHeDaShiShopInfoByShopId", {
    params,
  });
}
// 获取车多门店详情
export function getCheDuoShopInfo(params) {
  return axios.get("/wlynShop/getCheDuoShopInfo", {
    params,
  });
}

// 获取全部移动菜单列表
export function getAllMobileMenuList(params) {
  return axios.get("/WlynMobileMenu/getAllMobileMenuList", {
    params,
  });
}
// 根据id获取产品配置详情
export function getProductConfigInfo(params) {
  return axios.get("/WlynProductConfig/getProductConfigInfo", {
    params,
  });
}

// 新增京东E卡充值记录
export function addJdECardRecharge(params) {
  return axios.post("/WlynProductRecharge/addJdECardRecharge", params);
}
// 获取新闻头条列表
export function getJournalismTouTiAoList(params) {
  return axios.post("/juHe/getJournalismTouTiAoList", params);
}
// 获取新闻头条详情
export function getJournalismTouTiAoContent(params) {
  return axios.get("/juHe/getJournalismTouTiAoContent", {
    params,
  });
}
// H5查询消费记录分页列表
export function getH5ConsumptionRecordsPage(params) {
  return axios.post("/WlynProductRecharge/getH5ConsumptionRecordsPage", params);
}
// 根据菜单Code获取移动菜单
export function getMobileMenuByCode(params) {
  return axios.get("/WlynMobileMenu/getMobileMenuByCode", {
    params,
  });
}
// 根据套餐编号查询卡劵套餐详情
export function getPackageByPackageNumber(params) {
  return axios.get("/wlynVouchersPackage/getPackageByPackageNumber", {
    params,
  });
}
// 卡券套餐充值
export function vouchersPackageRecharge(params) {
  return axios.post(
    "/wlynVouchersPackageIssue/vouchersPackageRecharge",
    params
  );
}

// 获取油卡余额
export function getOilCardBalance(params) {
  return axios.get("/WlynMobileMenu/getOilCardBalance", {
    params,
  });
}
// 查询油卡余额记录分页列表
export function getWlynOilCardRecordPage(params) {
  return axios.post("/WlynMobileMenu/getWlynOilCardRecordPage", params);
}
// 充值油卡

export function RechargeOilCard(params) {
  return axios.get("/WlynMobileMenu/RechargeOilCard", {
    params,
  });
}

// e代驾跳券转页面
export function useDriveVoucher(params) {
  return axios.get("driveVoucher/useDriveVoucher", {
    params,
  });
}
// 获取聚合今日油价
export function getOilPrice(params) {
  return axios.get("juHe/getOilPrice", {
    params,
  });
}
// 广东中石油油劵核销接口
export function gdPetroChinaCode(params) {
  return axios.get("/WlynProductRecharge/gdPetroChinaCode", {
    params,
  });
}
//商品列表
export function getGoosPage(params) {
  return axios.post("/tGood/getGoosPage", params);
}
//购物车列表
export function getShoppingCartPage(params) {
  return axios.post("/tGood/getShoppingCartPage", params);
}
//商品详情
export function getGoosDetail(params) {
  return axios.get("/tGood/getGoosDetail", { params });
}
//加入购物车
export function addShoppingCart(params) {
  return axios.post("/tGood/addShoppingCart", params);
}
//收货地址列表
export function getShoppingAddressPage(params) {
  return axios.post("/tGood/getShoppingAddressPage", params);
}
//修改购物车数量
export function updateShoppingCartNum(params) {
  return axios.get("/tGood/updateShoppingCartNum", { params });
}
//增加收货地址
export function addShoppingAddress(params) {
  return axios.post("/tGood/addShoppingAddress", params);
}
//修改收货地址
export function updateShoppingAddress(params) {
  return axios.post("/tGood/updateShoppingAddress", params);
}
//删除购物车id
export function delShoppingCart(params) {
  return axios.get("/tGood/delShoppingCart", { params });
}
//生成订单
export function createOrder(params) {
  return axios.post("/tGood/createOrder", params);
}
//订单列表
export function getShoppingOrderPageByMobile(params) {
  return axios.post("/tGood/getShoppingOrderPageByMobile", params);
}
//订单详情
export function getShoppingOrderDetaliByMobile(params) {
  return axios.get("/tGood/getShoppingOrderDetaliByMobile", { params });
}
//查询快递
export function selectQueryTrack(params) {
  return axios.get("/express/selectQueryTrack", { params });
}
// 确定收货
export function updateOrder(params) {
  return axios.get("/tGood/updateOrder", { params });
}
// 根据手机号查询自动充值信息
export function getAutoRechargeByPhone(params) {
  return axios.get("/wlynAutoRecharge/getAutoRechargeByPhone", { params });
}
// 新增自动充值
export function addAutoRecharge(params) {
  return axios.post("/wlynAutoRecharge/addAutoRecharge", params);
}
// 修改自动充值
export function updateAutoRecharge(params) {
  return axios.post("/wlynAutoRecharge/updateAutoRecharge", params);
}
// 关闭自动充值
export function updateIsContract(params) {
  return axios.get("/wlynAutoRecharge/updateIsContract", { params });
}
//查询是否有充值
export function getIsConsumptionRecords(params) {
  return axios.get("/WlynProductRecharge/getIsConsumptionRecords", { params });
}
//查询话费详情
export function getConsumptionRecordsDetail(params) {
  return axios.get("/WlynProductRecharge/getConsumptionRecordsDetail", {
    params,
  });
}
//查询权益历史 /swagger-system/WlynProductRecharge/selectPromote
export function selectPromote(params) {
  return axios.get("/WlynProductRecharge/selectPromote", { params });
}
//关联分享人WlynProductRecharge/addPromote
export function addPromote(params) {
  return axios.post("/WlynProductRecharge/addPromote", params);
}
//校验手机号 /swagger-system/WlynProductRecharge/selectPromote
export function checkPhone(params) {
  return axios.get("/wlynAutoRecharge/checkPhone", { params });
}
//code 调取openid  /swagger-system/wxUser/wxGetUserByCode
export function wxGetUserByCode(params) {
  return axios.get("/wxUser/wxGetUserByCode", { params });
}
// 分享获利列表  /swagger-system/WlynProductRecharge/selectPromoteFx
export function selectPromoteFx(params) {
  return axios.get("/WlynProductRecharge/selectPromoteFx", { params });
}
// 充值提醒  /swagger-system/WlynProductRecharge/getRechargeMsg
export function getRechargeMsg(params) {
  return axios.get("/WlynProductRecharge/getRechargeMsg", { params });
}
// *****************************************************************************
//https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1df31038b764c5c3&redirect_uri=http%3A%2F%2Fwlyndev.free.idcfengye.com%2Fwlyn-system%2FwxUser%2FwxMandateLoginCallBack&response_type=code&scope=snsapi_userinfo&state=STATE&uin=Mjk0NDU5OTMwNA%3D%3D&key=c64f485580c6d8924b39b84038b9c2ddcbdc7e3cedb65fb8f0fb0b37aeff529dd11c005990aeb5829666168c335cd05b&pass_ticket=+woffISo0VDB1r8gVTC9NcLQ3auJVIIKJnIAxyKYw6/w8NUCRt1ZWJ00sp1F1Ozy8C3bqO9nLmdFv9cewod6AQ==
// 通过openid 获取用户信息
export function getOpenidUserInfo(params) {
  return fetch("/mobile/getOpenidUserInfo", params);
}
// 微信授权登录获取code
export function wxLoginAuthor() {
  if (process.env.NODE_ENV === "development") {
    getOpenidUserInfo({
      // openid: "o-zYf50cB9NQwzXWDw3esj5Lxm3s",
      // openid: "o-zYf50cB9NQwzXWDw3esj5Lxm3s",
      openid: "ovjHq1V3PKsUlu2azJyXjEonuJ90",
    }).then((response) => {
      if (response.code == 200) {
        // storageSet("openId", "om1Aq5tqdYSrgPo-yqqDoogDO7so");
        storageSet("openId", "ovjHq1V3PKsUlu2azJyXjEonuJ90"); //cc
        // storageSet("openId", "o-zYf56M0sw2BDdc4XFgmL_irLTQ"); //ssz
        // storageSet("openId", "o-zYf5-TDqNq7w0efd5g2wgTYLwE"); //openId
        storageSet("userInfo", response.data);
        storageSet("userPhone", response.data.bindPhone);
      }
    });
    return false;
  }
  let openId = GetQueryString("openId");
  if (openId == null || openId == "") {
    fetch("/wxUser/wxMandateLogin").then((response) => {
      if (response.code == 200) {
        window.location.href = response.data;
      }
    });
  } else {
    storageSet("openId", openId);
    getOpenidUserInfo({
      openid: openId,
    }).then((response) => {
      if (response.code == 200) {
        storageSet("userInfo", response.data);
        storageSet("userPhone", response.data.bindPhone);
      }
    });
  }
}
export function wxLoginAuthorS() {
  let openId = GetQueryString("openId");
  if (openId == null || openId == "") {
    fetch("/wxUser/wxMandateLogin?type=1").then((response) => {
      window.location.href = response.data;
    });
  } else {
    storageSet("openId", openId);
    getOpenidUserInfo({
      openid: openId,
    }).then((response) => {
      if (response.code == 200) {
        storageSet("userInfo", response.data);
        storageSet("userPhone", response.data.bindPhone);
      }
    });
  }
}
export function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
// 获取wxjsjdk参数
export function getJsJDK() {
  axios
    .get("/wxUser/getJsJDK", {
      params: {
        url: location.href.split("#")[0],
      },
    })
    .then(async (res) => {
      await wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.data.appId, // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.signature, // 必填，签名
        jsApiList: [
          "chooseWXPay",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "updateAppMessageShareData",
          "updateTimelineShareData",
          "onMenuShareQQ",
          "onMenuShareWeibo",
        ], // 必填，需要使用的JS接口列表
        openTagList: ["wx-open-launch-weapp"], // 必填，需要使用的JS开放标签列表
      });
    });
}
