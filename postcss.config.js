// module.exports = {
//   plugins: {
//     'autoprefixer': {},
//     'postcss-pxtorem': {
//       rootValue: 37.5, // 根元素字体大小，设计稿的十分之一，即1rem = 37.5px，即换算基准为37.5
//       propList: ['*'] // 可以从 px 更改为 rem 的属性，通配符*启用所有属性
//     }
//   }
// }
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,
    },
  },
};