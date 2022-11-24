<template>
  <div>
    <div class="success-icons">
      <img :src="bg[0]">
    </div>
    <div class="status-title">
      {{title}}
    </div>
    <div class="sub-button" @click="backUserCenter">返回个人中心</div>

    <div class="policy_tips" v-if="area == 'gd'">
      <!-- <div class="policy_tips"> -->
      <p>1.长按或扫描页面下方“大家来加油”二维码即可查看使用您的权益及余额</p>
      <p>2.应用商店搜索下载“加油广东”APP，通过手机号登录后，即可查看使用您的权益及余额</p>
    </div>
    <div class="qrcode-img">
      <div class="gd-code" v-if="area=='gd'">
        <img src="https://gz.bcebos.com/v1/zhijianche/691983a5-1f6c-4f41-8bd8-a5449d4f5293.png" alt="">
        <wx-open-launch-weapp id="launch-btn" :username="ghId[area]" path="">
          <script type="text/wxtag-template">
            <div style="height:150px;width:150px;opcity:0"></div>
          <!-- <button style="height:150px;width:150px;border: 1px solid #f0f0f0;background:#fff">
            <img src="https://gz.bcebos.com/v1/zhijianche/691983a5-1f6c-4f41-8bd8-a5449d4f5293.png" style="height:130px;width:130px;"></img>
          </button> -->
      </script>
        </wx-open-launch-weapp>
      </div>
      <div class="hn-code" v-if="area=='hn'">
        <img src="https://gz.bcebos.com/v1/zhijianche/53dc94e1-2b9c-43ca-b366-9adbe5efd251.png" alt="">
        <wx-open-launch-weapp id="launch-btn" :username="ghId[area]" path="">
          <script type="text/wxtag-template">
            <div style="height:150px;width:150px;opcity:0"></div>
            <!-- <button style="height:150px;width:150px;border: 1px solid #f0f0f0;background:#fff">
              <img src="https://gz.bcebos.com/v1/zhijianche/53dc94e1-2b9c-43ca-b366-9adbe5efd251.png" style="height:130px;width:130px;"></img>
            </button> -->
        </script>
        </wx-open-launch-weapp>
      </div>
      <div style="font-size:16px;text-align:center;margin-top:10px;color: #f14f44;">{{area == 'gd' ? '长按至广东中石化小程序 “大家来加油”' : area == 'hn' ? '长按至河南中石化小程序 “中石化一键加油”':''}}</div>
      <!-- <div style="font-size:16px;text-align:center;margin-top:10px;color: #f14f44;">长按至广东中石化小程序 “大家来加油”</div> -->
    </div>
  </div>

</template>

<script>
import { getJsJDK } from '@/api/user'
export default {
  name: 'useSuccess',
  data() {
    return {
      bg: [
        require('@/assets/img/wlyn/Group_83.png'),
        require('@/assets/img/wlyn/qrcodedjljy.png'),
      ],
      ghId: {
        gd: 'gh_85d236dfcbaa',
        hn: 'gh_641fc8ab19f9'
      },
      title: '',
      area: ''
    }
  },
  created() {
    this.title = this.$route.query.type == 1 ? '领取成功' : '使用成功'
    this.area = this.$route.query.area
    console.log(this.area);
    getJsJDK()
  },
  mounted() {
    var btn2 = document.getElementById('launch-btn2');
    btn2.addEventListener('launch', function (e) {
      console.log('success');
    });
    btn2.addEventListener('error', function (e) {
      console.log('fail', e.detail);
    });
  },
  methods: {
    backUserCenter() {
      this.$router.replace('/user/index')
    },
    launch(e) {
      console.log('成功', e)
    },
    error(e) {
      console.log('失败', e)
    },
  }
};
</script>
<style scoped lang="scss">
.status-title {
  font-size: 20px;
  width: 80%;
  margin: 0 10% 40px;
  text-align: center;
  font-weight: bold;
  color: #000;
  z-index: 2;
}
.sub-button {
  position: relative;
  width: 90%;
  line-height: 45px;
  margin: 10px 5% 20px;
  font-size: 16px;
  text-align: center;
  letter-spacing: 4px;
  border-radius: 5px;
  text-decoration: none;
  color: #ffffff;
  background-image: linear-gradient(
    90deg,
    rgb(0, 167, 79),
    rgba(0, 167, 79, 0.884) 73%,
    rgba(0, 167, 79, 0.822)
  );
}
.tip-box-wr {
  position: relative;
  width: 76%;
  margin: 40px 12%;
}
.tip-box-title {
  font-size: 16px;
  text-align: left;
  color: #000;
}
.tip-box-text {
  font-size: 14px;
  text-align: left;
  color: #ccc;
}
.success-icons {
  position: relative;
  display: flex;
  width: 50%;
  margin: 50px 25% 10px;
  justify-content: center;
}
.success-icons img {
  width: 90px;
  height: 90px;
  margin: 2px 0;
}
.policy_tips {
  position: relative;
  width: 80%;
  text-indent: -10px;
  line-height: 20px;
  letter-spacing: 1px;
  margin: 0 10% 5px;
  text-align: left;
  font-size: 14px;
  color: rgb(138, 138, 138);
  align-self: flex-end;
  word-wrap: normal;
  user-select: none;
}

.common {
  padding: 5px;
  width: 96%;
  margin: 0px auto;
  background-color: #ffffff;
}
.qrcode-img {
  @extend .common;
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .hn-code {
    // background: url("https://gz.bcebos.com/v1/zhijianche/53dc94e1-2b9c-43ca-b366-9adbe5efd251.png");
  }
  .gd-code {
    // background: url("https://gz.bcebos.com/v1/zhijianche/53dc94e1-2b9c-43ca-b366-9adbe5efd251.png");
  }
  .hn-code,
  .gd-code {
    height: 150px;
    width: 150px;
    // background-size: 100% 100%;
    // border-radius: 15px;
  }
  img {
    // border: 1px solid #f0f0f0;
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
  }
}
</style>