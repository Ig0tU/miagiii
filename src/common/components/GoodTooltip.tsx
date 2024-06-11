import * as React from 'react';

import { Tooltip, SxProps } from '@mui/joy';

type GoodTooltipProps = {
  title: string;
  placement?: 'top' | 'bottom' | 'top-start';
  isError?: boolean;
  isWarning?: boolean;
  arrow?: boolean;
  usePlain?: boolean;
  children: React.ReactNode;
  sx?: SxProps;
};

/**
 * Tooltip with text that wraps to multiple lines (doesn't go too long)
 */
const GoodTooltip = (props: GoodTooltipProps) => {
  const { title, placement = 'top', isError, isWarning, arrow = true, usePlain = false, children, sx } = props;

  return (
    <Tooltip
      key={title}
      title={title}
      placement={placement}
      disableInteractive
      arrow={arrow}
      variant={isError || isWarning ? 'soft' : usePlain ? 'plain' : undefined}
      color={isError ? 'danger' : isWarning ? 'warning' : undefined}
      sx={{
        maxWidth: { sm: '50vw', md: '25vw' },
        whiteSpace: 'break-spaces',
        ...(sx || {}),
      }}
    >
      {children}
    </Tooltip>
  );
};

export default GoodTooltip;
