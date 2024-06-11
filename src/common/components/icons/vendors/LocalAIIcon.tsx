import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/joy';

const localAIPathData = `M 11.2 1.5 L 10.7 1.6 ... 10.1 4.9 L 10.7 4.2 Z`;

export function LocalAIIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="none"
      fill="currentColor"
      {...props}
    >
      <path
        d={localAIPathData}
      />
    </SvgIcon>
  );
}
