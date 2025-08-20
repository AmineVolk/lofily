import { CopyToClipboard } from 'react-copy-to-clipboard';
import Image from 'next/image';
import { Link } from 'react-scroll';

const CouponBanner = () => {
  return (
    <Link
      to='pricing'
      smooth={true}
      duration={3000}
      spy
      href='https://app.lofily.com/#pricing'
      className='top-0 z-50 flex w-full flex-1 justify-center bg-[#D76425] p-2 font-description text-lg font-bold downSm:flex-col
       downSm:p-1 downSm:py-2 downSm:pl-20 downSm:text-xs downMd:absolute'
    >
      <div className='flex items-center'>
        <span>20% OFF Annual Plan with code: </span>
        <button className='mx-2 flex items-center'>
          <p className='mr-2'>HELLO20</p>
          <CopyToClipboard text='HELLO20'>
            <Image
              src='/images/copy.svg'
              height={24}
              width={24}
              alt='copy coupon'
            />
          </CopyToClipboard>
        </button>
      </div>
      <div>
        <span className='mr-2 downSm:hidden'>| </span>
        <span>Valid until 30.09.2023</span>
      </div>
    </Link>
  );
};
export { CouponBanner };
