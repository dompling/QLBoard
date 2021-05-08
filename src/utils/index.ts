export const getIp = (): string => {
  return localStorage.getItem('ipAddress') || '';
};


export const getToken = (): string => {
  return localStorage.getItem('token') || '';
};
