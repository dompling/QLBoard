import React, { useEffect, useState, Fragment } from 'react';
import { useRequest } from '@@/plugin-request/request';
import {
  addTask,
  getTask,
  getTaskInfo,
  runTask,
  runTaskLog,
} from '@/service/task';
import { Dialog, Transition } from '@headlessui/react';
import { List, InputItem } from 'antd-mobile';

type taskItem = {
  command: string;
  created: number;
  isSystem: 1 | 0;
  name: string;
  saved: boolean;
  schedule: string;
  status: number;
  timestamp: number;
  _id: string;
};

const IndexPage = () => {
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [dataSource, setData] = useState<taskItem[]>([]);
  const [taskRunLog, setLog] = useState<string>('');
  const [formValue, setForm] = useState<Record<string, string>>({});

  const handleOnChange = (name: string) => (value: any) => {
    setForm({ ...formValue, [name]: value });
  };

  const fetchTask = useRequest(getTask, {
    manual: true,
    onSuccess: (data) => {
      setData((data || []).reverse());
    },
  });

  const fetchTaskLog = useRequest(runTaskLog, {
    manual: true,
    pollingInterval: 2000,
    onSuccess: (data) => {
      setLog(data);
      if (!data || data.indexOf('执行结束') > -1) fetchTaskLog.cancel();
    },
  });

  const fetchTaskInfo = useRequest(getTaskInfo, {
    manual: true,
    onSuccess: (data, params) => {
      const newData = dataSource.map(item => {
        // eslint-disable-next-line no-underscore-dangle
        if (item._id === params[0]) return data;
        return item;
      });
      setData(newData);
      fetchTaskLog.run(params[0]);
    },
  });

  useEffect(() => {
    fetchTask.run();
  }, []);

  return (
    <>
      <Transition show={visible} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto bg-blue-200 bg-opacity-50'
          static
          open={visible}
          onClose={() => setVisible(false)}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <div
                  className='mt-2 max-h-80 overflow-hidden overflow-y-scroll pb-4'>
                  <pre className={'whitespace-pre-line overflow-x-hidden'}>
                    {taskRunLog || '暂无执行记录'}
                  </pre>
                </div>
                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={() => setVisible(false)}
                  >
                    确定
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition show={visibleForm} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto bg-blue-200 bg-opacity-50'
          static
          open={visible}
          onClose={() => setVisible(false)}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className='inline-block w-full max-w-md  pb-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <div className='mt-2 overflow-hidden overflow-y-scroll'>
                  <form>
                    <List renderHeader={() => '添加定时任务'}>
                      <InputItem
                        placeholder='请输入任务名称'
                        onChange={handleOnChange('name')}
                      >
                        名称
                      </InputItem>
                      <InputItem
                        placeholder='请输入 cron'
                        onChange={handleOnChange('schedule')}
                      >
                        定时
                      </InputItem>
                      <InputItem
                        placeholder='请输入执行脚本'
                        onChange={handleOnChange('command')}
                      >
                        脚本
                      </InputItem>
                    </List>
                  </form>
                </div>
                <div className='mt-4 px-6 flex justify-between'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={() => setVisibleForm(false)}
                  >
                    取消
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={() => addTask(formValue).then(
                      () => {setVisibleForm(false);})}
                  >
                    确定
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <div
        className={'p-4 overflow-hidden overflow-y-auto rounded-xl'}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {dataSource.map((item) => {
          return (
            <div
              key={item._id}
              className='mb-3 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col overflow-hidden'
            >
              <div className={'px-4 py-2 bg-blue-200 flex'}>
                <button
                  className={'ml-auto'}
                  onClick={() => {
                    setVisible(true);
                    fetchTaskInfo.run(item._id);
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                </button>
                <button
                  className={'ml-3'}
                  onClick={() => {
                    if (!item.status) return;
                    runTask(item._id);
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={`h-6 w-6 ${
                      !item.status ? 'animate-spin text-red-400' : 'text-white'
                    }`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </button>
              </div>
              <div className={'p-4'}>
                <p className='text-gray-500 flex items-center truncate'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 flex-shrink-0'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  &nbsp;{item.schedule}
                </p>
                <p className='text-gray-500 flex items-center truncate'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 flex-shrink-0'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                    />
                  </svg>
                  &nbsp;{item.command}
                </p>
                <div className='text-1xl font-sm text-black'>{item.name}</div>
              </div>
            </div>
          );
        })}
      </div>
      <footer
        className={
          'fixed bottom-0  px-4 w-full h-16 flex justify-center items-center'
        }
      >
        <div
          className={
            'bg-white w-full h-10 shadow-2xl rounded-2xl flex  justify-center items-center'
          }
        >
          <div
            className={
              'h-14 w-14 rounded-full flex justify-center items-center bg-blue-500 border-2 border-white'
            }
            onClick={() => {setVisibleForm(true);}}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white shadow-2xl'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
          </div>
        </div>
      </footer>
    </>
  );
};

export default IndexPage;
