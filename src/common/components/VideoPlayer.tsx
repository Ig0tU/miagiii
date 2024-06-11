import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

import type { YouTubePlayerProps } from 'react-player/youtube';

type VideoPlayerProps = YouTubePlayerProps & {
  responsive?: boolean;
  youTubeVideoId?: string;
};

const VideoPlayerDynamic = lazy(() =>
  import('react-player/youtube')
    .then(({ default: ReactPlayerYouTube }) => ({ default: ReactPlayerYouTube }))
    .catch(() => null)
);

const VideoPlayerComponent: React.FC<VideoPlayerProps> = (props) => {
  const { responsive, youTubeVideoId, ...baseProps } = props;

  if (responsive) {
    baseProps.width = '100%';
    baseProps.height = '100%';
  }

  if (youTubeVideoId && !baseProps.url) {
    baseProps.url = `https://www.youtube.com/watch?v=${youTubeVideoId}`;
  }

  if (!baseProps.url && !youTubeVideoId) {
    return null;
  }

  return <VideoPlayerDynamic {...baseProps} />;
};

VideoPlayerComponent.propTypes = {
  url: PropTypes.string,
  youTubeVideoId: PropTypes.string,
  responsive: PropTypes.bool,
  ...YouTubePlayerProps,
};

export function VideoPlayer(props: VideoPlayerProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPlayerComponent {...props} />
    </Suspense>
  );
}
