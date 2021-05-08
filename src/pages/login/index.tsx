import React, { useState } from 'react';
import logo from '@/assets/img/logo.png';
import { useRequest } from '@umijs/hooks';
import { login } from '@/service/login';
import { getIp } from '@/utils';
import { history } from 'umi';

const Login: React.FC<{}> = () => {
  const fetchLogin = useRequest(login, {
    manual: true, onSuccess: (response) => {
      localStorage.setItem('token', response.token);
      history.push('/');
    },
  });
  const defaultValue = { ip: getIp() };
  const [formValue, setFormValue] = useState<Record<string, string>>(
    defaultValue);
  const handleOnChange = (event: any) => {
    const { value, name } = event.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const props = (name: string) => {
    return { value: formValue[name], onChange: handleOnChange };
  };

  return (
    <div className='p-10 h-screen flex justify-center items-center flex-col bg-white'>
      <div className={'logo w-full'}>
        <img src={logo} alt={'logo'}
             className={'h-16 w-16 rounded-full mx-auto'} />
      </div>
      <h3 className={'mt-6 text-4xl font-medium'}>Login</h3>
      <div className={'flex justify-center items-center flex-col w-full'}>
        <input name={'ip'} type={'text'} className={'input'}
               placeholder={'IP 地址'} {...props('ip')} />
        <input name={'username'} type={'text'} className={'input'}
               placeholder={'用户名'}  {...props('username')} />
        <input name={'password'} type={'password'} className={'input'}
               placeholder={'密码'}  {...props('password')} />
        <button
          className={'btn btn-indigo w-64 rounded-3xl'}
          onClick={() => {
            return fetchLogin.run(formValue);
          }}>登陆
        </button>
      </div>
    </div>
  );
};

export default Login;
