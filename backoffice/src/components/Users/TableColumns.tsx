import clsx from 'clsx';
import Image from 'next/image';

import { GetUserDto } from '@/Dto/User/GetUserDto';
import { stringToDate } from '@/services/helper';
function addZeroBefore(n: number) {
  return (n < 10 ? '0' : '') + n;
}
export const getTableColumns = (
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void
) => [
  {
    name: 'Email',
    cell: ({ email }: GetUserDto) => <p className='font-bold'>{email}</p>,
  },
  {
    name: 'CreatedAt',
    cell: ({ created }: GetUserDto) => (
      <p className=''>
        {stringToDate(created.toString())}{' '}
        {addZeroBefore(new Date(created).getUTCHours())}:
        {addZeroBefore(new Date(created).getUTCMinutes())}
      </p>
    ),
  },
  {
    name: 'Username',
    selector: ({ username }: GetUserDto) => username,
  },
  {
    name: 'Email confirmed',
    cell: ({ isEmailConfirmed }: GetUserDto) => {
      return (
        <p
          className={clsx([
            'rounded-md p-2 capitalize text-white',
            isEmailConfirmed ? 'bg-[#36B37E]' : 'bg-[#c03e1e]',
          ])}
        >
          {isEmailConfirmed ? 'Yes' : 'No'}
        </p>
      );
    },
  },
  {
    name: 'Type',
    cell: ({ type }: GetUserDto) => {
      const notAdmin =
        type === 'FREEMIUM' ? (
          <div className='rounded-md bg-gray-200  p-2'>User Freemium</div>
        ) : (
          <div className='rounded-md  border bg-secondary-base  p-2  text-white'>
            <p>User Premium</p>
          </div>
        );
      return <p>{type === 'admin' ? 'Admin' : notAdmin}</p>;
    },
  },
  {
    name: 'Subscription',
    cell: ({
      type,
      subscription_infos: { interval, currency, amount },
    }: GetUserDto) => {
      const notAdmin =
        type === 'FREEMIUM' ? (
          <div />
        ) : (
          <div className='rounded-md  border border-secondary-base  p-2    '>
            <p className='font-bold'>
              {amount} {currency} {' / '} {interval}
            </p>
          </div>
        );
      return <p>{type === 'admin' ? 'Admin' : notAdmin}</p>;
    },
  },
  {
    name: 'Action',
    cell: (props: GetUserDto) => {
      return (
        <div className='flex flex-1 justify-start space-x-4'>
          <button onClick={() => onClickEdit(props.id)}>
            <Image width={20} height={20} src='/images/edit.svg' alt='edit' />
          </button>
          <button onClick={() => onClickDelete(props.id)}>
            <Image width={20} height={20} src='/images/delete.svg' alt='edit' />
          </button>
        </div>
      );
    },
  },
];
