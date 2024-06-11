import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/joy';

export function LocalAIIcon(props: SvgIconProps) {
  const localAIPathData = `M 11.2 1.5 L 10.7 1.6 ... 10.1 4.9 L 10.7 4.2 Z`;

  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      width={props.width || 24}
      height={props.height || 24}
      fill="currentColor"
    >
      <path d={localAIPathData} />
    </SvgIcon>
  );
}
