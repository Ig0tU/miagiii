import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { Box, IconButton, Tooltip, Typography } from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

type ReplyToBubbleProps = {
  replyToText: string | null;
  inlineMessage?: boolean;
  onClear?: () => void;
  className?: string;
  sx?: SxProps;
  dataTestid?: string;
  key?: string | number;
};

const INLINE_COLOR = 'primary';

const bubbleComposerSx: SxProps = {
  width: '100%',
  zIndex: 2,
  backgroundColor: 'background.surface',
  border: '1px solid',
  borderColor: 'neutral.outlinedBorder',
  borderRadius: 'sm',
  boxShadow: 'xs',
  padding: '0.5rem 0.25rem 0.5rem 0.5rem',
  display: 'flex',
  alignItems: 'start',
};

const inlineMessageSx: SxProps = {
  ...bubbleComposerSx,
  mt: 1,
  borderColor: `${INLINE_COLOR}.outlinedColor`,
  borderRadius: 'sm',
  boxShadow: 'xs',
  width: undefined,
  padding: '0.375rem 0.25rem 0.375rem 0.5rem',
  float: 'inline-end',
  mr: { xs: 7.75, md: 10.5 },
};

export function ReplyToBubble(props: ReplyToBubbleProps) {
  const {
    replyToText,
    inlineMessage = false,
    onClear,
    className,
    sx = {},
    dataTestid = 'reply-to-bubble',
    key,
  } = props;

  return (
    <Box
      key={key}
      className={className}
      sx={!inlineMessage ? bubbleComposerSx : { ...inlineMessageSx, ...sx }}
      data-testid={dataTestid}
    >
      <Tooltip disableInteractive arrow title="Referring to this assistant text" placement="top">
        <ReplyRoundedIcon
          sx={{
            color: inlineMessage ? `${INLINE_COLOR}.outlinedColor` : 'primary.solidBg',
            fontSize: 'xl',
            mt: 0.125,
          }}
        />
      </Tooltip>
      <Typography
        level="body-sm"
        sx={{
          flex: 1,
          ml: 1,
          mr: 0.5,
          overflow: 'auto',
          maxHeight: '5.75rem',
          lineHeight: 'xl',
          color: /* inlineMessage ? 'text.tertiary' : */ 'text.secondary',
          whiteSpace: 'break-spaces', // 'balance'
        }}
      >
        {replyToText}
      </Typography>
      {onClear && (
        <IconButton size="sm" onClick={onClear} sx={{ my: -0.5, background: 'none' }}>
          <CloseRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
}
