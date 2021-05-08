import request from '@/utils/request';

export const getTask = () => {
  return request('/api/crons', { method: 'GET' });
};

export const getTaskInfo = (id: string) => {
  return request(`/api/crons/${id}`, { method: 'GET' });
};

export const runTask = (id: string) => {
  return request(`/api/crons/${id}/run`);
};

export const runTaskLog = (id: string) => {
  return request(`/api/crons/${id}/log`);
};

export const addTask = (params: any) => {
  return request(`/api/crons`, { method: 'POST', data: params });
};
