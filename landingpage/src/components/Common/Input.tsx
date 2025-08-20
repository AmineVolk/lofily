import clsx from 'clsx';
import React from 'react';
import { useFormContext } from 'react-hook-form';

type InputProps = {
  label: string;
  value: string;
  disabled?: boolean;
  validation?: object;
  id: string;
  onChange: (value: string) => void;
  type?: string;
  isTextarea?: boolean;
};

const Input = ({
  label,
  onChange,
  disabled = false,
  id,
  validation,
  value = '',
  type,
  isTextarea,
}: InputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = errors[id];
  const disabledStyle = disabled ? 'cursor-not-allowed' : '';

  return (
    <div className='mb-6 w-full'>
      {isTextarea ? (
        <textarea
          {...register(id, validation)}
          key={id}
          placeholder={label.toLocaleLowerCase()}
          value={value}
          onChange={({ target: { value } }) => onChange(value)}
          className='h-48 w-full rounded-lg border-0 bg-primary-light p-2.5 py-2 px-4 text-sm text-white placeholder:capitalize'
        ></textarea>
      ) : (
        <input
          {...register(id, validation)}
          type={type}
          key={id}
          placeholder={label.toLocaleLowerCase()}
          value={value}
          className={clsx([
            disabledStyle,
            `block w-full rounded-lg border-0 bg-primary-light p-2.5 text-sm text-white placeholder:capitalize`,
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
export { Input };
