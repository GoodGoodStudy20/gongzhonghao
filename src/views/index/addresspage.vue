<template>
  <div>
    <vue-city ref="city" :hotCityList="hotCityList" @changeCity="changeCity"></vue-city>
  </div>
</template>

<script>
import { storageGet, storageSet, storageRemove } from '@/utils/utils'
export default {
  name: 'addresspage',
  components: {},
  props: {},
  data() {
    return {
      hotCityList: [
        { cityName: "深圳市" },
        { cityName: "上海市" },
        { cityName: "北京市" },
        { cityName: "广州市" },
        { cityName: "杭州市" },
        { cityName: "武汉市" },
        { cityName: "天津市" },
        { cityName: "南京市" },
        { cityName: "成都市" },
        { cityName: "西安市" },
        { cityName: "洛阳市" },
        { cityName: "石家庄市" }
      ]
    };
  },
  mounted() {
    this.$set(this.$refs.city.cityList[14].option, 12, { c: "钦州市", p: "广西壮族自治区" })
  },
  methods: {
    changeCity(data) {
      let province = ''
      this.$refs.city.cityList.forEach(item => {
        item.option.forEach(it => {
          if (it.c == data) {
            province = it.p
            storageSet('Province', province)            
          }
        })
      })
      if (storageGet('selectCity')) { storageRemove('selectCity') }
      storageSet('selectCity', data)
      this.$router.go(-1)
    }
  },
};
</script>
<style  scoped>
</style>