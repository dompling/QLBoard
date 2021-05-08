import request from '@/utils/request';

export const login = ({ ip, ...params }: any) => {
  localStorage.setItem('ipAddress', ip);
  return request('/api/login', { method: 'POST', data: params });
};
