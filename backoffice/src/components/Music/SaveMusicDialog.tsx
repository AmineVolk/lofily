import { Trans, useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';

import { CreateMusicDto } from '@/Dto/Music/CreateMusic.dto';
import { GetMusicDto } from '@/Dto/Music/GetMusic.dto';
import { logger } from '@/services/logger';

import { UploadMusic } from './UploadMusic';
import { Dialog } from '../common/Dialog';

type DialogProps = {
  onClose: () => void;
  music: GetMusicDto;
  onValidate: (
    editedMusic: CreateMusicDto | GetMusicDto,
    serverResponse?: any
  ) => () => void;
  isEdit: boolean;
};

const SaveMusicDialog = ({
  onClose,
  music,
  onValidate,
  isEdit,
}: DialogProps) => {
  logger('saveMusicDialog music ', music);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('common');

  const title = isEdit ? t('music.dialog.edit') : t('music.new');

  const noUploadError = () => {
    enqueueSnackbar(t('music.create_without_upload'), {
      variant: 'error',
    });
  };

  const onMusicUploaded = (serverResponses: string[] | null) => {
    logger('----- onMusicUploaded called with:', serverResponses);

    if (!serverResponses || serverResponses.length === 0) {
      logger('----- No server responses, calling noUploadError');
      return noUploadError();
    }

    logger('----- Parsing server responses...');
    // Parse all server responses and pass them to the parent component
    const parsedResponses = serverResponses
      .map((response) => {
        try {
          const parsed = JSON.parse(response);
          logger('----- Successfully parsed response:', parsed);
          return parsed;
        } catch (error) {
          console.error('Error parsing server response:', error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null responses

    logger('----- Parsed responses:', parsedResponses);

    if (parsedResponses.length > 0) {
      logger('----- Calling onValidate with parsed responses');
      // Pass all parsed responses to the parent component
      onValidate(music, parsedResponses)();
      onClose();
    } else {
      logger('----- No valid parsed responses');
    }
  };

  const MusicSection = () => {
    return (
      <>
        <p className='mb-2 font-bold text-gray-600'>
          <Trans i18nKey='music.upload_title' />
        </p>
        {music && music.url ? (
          <div>
            <audio controls className='h-[100px] max-w-[200px] rounded-lg'>
              <source
                src={process.env.NEXT_PUBLIC_BACKEND_URL + music.url}
                type='audio/mpeg'
              />
            </audio>
          </div>
        ) : (
          <UploadMusic
            description={t('music.drag_and_drop_description')}
            music={music}
            onUpload={onMusicUploaded}
          />
        )}
      </>
    );
  };

  return (
    <Dialog
      title={title || ''}
      onClose={onClose}
      withValidationButton={isEdit}
      onValidate={onValidate(music)}
    >
      <div className='flex min-w-[400px] flex-col space-y-8'>
        <MusicSection />
      </div>
    </Dialog>
  );
};

export { SaveMusicDialog };
