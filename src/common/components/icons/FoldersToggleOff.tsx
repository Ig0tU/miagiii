import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/joy';

type FoldersToggleOffProps = SvgIconProps & {
  title?: string;
  description?: string;
};

export function FoldersToggleOff(props: FoldersToggleOffProps) {
  return (
    <SvgIcon
      title={props.title || 'Folders Toggle Off'}
      description={props.description || 'A icon of folders toggle off.'}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="none"
      fill="currentColor"
      {...props}
    >
      <path d="m9.17 6 2 2H20v10H4V6zM10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8z" />
      <path d="M 16,11 12,16 8,11 Z" />
    </SvgIcon>
  );
}
