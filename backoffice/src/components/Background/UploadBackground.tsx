import { FilePondErrorDescription } from 'filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

import 'react-dropzone-uploader/dist/styles.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import { GetBackgroundDto } from '@/Dto/Background/GetBackground.dto';
import { logger } from '@/services/logger';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const UploadBackground = ({
  background,
  onUpload,
  description,
  background_id,
}: {
  background: GetBackgroundDto;
  onUpload: (uploaded: string | null) => void;
  description: string;
  background_id?: number;
}) => {
  const [files, setFiles] = useState([]);
  const [uploadResponse, setUploadResponse] = useState(null);

  const onProcessFile = (error: FilePondErrorDescription | null) => {
    if (error) {
      logger('----- upload error ', error);
      onUpload(null);
    } else {
      onUpload(uploadResponse);
    }
  };
  const mobileUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL +
    `background/mobile?category_id=${background.category_id}&background_id=${background_id}`;

  const url =
    process.env.NEXT_PUBLIC_BACKEND_URL +
    `background?category_id=${background.category_id}&is_default=${background.is_default}`;

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
          process: {
            headers: {
              authorization: localStorage.getItem('access_token') || '',
            },
            url: background_id ? mobileUrl : url,
            onload: (res) => {
              setUploadResponse(res);
              return res;
            },
          },
        }}
        name='file'
        labelIdle={description}
        onprocessfile={onProcessFile}
        allowRevert={false}
      />
    </div>
  );
};

export { UploadBackground };
