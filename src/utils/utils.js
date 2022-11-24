import Cookies from 'js-cookie'

const TokenKey = 'x-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}


export function PrefixZero(num) {
    if (Number(num) < 10) {
        num = '0' + num;
    }
    return String(num);
}

export function formatDate(date) {
    return `${date.getFullYear()}-${PrefixZero(date.getMonth() + 1)}-${PrefixZero(date.getDate())}`;
}


export function storageSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};
//取出数据
export function storageGet(key) {
    try {
        const value = localStorage.getItem(key);
        if (value === null || value === undefined || value === "") {
            return null;
        }
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        return null
    }
};
//删除数据
export function storageRemove(key) {
    localStorage.removeItem(key);
}

/**
 * @description: 防抖函数
 * @param {*} fn
 * @param {*} t
 * @return {*}
 */

export const Debounce = (fn, t) => {
    let delay = t || 400
    let timer
    return function () {
        let args = arguments;
        if (timer) {
            clearTimeout(timer)
        }
        let callNow = !timer
        timer = setTimeout(() => {
            timer = null
        }, delay)

        if (callNow) fn.apply(this, args)
    }
}

/**
 * @description: 取url参数
 * @param {*} name
 * @return {*}
 */
export function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * @description: 高德地图坐标转百度地图坐标
 * @param {*} gg_lng ,gg_lat
 * @return {*}bd_lat ,bd_lng
 */
export function bd_encrypt(gg_lng, gg_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = gg_lng,
        y = gg_lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return {
        lat: bd_lat,
        lng: bd_lng
    };
}
/** 
   //浮点计算乘法
   @param{Number} arg1 因数1
   @param{Number} arg2 因数2
   @returns 返回积
*/
export function NumberMul(arg1, arg2) {
    let m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {}
    try {
        m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
/** 
   //浮点计算减法
   @param{Number} arg1 被减数
   @param{Number} arg2 减数
   @returns 返回差
*/
export function NumberSub(arg1, arg2) {
    let r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (NumberMul(arg1, m) - NumberMul(arg2, m)) / m
}
/** 
   //身份证算法校验
   @param{Number | String} id_no 身份证号码
   @returns 返回校验结果
*/
export function CheckIdCard(id_no) {
    if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(id_no)) {
        return false
    }
    let c = 0;
    let p = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    for (let i = 0; i < 17; i++) {
        let n = id_no.substr(i, 1);
        n = parseInt(n);
        c += p[i] * n;
    }
    let y = c % 11;
    let r = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let v = r[y];
    if (v == 10)
        v = 'x';
    let l = id_no.substr(17, 1);

    if (v != l.toLowerCase()) {
        return false
    } else {
        return true
    }

}