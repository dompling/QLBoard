import { RequestConfig, history } from 'umi';
import { getToken } from '@/utils';

export const request: RequestConfig = {
  timeout: 1000,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [
    (url: string, options: any) => {
      const newOptions = { ...options };
      newOptions.headers = {
        Authorization: `Bearer ${getToken()}`,
      };
      return { url, options: newOptions };
    },
  ],
  responseInterceptors: [
    (res) => {
      if (res.status === 401) history.push('/login');
      return res;
    },
  ],
};
