import * as React from 'react';
import { Avatar, Box } from '@mui/joy';
import { animationScalePulse } from '~/common/util/animUtils';

type CallAvatarProps = {
  symbol: string;
  imageUrl?: string;
  isRinging?: boolean;
  onClick: () => void;
};

export function CallAvatar(props: CallAvatarProps) {
  return (
    <Avatar
      onClick={props.onClick}
      src={props.imageUrl}
      alt={props.imageUrl || props.symbol}
      role="button"
      aria-label={`${props.isRinging ? 'Ringing ' : ''}Call with ${props.symbol}`}
      title={props.symbol}
      tabIndex={0}
      cursor="pointer"
      sx={{
        width: { xs: '10rem', md: '11.5rem' },
        height: { xs: '10rem', md: '11.5rem' },
        borderRadius: '50%',
        transition: 'transform 0.3s ease',
        userSelect: 'none',
        overflow: 'hidden',
        outline: 'none',
        '--Avatar-size': { xs: '10rem', md: '11.5rem' },
        backgroundColor: 'background.popup',
        boxShadow: !props.imageUrl ? 'sm' : null,
        fontSize: { xs: '6rem', md: '7rem' },
        ...(props.isRinging
          ? { animation: `${animationScalePulse} 1.4s ease-in-out infinite` }
          : {}),
      }}
    >
      {!props.imageUrl && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {props.symbol}
        </Box>
      )}
    </Avatar>
  );
}
