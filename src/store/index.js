import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import {
    storageRemove,
    storageGet
} from '@/utils/utils'

Vue.use(Vuex);
const store = new Vuex.Store({
    actions: {
        removeCookiesStorage({
            commit
        }, ) {
            storageRemove('userToken');
            storageRemove('userPhone');
            storageRemove('userId');
            storageRemove('headImgUrl');
            storageRemove('nickname');
            storageRemove('openId');
            storageRemove('reclist');
            router.push('/login/index');
        }
    },
    getters: {

    },
    state: {
        logisticsDetails:[],
        goodList:[],//商品列表
        hasLocation: false, //是否修改过城市
        vouchersList:[] ,  //优惠券
        mid:'', //抢购优惠券id
        product:{},//优惠券
        city:'',
        addressDetail:{} ,
        active:0, //切换充值页面s
        active2:0,
        product2:{},
        vouchersList2:[]
    },
    mutations: {
        SETlogisticsDetails(state, value){
            state.logisticsDetails = value
        },
        setgoodList(state, value){
            state.goodList = value
        },
        hasLocation(state, value) {
            state.hasLocation = value
        },
        // 更改存储优惠券
        setVouchersList(state, value){
            state.vouchersList = value
        },
        setMid(state, value){
            state.mid = value
        },
        setProduct(state,value){
            state.product = value
        },
        setCity(state,value){
            state.city = value
        },
        setAddressDetail(state,value){
            state.addressDetail = value
        },
        setActive(state,value){
            state.active = value
        },
        setActive2(state,value){
            state.active2 = value
        },
        setProduct2(state,value){
            state.product2 = value
        },
        setVouchersList2(state,value){
            state.vouchersList2 = value
        }
    },
})

export default store;