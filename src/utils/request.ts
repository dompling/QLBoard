import { request as api } from '@@/plugin-request/request';
import { Toast } from 'antd-mobile';
import {
  RequestOptionsWithResponse,
  RequestOptionsWithoutResponse,
  RequestOptionsInit,
} from 'umi-request';
import { getIp } from '@/utils/index';
import { history } from 'umi';

export type RequestResponse<T = any> = {
  data: T;
  code: number;
  msg: string;
};

interface RequestMethodInUmi<R = false> {
  <T = any>(
    url: string,
    options: RequestOptionsWithResponse & { skipErrorHandler?: boolean },
  ): Promise<RequestResponse<T>>;

  <T = any>(
    url: string,
    options: RequestOptionsWithoutResponse & { skipErrorHandler?: boolean },
  ): Promise<T>;

  <T = any>(
    url: string,
    options?: RequestOptionsInit & { skipErrorHandler?: boolean },
  ): R extends true ? Promise<RequestResponse<T>> : Promise<T>;
}

const request: RequestMethodInUmi = (url: any, options: any) => {
  const ip = getIp();
  return api<RequestResponse>(`http://${ip}${url}`, options).then((res) => {
    const response = res as unknown as RequestResponse;
    if (response.code !== 200) throw response.msg;
    return response;
  }).catch(() => {
    return {} as any;
  });
};

export default request;
