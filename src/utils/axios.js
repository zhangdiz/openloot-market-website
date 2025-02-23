import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:12001',  // 你可以修改为你的 API 根地址
  timeout: 25000,  // 设置请求超时时间 25秒
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里做一些请求前的处理，比如添加 token
    // config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 返回统一格式的数据
    return {
      code: response.status,  // 返回 HTTP 状态码
      data: response.data,    // 返回数据
      message: response.statusText, // 返回消息
    };
  },
  (error) => {
    // 错误处理
    const message = error.response ? error.response.statusText : 'Network Error';
    return Promise.reject({
      code: error.response ? error.response.status : 500,
      message,
    });
  }
);

// 封装常用的请求方法
const apiRequest = {
  get(url, params) {
    return instance.get(url, { params });
  },
  post(url, data) {
    return instance.post(url, data);
  },
  put(url, data) {
    return instance.put(url, data);
  },
  delete(url) {
    return instance.delete(url);
  },
};

export default apiRequest;
