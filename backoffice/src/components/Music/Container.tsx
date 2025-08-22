import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { CreateMusicDto } from '@/Dto/Music/CreateMusic.dto';
import { GetMusicDto } from '@/Dto/Music/GetMusic.dto';
import { MusicApi } from '@/services/api/Music';

import { MusicList } from './MusicList';
import { SaveMusicDialog } from './SaveMusicDialog';
import { DeleteDialog } from '../common/DeleteDialog';

const MusicContainer = () => {
  const [
    {
      musics: { data, total, page, limit },
      categories,
    },
    { update },
  ] = useReduxState('musics,categories');

  const DEFAULT_MUSIC: GetMusicDto = {
    title: '',
    artist: '',
    url: '',
    id: 0,
    duration: 0,
    duration_text: '',
    artist_link: '',
    image_url: '',
    is_active: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  const { t } = useTranslation();
  const [showModal, setShowModal] = useState({
    delete: false,
    create: false,
  });

  const [clickedMusic, setClickedMusic] = useState<GetMusicDto>(DEFAULT_MUSIC);

  const closeDialog = () => {
    setShowModal({ create: false, delete: false });
    setClickedMusic(DEFAULT_MUSIC);
  };

  const onClickNew = () => {
    setShowModal({
      ...showModal,
      create: true,
    });
  };

  const onClickDelete = (id: number) => {
    setShowModal({ ...showModal, delete: true });
    setClickedMusic(getMusicById(id));
  };

  const getMusicById = (clickedMusicId: number): GetMusicDto =>
    data.find(({ id }) => id === clickedMusicId) || DEFAULT_MUSIC;

  const onValidateDelete = () => {
    if (clickedMusic) {
      return MusicApi.remove(clickedMusic?.id).then(() => {
        const newMusics = data.filter((music) => music.id !== clickedMusic?.id);
        update(['musics', 'data'], newMusics);
        setClickedMusic(DEFAULT_MUSIC);
        closeDialog();
      });
    }
  };

  const onValidateCreate =
    (newMusic: CreateMusicDto | GetMusicDto, serverResponses?: any[]) => () => {
      if (serverResponses && serverResponses.length > 0) {
        // Add all new musics directly to the state
        const updatedMusics = [...data, ...serverResponses];
        update(['musics', 'data'], updatedMusics);

        // Update total count
        update(['musics', 'total'], total + serverResponses.length);
      }

      setClickedMusic(DEFAULT_MUSIC);
      closeDialog();
    };

  const handlePageChange = (newPage: number) => {
    update(['musics', 'page'], newPage);
  };

  const handlePerRowsChange = (newPerPage: number) => {
    update(['musics', 'limit'], newPerPage);
  };

  // Load musics on component mount
  const loadMusics = () => {
    MusicApi.getAll(limit, page).then(({ data }) => {
      update(['musics', 'data'], data.data);
    });
  };

  useEffect(() => {
    loadMusics();
  }, []);

  return (
    <div className='flex h-full flex-1 flex-col'>
      {data.length ? 'data' : 'nodata'}
      <MusicList
        data={data}
        total={total}
        handlePageChange={handlePageChange}
        handlePerRowsChange={handlePerRowsChange}
        onClickNew={onClickNew}
        onClickDelete={onClickDelete}
      />

      {showModal.create && (
        <SaveMusicDialog
          onClose={closeDialog}
          music={clickedMusic}
          isEdit={false}
          onValidate={onValidateCreate}
        />
      )}

      {showModal.delete && (
        <DeleteDialog
          onClose={closeDialog}
          onValidate={onValidateDelete}
          title={t('music.delete_title')}
        />
      )}
    </div>
  );
};

export { MusicContainer };
