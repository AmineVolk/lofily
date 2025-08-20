import { useReduxState } from '@/hooks/useReduxState';

import { ListenEffectItem } from './ListenEffectItem';

const ListenEffects = () => {
  const [{ effects }] = useReduxState('effects');
  const effectswithVolume = effects.filter(
    (effect) => effect.volume && effect.volume > 0
  );
  return (
    <div id='audio-effect-wrapper' className='absolute z-0'>
      {effectswithVolume.map((effect) => (
        <ListenEffectItem
          key={effect.id}
          src={process.env.NEXT_PUBLIC_BACKEND_URL + effect.url}
          volume={effect.volume ? effect.volume / 100 : 0}
        />
      ))}
    </div>
  );
};
export { ListenEffects };
