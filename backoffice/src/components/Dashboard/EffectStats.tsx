import { Trans } from 'react-i18next';

import { NbrUserOfEffect } from '@/Dto/Stats/UserStats.dto';

import { AudioListener } from '../common/Audio';
import { Card } from '../common/Card';

const EffectStats = ({ data }: { data: NbrUserOfEffect[] }) => {
  return (
    <Card className='mt-6'>
      <div>
        <h3 className='mb-4'>
          <Trans i18nKey='dashboard.effect.title' />
        </h3>

        <div className='flex flex-1 flex-wrap'>
          {data.map(({ count, url, id, name }, index) => (
            <div
              key={id}
              className='mr-2 mb-2 flex  flex-col rounded-md   border-2 p-4'
            >
              <div className='flex items-center space-x-4'>
                <p className='font-semibold'>{name}</p>
                <AudioListener
                  url={process.env.NEXT_PUBLIC_BACKEND_URL + url}
                />
              </div>

              <p className='mt-2 '>
                <Trans
                  i18nKey='dashboard.effect.description'
                  values={{ count }}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
export { EffectStats };
