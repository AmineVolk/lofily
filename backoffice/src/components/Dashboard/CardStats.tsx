import Image from 'next/image';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { DayStats } from '@/Dto/Stats/UserStats.dto';
import { stringToDate } from '@/services/helper';

import { Card } from '../common/Card';

const CardStats = ({
  title,
  percent_progression,
  total,
  last_7_days,
}: {
  title: string;
  percent_progression: string;
  total: number;
  last_7_days: DayStats[];
}) => {
  const getIcon = () => {
    if (percent_progression.includes('+')) {
      return '/images/increase.svg';
    } else if (percent_progression.includes('-')) {
      return '/images/decrease.svg';
    }
    return '/images/stable-stats.svg';
  };

  //@ts-expect-error no error
  const CustomTooltip = (props) => {
    const { payload } = props;
    const currentData = payload[0]?.payload;

    if (!currentData) return <div />;
    return (
      <div className='rounded-md bg-gray-200 p-2'>
        <p>{stringToDate(currentData?.day)}</p>
      </div>
    );
  };
  const formated_percent =
    percent_progression === '0%' ? '' : percent_progression;
  return (
    <Card className='p flex-1 rounded-lg '>
      <div className='flex '>
        <div className='flex flex-1 items-center'>
          <div className='flex flex-1 flex-col justify-start space-y-4'>
            <p className='text-sm font-semibold '>{title}</p>
            <div className='flex items-center'>
              <Image
                src={getIcon()}
                className='mr-2'
                width={24}
                height={24}
                alt='decreaseprogression icon'
              />
              <p className='font-mono text-sm font-semibold  '>
                {formated_percent}
              </p>
            </div>
            <p className='text-3xl font-bold'>{total}</p>
          </div>
        </div>
        <div className='flex max-w-[150px] flex-1 items-center justify-end'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart width={150} height={20} data={last_7_days}>
              <Bar dataKey='count' fill='#FB923C' />
              <Tooltip key='day' content={<CustomTooltip />} />
              <XAxis dataKey='count' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
export { CardStats };
