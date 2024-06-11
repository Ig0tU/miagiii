import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  url: string | null;
  firstDelay?: number;
  repeatMs?: number;
}

export function usePlaySoundUrl({ url, firstDelay = 0, repeatMs = 0 }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      return;
    }

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', url, error);
        });
      }
    };

    if (audioRef.current) {
      audioRef.current.src = url;
    } else {
      audioRef.current = new Audio(url);
    }

    clearTimeout(timerRef.current as NodeJS.Timeout);

    if (firstDelay > 0) {
      timerRef.current = setTimeout(playAudio, firstDelay);
    } else {
      playAudio();
    }

    if (repeatMs > 0) {
      timerRef.current = setInterval(playAudio, repeatMs);
    }

    return () => {
      clearTimeout(timerRef.current as NodeJS.Timeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [url, firstDelay, repeatMs]);

  return audioRef;
}

/* Note: the following function was an earlier implementation of AudioLivePlayer, but it didn't work well.

export async function playLiveAudioStream(stream: ReadableStream<Uint8Array>, mimeType: string = 'audio/mpeg') {
  const mediaSource = new MediaSource();
  const audio = new Audio(URL.createObjectURL(mediaSource));
  audio.autoplay = true;

  mediaSource.addEventListener('sourceopen', async () => {
    const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
    const reader = stream.getReader();

    const processStream = async () => {
      const { done, value } = await reader.read();

      if (done) {
        mediaSource.endOfStream();
        return;
      }

      if (sourceBuffer.updating) {
        await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));
      }

      sourceBuffer.appendBuffer(value);
      processStream();
    };

    processStream();
  });
}*/
