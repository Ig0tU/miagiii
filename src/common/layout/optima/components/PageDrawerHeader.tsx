import * as React from 'react';
import { SxProps } from '@mui/joy/styles';
import { Box, IconButton, Typography } from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export type PageDrawerHeaderProps = {
  title: string;
  onClose: () => void;
  sx?: SxProps;
  children?: React.ReactNode;
};

export const PageDrawerHeader = ({
  title,
  onClose,
  sx = {},
  children,
}: PageDrawerHeaderProps) => (
  <Box
    sx={{
      minHeight: 'var(--AGI-Nav-width)',
      px: 1,
      backgroundColor: 'background.popup',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...sx,
    }}
  >
    {children || <IconButton disabled />}

    <Typography
      level="title-md"
      fontWeight="md"
      color="neutral.body"
    >
      {title}
    </Typography>

    <IconButton
      aria-label="Close Drawer"
      size="sm"
      onClick={onClose}
      disabled={!onClose}
    >
      <CloseRoundedIcon fontSize="small" alt="Close Drawer" />
    </IconButton>
  </Box>
);
