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
  onUpload: (uploaded: string[] | null) => void;
  description: string;
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [uploadResponses, setUploadResponses] = useState<string[]>([]);

  const onProcessFile = (error: FilePondErrorDescription | null, file: any) => {
    if (error) {
      logger('----- upload error ', error);
      return;
    }

    // Get the response for this specific file
    const response = file.serverId;
    if (response) {
      logger('----- File processed successfully, response:', response);
      // Add this response to our collection
      setUploadResponses((prev) => [...prev, response]);

      // Check if we have responses for all files
      if (uploadResponses.length + 1 >= files.length) {
        logger('----- All files processed, calling onUpload');
        const allResponses = [...uploadResponses, response];
        onUpload(allResponses);
        setUploadResponses([]);
      }
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
      setFiles([]);

      return;
    }

    logger('----- valid audio file accepted: ', file.file.type);
  };

  const url = process.env.NEXT_PUBLIC_BACKEND_URL + 'music';

  return (
    <div>
      <div className='mb-4 text-sm text-gray-600'>
        <p>
          Vous pouvez glisser-déposer plusieurs fichiers audio en même temps
        </p>
        <p className='mt-1 text-xs'>
          Formats acceptés: MP3, WAV, OGG, AAC, FLAC, M4A
        </p>
      </div>

      <FilePond
        files={files}
        onupdatefiles={(files) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setFiles(files);
          // Reset responses when files change
          setUploadResponses([]);
        }}
        server={{
          process: {
            headers: {
              authorization: localStorage.getItem('access_token') || '',
            },
            url: url,
            onload: (res) => {
              console.log('📤 FilePond onload response:', res);
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
        allowMultiple={true}
        instantUpload={true}
        chunkUploads={false}
        allowReplace={true}
        allowRevert={true}
        credits={false}
      />
    </div>
  );
};

export { UploadMusic };
