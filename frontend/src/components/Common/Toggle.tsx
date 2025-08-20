type Props = {
  text?: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
};
const Toggle = ({ text, checked, onChange }: Props) => {
  return (
    <div className='flex items-center space-x-4'>
      {text && (
        <span className='text-sm font-medium text-gray-900 dark:text-gray-300'>
          {text}
        </span>
      )}
      <label className='relative inline-flex cursor-pointer items-center'>
        <input
          type='checkbox'
          checked={checked}
          className='peer sr-only'
          onChange={({ target: { checked } }) => onChange(checked)}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
      </label>
    </div>
  );
};
export { Toggle };
