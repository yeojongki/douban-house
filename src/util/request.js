import axios from 'axios';
import { Toast } from 'antd-mobile';
// import Cookie from "js-cookie";
const BASE_URL = '/api';

// axios.defaults.withCredentials = true;
// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 15 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers['Content-type'] = 'application/json';
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
    if (res.code === 0) {
      Toast.show(res.msg);
    } else {
      return response.data;
    }
  },
  error => {
    if (error.message === 'Request failed with status code 500') {
      Toast.show('服务器出错');
    } else {
      Toast.show(error.message);
    }
    return Promise.reject(error);
  }
);

export default service;
