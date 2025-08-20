import Image from 'next/image';
import { useState } from 'react';

const AudioListener = ({ url }: { url: string }) => {
  const [audioStatus, changeAudioStatus] = useState(false);
  const [audio, setAudio] = useState(new Audio(url));

  const startAudio = () => {
    audio.play();
    changeAudioStatus(true);
  };

  const pauseAudio = () => {
    audio.pause();

    changeAudioStatus(false);
  };

  return (
    <>
      <audio src={url} />
      {audioStatus ? (
        <button onClick={pauseAudio}>
          <Image width={20} height={20} src='/images/pause.svg' alt='pause' />
        </button>
      ) : (
        <button onClick={startAudio}>
          <Image width={20} height={20} src='/images/play.svg' alt='play' />
        </button>
      )}
    </>
  );
};
export { AudioListener };
