import { useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useState } from 'react';

import { CreateEffectDto } from '@/Dto/Effects/CreateEffect.dto';
import { GetEffectDto } from '@/Dto/Effects/GetEffect.dto';
import { logger } from '@/services/logger';

import { UploadEffect } from './UploadEffect';
import { Dialog } from '../common/Dialog';
import { Input } from '../common/Input';

type DialogProps = {
  onClose: () => void;
  effectToEdit: GetEffectDto | null;
  onValidateEdit: (
    editedBackground: CreateEffectDto | GetEffectDto
  ) => () => void;
};

const SaveEffectDialog = ({
  onClose,
  effectToEdit,
  onValidateEdit,
}: DialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('common');

  const [effect, setEffect] = useState<CreateEffectDto | GetEffectDto>(
    effectToEdit || new CreateEffectDto()
  );
  logger('----------- effect ', effect);

  const title = effectToEdit
    ? t('background.dialog.edit')
    : t('background.new');

  const onChange =
    (field: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEffect({
        ...effect,
        [field]: event.target.value,
      });
    };

  const noUploadError = () => {
    enqueueSnackbar(t('background.create_without_upload'), {
      variant: 'error',
    });
  };

  const handleUploaded = (uploaded: boolean) => {
    if (!uploaded) {
      return noUploadError();
    }
    onClose();
    return window.location.reload();
  };

  return (
    <Dialog
      title={title || ''}
      onClose={onClose}
      withValidationButton={Boolean(effectToEdit)}
      onValidate={onValidateEdit(effect)}
    >
      <div className='flex min-w-[400px] flex-col space-y-8'>
        <Input
          label={t('effects.name') || ''}
          value={effect?.name}
          onChange={onChange('name')}
        />
        {!effectToEdit && effect.name && (
          <UploadEffect effect={effect} onUpload={handleUploaded} />
        )}
      </div>
    </Dialog>
  );
};

export { SaveEffectDialog };
