import * as React from 'react';

import { Chip, ColorPaletteProp, VariantProp, SxProps } from '@mui/joy';
import type { VChatMessageIn } from '~/modules/llms/llm.client';

export function CallMessage(
  props: React.PropsWithChildren<{
    text?: string | React.ReactNode;
    variant?: VariantProp;
    color?: ColorPaletteProp;
    role: VChatMessageIn['role'];
    sx?: SxProps<typeof Chip>;
    key?: React.Key;
  }> & React.RefAttributes<HTMLDivElement>
) {
  const isUserMessage = props.role === 'user';
  return (
    <Chip
      ref={props.ref}
      color={props.color}
      variant={props.variant}
      sx={{
        alignSelf: isUserMessage ? 'end' : 'start',
        whiteSpace: 'break-spaces',
        borderRadius: 'lg',
        ...(isUserMessage ? {
          borderBottomRightRadius: 0,
        } : {
          borderBottomLeftRadius: 0,
        }),
        // boxShadow: 'md',
        py: 1,
        px: 1.5,
        ...(props.sx || {} as SxProps<typeof Chip>),
      }}
      key={props.key}
    >
      {props.text}
    </Chip>
  );
}
