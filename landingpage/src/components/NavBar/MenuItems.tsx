import { GradientLink } from '../Common/GradientLink';
import { Link } from 'react-scroll';
import React from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';

export const MenuItems = () => {
  const { t } = useTranslation('common');
  const isDesktop = useMediaQuery('(min-width: 1000px)');

  const ItemsData = [
    t('navbar.contact'),
    t('navbar.faq'),
    t('navbar.princing'),
    t('navbar.testimonial'),
  ];

  return (
    <>
      {ItemsData.map((text, i) => (
        <Item text={text} key={i} />
      ))}
      {!isDesktop && (
        <div className='mt-10 flex   cursor-pointer items-center justify-center text-lg'>
          <GradientLink
            href='https://app.lofily.com'
            text={t('navbar.go_to_app_button')}
          />
        </div>
      )}
    </>
  );
};
const Item = ({ text }: { text: string }) => {
  return (
    <div className='mr-10 flex h-10 cursor-pointer items-center text-lg duration-300 hover:text-secondary-base down3Xl:ml-5'>
      <Link
        to={text}
        smooth={true}
        duration={3000}
        spy
        href={`https://app.lofily.com/#${text}`}
        className='font-description text-xl capitalize'
      >
        {text}
      </Link>
    </div>
  );
};
