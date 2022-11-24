/*
 * @Author: your name
 * @Date: 2021-01-20 19:07:04
 * @LastEditTime: 2021-01-23 14:13:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhijianche_mobile\vue.config.js
 */
const Timestamp = new Date().getTime();
module.exports = {
  publicPath: "./",
  outputDir:
    process.env.VUE_APP_TYPE === "production" ? "jhb_h5" : "jhb_test_h5",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    externals: {
      AMap: "AMap", //加这个！！
      AMapUI: "AMapUI",
      BMap: "BMap",
    },
    //configureWebpack 这部分打包文件添加时间戳，防止缓存不更新
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `[name].${Timestamp}.js`,
      chunkFilename: `[name].${Timestamp}.js`,
    },
  },
};
