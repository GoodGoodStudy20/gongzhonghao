import axios from "axios";
import store from "../store";
import { storageGet } from "@/utils/utils";
import { Toast } from "vant";
export const service_phone = "400-631-0818";
export const baseURL = process.env.VUE_APP_BASEURL;

axios.defaults.timeout =
  process.env.VUE_APP_TYPE === "production" ? 10000 : 600000;
axios.defaults.baseURL = baseURL;

//http request 拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json",
    };
    if (storageGet("userToken")) {
      config.headers["x-token"] = storageGet("userToken");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(baseURL + url, {
        params: params,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(baseURL + url, data).then(
      (response) => {
        resolve(response);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(baseURL + url, data).then(
      (response) => {
        resolve(response);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(baseURL + url, data).then(
      (response) => {
        resolve(response);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function searchTel(url, params = {}) {
  //这是请求的地址 （自定义）
  // 这是请求头中需要的token （自定义）
  // let token = sessionStorage.getItem("x-token");
  return axios({
    method: "get",
    params,
    url: url,
    timeout: 6000000,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      // "Content-Type": "application/x-www-form-urlencoded",
      // Authorization: token,
    },
    // crossDomain: true,
    //   responseType: "arraybuffer", // 相应类型如果有的话，就用接口中的，如果没有就默认为null
    // responseType: "blod", // 相应类型如果有的话，就用接口中的，如果没有就默认为null
  });
}
