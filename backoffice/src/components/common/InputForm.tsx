import clsx from 'clsx';
import React, { HTMLInputTypeAttribute } from 'react';
import { useFormContext } from 'react-hook-form';

type InputProps = {
  label?: string;
  value: string | number;
  disabled?: boolean;
  validation?: object;
  id: string;
  onChange: (value: string | number) => void;
  type?: HTMLInputTypeAttribute;
  isTextarea?: boolean;
};

const InputForm = ({
  label,
  onChange,
  disabled = false,
  id,
  validation,
  value = '',
  type = 'string',
  isTextarea,
}: InputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = errors[id];
  const disabledStyle = disabled ? 'cursor-not-allowed' : '';

  return (
    <div className='relative mb-6 w-full'>
      <label
        htmlFor='floating_outlined'
        className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm capitalize text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-secondary-base'
      >
        {label}
      </label>

      {isTextarea ? (
        <textarea
          {...register(id, validation)}
          key={id}
          value={value}
          onChange={({ target: { value } }) => onChange(value)}
          className='h-48 w-full rounded-lg border-0 bg-primary-light p-2.5 py-2 px-4 text-sm text-black placeholder:capitalize'
        ></textarea>
      ) : (
        <input
          {...register(id, validation)}
          type={type}
          key={id}
          value={value}
          min={0}
          className={clsx([
            disabledStyle,
            'border-1 peer block w-full rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-secondary-base focus:outline-none focus:ring-0  focus:ring-secondary-base',
          ])}
          onChange={({ target: { value } }) => onChange(value)}
        />
      )}

      {error && (
        <p className='mt-2 text-red-800'>{error.message?.toString()}</p>
      )}
    </div>
  );
};
export { InputForm };
