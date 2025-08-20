import { ChangeEvent } from 'react';

export type SelecteItem = {
  value: string | number;
  text: string;
};
interface SelectProps {
  elements: SelecteItem[];
  id?: string;
  selected: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ elements = [], selected, id, onChange }: SelectProps) => {
  return (
    <select
      value={selected}
      id={id}
      className='checked:after:border-l-primary-900 block w-full rounded-lg border border-gray-300 py-2 px-4 text-sm text-gray-900
      peer-checked:bg-secondary-base'
      onChange={({ target: { value } }) =>
        onChange({
          target: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            value: parseInt(value),
          },
        })
      }
    >
      {elements.map(({ value, text }, i) => (
        <option
          value={value}
          itemType='number'
          key={i}
          className='focus:bg-primary-600 active:bg-primary-700'
        >
          {text}
        </option>
      ))}
    </select>
  );
};

export { Select };
