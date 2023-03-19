import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { getToken } from './token'
import history from './history'

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  token: string
}

const Axios: AxiosInstance = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
});

// 添加请求拦截器
Axios.interceptors.request.use(
  (config: any) => {
    const token: string | null = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 设置请求头等操作
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
Axios.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (response.status === 200 || response.status === 201) {
      return response;
    } else {
      throw new Error(response.data.message || '未知错误');
    }
  },
  (error) => {
    if (error.response.status === 401) {
      history.push('/login')
    }
    return Promise.reject(error);
  }
);

export default Axios;