import { FilePondErrorDescription, FilePondFile } from 'filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

import 'react-dropzone-uploader/dist/styles.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import { CreateEffectDto } from '@/Dto/Effects/CreateEffect.dto';
import { logger } from '@/services/logger';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const UploadEffect = ({
  effect,
  onUpload,
}: {
  effect: CreateEffectDto;
  onUpload: (uploaded: boolean) => void;
}) => {
  const [files, setFiles] = useState([]);

  const onProcessFile = (
    error: FilePondErrorDescription | null,
    file: FilePondFile
  ) => {
    if (error) {
      logger('----- upload error ', error);
      onUpload(false);
    } else {
      onUpload(true);
    }
  };

  return (
    <div>
      <FilePond
        files={files}
        onupdatefiles={(files) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setFiles(files);
        }}
        server={{
          url:
            process.env.NEXT_PUBLIC_BACKEND_URL +
            'music-effects?' +
            `name=${effect.name}`,
          headers: {
            authorization: localStorage.getItem('access_token') || '',
          },
        }}
        name='file'
        labelIdle='Drag & Drop your background videos'
        onprocessfile={onProcessFile}
        allowRevert={false}
      />
    </div>
  );
};

export { UploadEffect };
