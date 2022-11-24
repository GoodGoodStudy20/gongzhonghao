import axios from "@/utils/http";
import wx from "weixin-js-sdk";
export default {
  getConfig(
    InfoTitle = "九华保",
    InfoDesc = "",
    InfoLink = window.location.href
  ) {
    //自定义分享所需要的参数

    axios
      .get("/wxUser/getJsJDK", {
        params: {
          url: location.href.split("#")[0],
        },
      })
      .then(async (res) => {
        await wx.config({
          debug: false, //测试时候用true 能看见wx.config的状态是否是config:ok
          appId: res.data.appId, // 必填，公众号的唯一标识（公众号的APPid）
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名
          jsApiList: [
            // "onMenuShareTimeline", // 分享给好友
            // "onMenuShareAppMessage", // 分享到朋友圈
            "updateAppMessageShareData", // 分享给好友1.4
            "updateTimelineShareData", // 分享到朋友圈1.4
            // "onMenuShareQQ",
            // "onMenuShareWeibo",
          ], // 必填，需要使用的JS接口列表
          openTagList: ["wx-open-launch-app"], // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
        });

        wx.ready(function () {
          var shareData = {
            title: InfoTitle, // 分享标题
            desc: InfoDesc, // 分享描述
            link: InfoLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl:
              "https://gz.bcebos.com/v1/gxkj-cii/166d7715-732c-4080-ad35-5d4a793343ea.png", // 分享图标
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
};
