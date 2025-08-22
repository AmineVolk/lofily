import { FilePondErrorDescription } from 'filepond';
import { useState } from 'react';
import { FilePond } from 'react-filepond';

import 'filepond/dist/filepond.min.css';

import { GetMusicDto } from '@/Dto/Music/GetMusic.dto';
import { logger } from '@/services/logger';

const UploadMusic = ({
  music,
  onUpload,
  description,
}: {
  music: GetMusicDto;
  onUpload: (uploaded: string | null) => void;
  description: string;
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

  const onAddFile = (error: FilePondErrorDescription | null, file: any) => {
    if (error) {
      logger('----- file validation error ', error);
      return;
    }

    // Strict client-side validation for audio files only
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/flac',
    ];

    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'];

    // Check MIME type
    if (!allowedTypes.includes(file.file.type)) {
      logger('----- invalid MIME type rejected: ', file.file.type);
      setFiles([]);
      alert(
        `Type de fichier non autorisé: ${file.file.type}. Seuls les fichiers audio sont acceptés.`
      );
      return;
    }

    // Check file extension as additional validation
    const fileName = file.file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      logger('----- invalid file extension rejected: ', fileName);
      setFiles([]);
      alert(
        `Extension de fichier non autorisée. Seuls les fichiers audio sont acceptés (.mp3, .wav, .ogg, .aac, .flac, .m4a).`
      );
      return;
    }

    logger('----- valid audio file accepted: ', file.file.type);
  };

  const url = process.env.NEXT_PUBLIC_BACKEND_URL + 'music';

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
            url: url,
            onload: (res) => {
              console.log('📤 FilePond onload response:', res);
              setUploadResponse(res);
              return res;
            },
            onerror: (error) => {
              console.log('❌ FilePond error:', error);
            },
          },
        }}
        name='file'
        labelIdle={description}
        onaddfile={onAddFile}
        onprocessfile={onProcessFile}
      />
    </div>
  );
};

export { UploadMusic };
