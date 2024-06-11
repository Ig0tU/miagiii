import * as React from 'react';

import { Chip } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

import { hideOnMobile } from '~/common/app.theme';
import { isMacUser } from '~/common/util/pwaUtils';

/**
 * Converts a keystroke string to a platform-aware representation.
 * @param text The keystroke string to convert.
 * @returns The converted keystroke string.
 */
export function platformAwareKeystrokes(text: string): string {
  if (isMacUser) {
    return text
      .replaceAll('Ctrl', '⌘' /* Command */)
      .replaceAll('Alt', '⌥' /* Option */)
      .replaceAll('Shift', '⇧');
  }
  return text;
}

/**
 * Shows a shortcut combo in a nicely presented dark box.
 * @param props The props to use for the `KeyStroke` component.
 * @returns The rendered `KeyStroke` component.
 */
export function KeyStroke(props: { combo: string | null | undefined, dark?: boolean, sx?: SxProps }) {
  return (
    <Chip
      variant={props.dark ? 'solid' : 'outlined'}
      color='neutral'
      sx={{ ...hideOnMobile, ...(props.sx || {}) }}
    >
      {props.combo && platformAwareKeystrokes(props.combo)}
    </Chip>
  );
}
