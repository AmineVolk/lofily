import Image from 'next/image';
import { Trans } from 'react-i18next';

import { NbrUserOfBackground } from '@/Dto/Stats/UserStats.dto';

import { Card } from '../common/Card';
const BackgroundStats = ({ data }: { data: NbrUserOfBackground[] }) => {
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <Card className='mt-6 flex'>
      <div>
        <h3 className='mb-4'>
          <Trans i18nKey='dashboard.background.title' />
        </h3>

        <div className='flex  '>
          <div className='flex flex-1 flex-wrap'>
            {data.map(({ count, thumbnail, url, id }, index) => (
              <div
                key={id}
                className='mr-2 mb-2 flex flex-col rounded-md   border-2 p-2'
                style={
                  {
                    // borderColor: COLOR_ARRAY[index],
                  }
                }
              >
                <Image
                  className='rounded-md'
                  src={process.env.NEXT_PUBLIC_BACKEND_URL + thumbnail}
                  width={250}
                  height={150}
                  alt=''
                  loader={() => process.env.NEXT_PUBLIC_BACKEND_URL + thumbnail}
                />
                <p className='mt-2 font-semibold'>
                  <Trans
                    i18nKey='dashboard.background.description'
                    values={{ count }}
                  />
                </p>
              </div>
            ))}
          </div>
          {/* <div className='flex-1'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={100}
                  outerRadius={200}
                  fill='#8884d8'
                  dataKey='count'
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_ARRAY[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div> */}
        </div>
      </div>
    </Card>
  );
};
export { BackgroundStats };
