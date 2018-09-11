import axios from "axios";
// import Cookie from "js-cookie";
const BASE_URL = "http://119.23.39.236:5201";

// axios.defaults.withCredentials = true;
// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 15 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers["Content-type"] = "application/json";
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code == 400) {
      window.Vue.$toast(res.msg);
    } else {
      return response.data;
    }
  },
  error => {
    if (
      error.message == "Network Error" ||
      error.message == "timeout of 15000ms exceeded"
    ) {
      error.message = "服务器出错，请联系管理员";
      window.Vue.$toast(error.message);
    }

    return Promise.reject(error);
  }
);

export default service;
