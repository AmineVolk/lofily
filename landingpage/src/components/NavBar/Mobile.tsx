import Image from 'next/image';
import React from 'react';
import { useState } from 'react';
import { pushRotate as Menu } from 'react-burger-menu';

import { MenuItems } from './MenuItems';

const NavBarMobile = () => {
  const [open, setopen] = useState(false);

  return (
    <div className='border-primary-base flex'>
      <div className='relative flex flex-1'>
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
              background: 'rgb(45 28 49)',
              height: '100vh',
              marginTop: '60px',
            },
            bmMenuWrap: {
              width: '220px',
              left: '0',
              background: 'rgb(45 28 49)',
            },
            bmOverlay: {
              background: '#23152696',
            },
            bmBurgerButton: {
              position: 'fixed',
              cursor: 'pointer',
              height: '20px',
              width: '30px',
              margin: '20px 0px',
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
                src='/images/logo-white.png'
                alt='Lofily logo'
                className='mb-0'
                height={50}
                width={50}
              />
            </div>
          </div>
          <div className='mt-4'>
            <MenuItems />
          </div>
        </Menu>
      </div>
    </div>
  );
};
export default NavBarMobile;
