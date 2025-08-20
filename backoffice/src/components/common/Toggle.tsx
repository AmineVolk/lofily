import { ChangeEvent } from 'react';

type Props = {
  text?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  disabled?: boolean;
};
const Toggle = ({ text, checked, onChange, disabled }: Props) => {
  return (
    <div className='flex items-center space-x-4'>
      {text && (
        <span className='text-sm font-medium text-gray-900'>{text}</span>
      )}
      <label className='relative inline-flex cursor-pointer items-center'>
        <input
          type='checkbox'
          checked={checked}
          className='peer sr-only'
          onChange={onChange}
          disabled={disabled}
        />
        <div
          className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 
            after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border 
         after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary-base peer-checked:after:translate-x-full 
         peer-checked:after:border-white
          peer-focus:ring-4 peer-focus:ring-red-100"
        ></div>
      </label>
    </div>
  );
};
export { Toggle };
