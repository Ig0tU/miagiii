import * as React from 'react';

import { Box, Button, IconButton, SxProps, Tooltip } from '@mui/joy';
import { CallIcon } from '@mui/icons-material';

type CallIconButtonProps = {
  isMobile: boolean;
  disabled?: boolean;
  onClick: () => void;
  tooltipTitle?: string;
  iconSx?: SxProps;
};

const CallIconButton = React.memo(({ isMobile, disabled, onClick, tooltipTitle, iconSx }: CallIconButtonProps) => {
  const buttonContent = isMobile ? (
    <IconButton variant='soft' color='primary' disabled={disabled} onClick={onClick} sx={iconSx}>
      <CallIcon />
    </IconButton>
  ) : (
    <CallIcon sx={iconSx} />
  );

  if (tooltipTitle) {
    return (
      <Tooltip disableInteractive variant='solid' arrow placement='right' title={tooltipTitle}>
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
});

const mobileSx: SxProps = {
  mr: { xs: 1, md: 2 },
};

const desktopSx: SxProps = {
  '--Button-gap': '1rem',
};

type ButtonCallProps = {
  isMobile: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const ButtonCallMemo = React.memo(ButtonCall);

function ButtonCall(props: ButtonCallProps) {
  const { isMobile, disabled, onClick } = props;

  const tooltipTitle = isMobile ? undefined : 'Quick call regarding this chat';
  const iconSx = isMobile ? undefined : { mr: 1 };

  return (
    <CallIconButton
      isMobile={isMobile}
      disabled={disabled}
      onClick={onClick}
      tooltipTitle={tooltipTitle}
      iconSx={iconSx}
    />
  );
}
