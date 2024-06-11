// Copyright (c) 2023-2024 Enrico Ros
// This subsystem is responsible for fetching the transcript of a YouTube video.
// It is used by the Big-AGI Persona Creator to create a character sheet.

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { frontendSideFetch } from '~/common/util/clientFetchers';
import { fetchYouTubeTranscript } from './youtube.fetcher';
import { apiAsync } from '~/common/util/trpc.client';

// configuration
const USE_FRONTEND_FETCH = false;

export interface YTVideoTranscript {
  title: string;
  transcript: string;
  thumbnailUrl: string;
}

export interface QueryKeys {
  transcript: [string];
}

export interface QueryFnArgs {
  videoId: string;
}

export interface QueryFnResult {
  videoTitle: string;
  transcript: string;
  thumbnailUrl: string;
}

export function useYouTubeTranscript(videoID: string | null, onNewTranscript: (transcript: YTVideoTranscript) => void) {

  // state
  const [transcript, setTranscript] = React.useState<YTVideoTranscript | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // data
  const { data, isFetching, isError, error } = useQuery<QueryFnResult, Error, QueryFnResult, QueryKeys, QueryFnArgs>({
    enabled: !!videoID,
    queryKey: ['transcript', videoID],
    queryFn: async ({ videoId }) => {
      if (USE_FRONTEND_FETCH) {
        const url = `https://www.youtube.com/oembed?format=json&url=http://www.youtube.com/watch?v=${videoId}`;
        const response = await frontendSideFetch(url);
        const data = await response.json();
        const transcriptData = await fetchYouTubeTranscript(videoId, url => frontendSideFetch(url).then(res => res.text()));
        return {
          videoTitle: data.title,
          transcript: transcriptData.transcript,
          thumbnailUrl: data.thumbnail_url,
        };
      } else {
        return apiAsync.youtube.getTranscript.query({ videoId });
      }
    },
    staleTime: Infinity,
    select: (data) => data,
  });

  // update the transcript when the underlying data changes
  React.useEffect(() => {
    if (!data) {
      setTranscript(null);
      setIsLoading(false);
      return;
    }
    const transcript = {
      title: data.videoTitle,
      transcript: data.transcript,
      thumbnailUrl: data.thumbnailUrl,
    };
    setTranscript(transcript);
    onNewTranscript(transcript);
    setIsLoading(false);
  }, [data, onNewTranscript]);

  return {
    transcript,
    isLoading,
    isFetching,
    isError, error,
  };
}
