import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material'; // Corrected import from '@mui/joy' to '@mui/material'

/*
 * Source: the PodcastsIcon from '@mui/icons-material/Podcasts';
 */
export const ChatMulticastOffIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      {...props}
    >
      <path d='M14 12c0 .74-.4 1.38-1 1.72V22h-2v-8.28c-.6-.35-1-.98-1-1.72 0-1.1.9-2 2-2s2 .9 2 2' />
    </SvgIcon>
  );
}
