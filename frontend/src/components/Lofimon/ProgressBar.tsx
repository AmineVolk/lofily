import clsx from 'clsx';

import { useReduxState } from '@/hooks/useReduxState';

import { getLofimonData } from '@/services/helper';
import { MenuItemsIndex } from '@/services/redux-state/Store';

const LofimonProgressBar = ({
  className,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  const [{ user }, { update }] = useReduxState('user');
  const lofimonData = user ? getLofimonData(user?.starter_usage_minutes) : null;
  const label = `${lofimonData?.progression_hours}/${lofimonData?.max_hours}`;

  if (!user || !lofimonData) return <div />;
  return (
    <button
      onClick={() => update(['currentMenuIndex'], MenuItemsIndex.LOFIMON)}
      className={clsx([
        'relative h-[35px] rounded-sm border border-secondary-base bg-gray-200 text-black',
        className,
      ])}
    >
      <div
        className='h-full  bg-secondary-base'
        style={{
          width: `${Math.round(
            (lofimonData?.progression_hours * 100) / lofimonData?.max_hours
          )}%`,
        }}
      />
      <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform font-bold '>
        {label}
      </p>
    </button>
  );
};
export { LofimonProgressBar };
