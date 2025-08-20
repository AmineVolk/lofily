import Image from 'next/image';
import React, { ReactNode } from 'react';
import { useState } from 'react';
import { pushRotate as Menu } from 'react-burger-menu';

const SideBarMobile = ({ children }: { children: ReactNode }) => {
  const [open, setopen] = useState(false);

  return (
    <div className='border-primary-base flex'>
      <div className='relativeflex flex-1'>
        <Menu
          isOpen={open}
          onStateChange={(state) => setopen(state.isOpen)}
          customBurgerIcon={
            <Image
              src='/images/menu.svg'
              alt='menu-burger'
              style={{ cursor: 'pointer' }}
              width={10}
              height={10}
            />
          }
          disableAutoFocus
          styles={{
            bmMenu: {
              background: 'white',
              height: '100vh',
              marginTop: '60px',
            },
            bmMenuWrap: {
              width: '220px',
              left: '0',
              background: 'white',
            },
            bmOverlay: {
              background: '#23152696',
            },
            bmBurgerButton: {
              position: 'fixed',
              cursor: 'pointer',
              height: '20px',
              width: '30px',
              margin: '20px',
              zIndex: '9999',
            },
          }}
        >
          <div
            style={{ display: 'flex' }}
            className='h-[100px]  items-center justify-center border-t border-b border-t-white border-b-white'
          >
            <div>
              <Image
                src='/images/logo.png'
                alt='Lofily logo'
                className='mb-0'
                height={35}
                width={40}
              />
            </div>
          </div>
          <div className='mt-4'>{children}</div>
        </Menu>
      </div>
    </div>
  );
};
export default SideBarMobile;
