import { useEffect } from 'react';

import { useReduxState } from '@/hooks/useReduxState';

import { GetEffectDto } from '@/Dto/Effects/GetEffect.dto';
import { EffectApi } from '@/services/api/Effect';
import { logger } from '@/services/logger';

import { EffectComponent } from './effects.component';

const EffectsContainer = () => {
  const [
    {
      effects: { data, total, page, limit },
    },
    { update, remove },
  ] = useReduxState('effects');

  const onValidateDelete =
    (id: number, closeDialog: () => void, index: number) => () => {
      return EffectApi.remove(id).then(() => {
        remove(['effects', 'data', index.toString()]);
        closeDialog();
      });
    };

  const onValidateEdit =
    (index: number, onCloseDialog: () => void) =>
    (editedBackground: GetEffectDto) =>
    () => {
      EffectApi.update(editedBackground.id, editedBackground).then(() => {
        logger('---------- onvalidateEdit ', { editedBackground, index });
        update(['effects', 'data'], editedBackground, index);
        onCloseDialog();
      });
    };

  const handlePageChange = (newPage: number) => {
    update(['effects', 'page'], newPage);
  };

  const handlePerRowsChange = (newPerPage: number) => {
    update(['effects', 'limit'], newPerPage);
  };

  useEffect(() => {
    EffectApi.getAll(limit, page).then(({ data }) => update(['effects'], data));
  }, [limit, page]);

  return (
    <div>
      <EffectComponent
        data={data}
        handlePageChange={handlePageChange}
        handlePerRowsChange={handlePerRowsChange}
        total={total}
        onValidateDelete={onValidateDelete}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onValidateEdit={onValidateEdit}
      />
    </div>
  );
};
export { EffectsContainer };
