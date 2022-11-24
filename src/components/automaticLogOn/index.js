export default {
    install (Vue) {
      const req = require.context('./', true, /.vue$/)
      req.keys().forEach(item => {
        const com = req(item).default
        Vue.component(com.name, com)
      })
    }
  }
  