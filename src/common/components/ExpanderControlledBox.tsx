import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { Box, styled, useTheme } from '@mui/joy';

type ExpanderControlledBoxProps = {
  expanded: boolean;
  children: React.ReactNode;
  sx?: SxProps;
  ref?: React.Ref<HTMLDivElement>;
};

const BoxCollapser = styled(Box)<{ expanded: boolean }>({
  display: 'grid',
  transition: 'grid-template-rows 0.2s cubic-bezier(.17,.84,.44,1)',
  gridTemplateRows: '0fr',
  '&[aria-expanded="true"]': {
    gridTemplateRows: '1fr',
  },
});

const BoxCollapsee = styled(Box)({
  overflow: 'hidden',
  transition: 'padding 0.2s cubic-bezier(.17,.84,.44,1)',
  padding: '16px',
});

export function ExpanderControlledBox(props: ExpanderControlledBoxProps) {
  const theme = useTheme();
  return (
    <BoxCollapser
      ref={props.ref}
      aria-expanded={props.expanded}
      role={props.expanded ? 'region' : undefined}
      sx={{
        borderBottom: props.expanded ? `1px solid ${theme.palette.divider}` : undefined,
        ...props.sx,
      }}
    >
      <BoxCollapsee>
        {props.children}
      </BoxCollapsee>
    </BoxCollapser>
  );
}
