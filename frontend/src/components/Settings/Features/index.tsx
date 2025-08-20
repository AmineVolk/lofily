import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from './FeatureCard';
import { FeatureDetails } from './FeatureDetails';

const Features = () => {
  const { t } = useTranslation();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState<number | null>(
    null
  );
  return (
    <div className='flex flex-wrap downSm:justify-center'>
      {typeof currentFeatureIndex === 'number' ? (
        <FeatureDetails
          onClickBack={() => setCurrentFeatureIndex(null)}
          index={currentFeatureIndex}
        />
      ) : (
        <div className='flex flex-wrap'>
          {[...Array(8)].map((_, index) => (
            <FeatureCard
              onClick={() => setCurrentFeatureIndex(index)}
              key={index}
              title={t(`setting.features.${index}.title`)}
              img={`/images/features/icons/${index}.svg`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export { Features };
