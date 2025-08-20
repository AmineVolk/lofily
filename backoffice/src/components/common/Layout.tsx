import React, { useEffect, useState } from 'react';

import { UserApi } from '@/services/api/UserApi';

import { SideBar } from '../SideBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const getUser = () => {
    return UserApi.me()
      .then(({ data }) => {
        setIsAuth(true);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      });
  };

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
    getUser();
  }, [mounted]);

  if (!mounted || !isAuth) return null;

  return (
    <div className='flex h-full'>
      <SideBar />
      <div className='flex flex-1 flex-col px-8 pt-20'>{children}</div>
    </div>
  );
}
