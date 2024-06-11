import * as React from 'react';
import { Box, Button, FormControl, FormHelperText, Input, InputLabel } from '@mui/joy';
import YouTubeIcon from '@mui/icons-material/YouTube';

import type { SxProps } from '@mui/joy/styles/types';
import { useYouTubeTranscript, YTVideoTranscript } from '~/modules/youtube/useYouTubeTranscript';

interface YouTubeURLInputProps {
  onSubmit: (transcript: string) => void;
  isFetching: boolean;
  sx?: SxProps;
}

export const YouTubeURLInput: React.FC<YouTubeURLInputProps> = ({ onSubmit, isFetching, sx }) => {
  const [url, setUrl] = React.useState('');
  const [submitFlag, setSubmitFlag] = React.useState(false);
  const [error, setError] = React.useState('');

  // Function to extract video ID from URL
  const extractVideoID = (videoURL: string): string | null => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^#&?]*).*/;
    const match = videoURL.match(regExp);
    return (match && match[1]?.length === 11) ? match[1] : null;
  }

  const videoID = extractVideoID(url);

  // Callback function to handle new transcript
  const handleNewTranscript = (newTranscript: YTVideoTranscript) => {
    onSubmit(newTranscript.transcript); // Pass the transcript text to the onSubmit handler
    setSubmitFlag(false); // Reset submit flag after handling
    setError(''); // Reset error message after successful fetch
  };

  const { transcript, isFetching: isTranscriptFetching, isError: isTranscriptError } = useYouTubeTranscript(videoID && submitFlag ? videoID : null, handleNewTranscript);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setError(''); // Reset error message when URL changes
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form from causing a page reload
    setSubmitFlag(true); // Set flag to indicate a submit action
  };

  React.useEffect(() => {
    if (isTranscriptError) {
      setError('Error fetching transcript. Please try again.');
    }
  }, [isTranscriptError]);

  return (
    <Box sx={{ mb: 1, ...sx }}>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <InputLabel>Enter YouTube Video URL</InputLabel>
          <Input
            required
            fullWidth
            disabled={isFetching || isTranscriptFetching}
            variant='outlined'
            type='url'
            value={url}
            onChange={handleChange}
            startDecorator={<YouTubeIcon sx={{ color: '#f00' }} />}
            sx={{ mb: 1.5, backgroundColor: 'background.popup' }}
          />
          <FormHelperText error>{error}</FormHelperText>
        </FormControl>
        <Button
          type='submit'
          variant='solid'
          disabled={isFetching || isTranscriptFetching || !url}
          loading={isFetching || isTranscriptFetching}
          sx={{ minWidth: 140 }}
        >
          Get Transcript
        </Button>
      </form>
    </Box>
  );
};
