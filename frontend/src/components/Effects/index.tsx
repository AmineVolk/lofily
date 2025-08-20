import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';

import { useReduxState } from '@/hooks/useReduxState';

import { UserMusicEffectApi } from '@/services/api/UserMusicEffect';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { EffectItem } from './EffectItem';
import { Dialog } from '../Common/Dialog';

const EffectsDialog = () => {
  const { t } = useTranslation('common');

  const [{ effects, user }, { update }] = useReduxState('effects,user');

  const saveVolume = async (
    id: number,
    newVolume: number,
    oldVolume: number | undefined
  ) => {
    return typeof oldVolume === 'number'
      ? await UserMusicEffectApi.update(id, { volume: newVolume })
      : await UserMusicEffectApi.create({
          music_effect_id: id,
          volume: newVolume,
        });
  };

  const saveVolumeDebounced = useDebouncedCallback(saveVolume, 500);

  const onChangeVolume = (id: number) => async (newVolume: number) => {
    const effect = effects.find((item) => item.id === id);
    const newEffects = effects.map((item) =>
      item.id === id ? { ...item, volume: newVolume } : item
    );
    update(['effects'], newEffects);

    if (user) {
      await saveVolumeDebounced(id, newVolume, effect?.volume);
    }
  };

  return (
    <Dialog
      handleClose={() => update(['currentMenuIndex'], MenuItemsIndex.NONE)}
      title={t('effects.title').toString()}
    >
      <div className='flex min-w-[300px] flex-col space-y-4'>
        {effects.map((item) => (
          <EffectItem
            userMuiscEffect={item}
            key={item.id}
            onChangeVolume={onChangeVolume(item.id)}
          />
        ))}
      </div>
    </Dialog>
  );
};
export { EffectsDialog };
