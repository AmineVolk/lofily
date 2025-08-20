import Image from 'next/image';

const Footer = () => {
  return (
    <div
      id='footer'
      className='mt-10 flex flex-1 items-center justify-center border-t border-gray-600 px-8 py-6  font-magilio text-lg downSm:flex-col downSm:space-y-4 '
    >
      <div className='mt-2 flex flex-1 items-center justify-start space-x-2 downSm:flex-col downSm:justify-center downSm:space-y-4'>
        <div className='flex items-center space-x-2'>
          <p className='text-xl'>Lofily</p>
          <Image
            src='/images/logo-white.png'
            width={35}
            height={35}
            alt='lofily logo'
          />
        </div>
        <div className='flex items-center   downSm:flex-col downSm:space-y-4 upLg:space-x-4'>
          <p className='text-lg'>
            Copyright © {new Date().getFullYear()} lofily.com
          </p>
        </div>
        <p className='downSm:hidden'>|</p>
        <a href='/termsofservices' target='_blank'>
          Terms of Service
        </a>

        <p className='downSm:hidden'>|</p>
        <a href='/privacypolicy' target='_blank'>
          Privacy Policy
        </a>
      </div>

      <div className='flex items-center space-x-4 font-spartan text-gray-500'>
        <a href='https://www.instagram.com/lofily.com/' target='_blank'>
          <Image
            src='/images/social/insta.svg'
            width={35}
            height={35}
            alt='lofily instagram'
          />
        </a>

        <a href='https://twitter.com/lofilyapp' target='_blank'>
          <Image
            src='/images/social/twitter.svg'
            width={35}
            height={35}
            alt='lofily twitter'
          />
        </a>
      </div>
    </div>
  );
};
export { Footer };
