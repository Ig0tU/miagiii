import React, { useEffect, useMemo, useState } from 'react';
import {
  cleanupEfficiency,
  Diff as TextDiff,
  DIFF_DELETE,
  DIFF_INSERT,
  makeDiff,
} from '@sanity/diff-match-patch';
import { SxProps, Theme, useTheme } from '@mui/joy/styles';
import { Box, Typography } from '@mui/joy';
import type { DiffBlock as DiffBlockType } from './blocks';

type TextDiffType = [op: string, text: string];

type Props = {
  diffBlock: DiffBlockType;
  sx?: SxProps<Theme>;
};

const styleAdd: SxProps<Theme> = {
  backgroundColor: ({ palette }) => `rgba(${palette.success.lightChannel} / 1)`,
  color: ({ palette }) => palette.success.softColor,
  padding: '0.1rem 0.1rem',
  margin: '0 -0.1rem',
};

const styleSub: SxProps<Theme> = {
  backgroundColor: ({ palette }) => `rgba(${palette.danger.darkChannel} / 0.05)`,
  color: ({ palette }) => palette.danger.plainColor,
  padding: '0 0.25rem',
  margin: '0 -0.25rem',
  textDecoration: 'line-through',
};

const styleUnchanged: SxProps<Theme> = {
  backgroundColor: ({ palette }) => `rgba(${palette.neutral.mainChannel} / 0.05)`,
};

export function useSanityTextDiffs(text: string, diffText: string | undefined, enabled: boolean) {
  const [diffs, setDiffs] = useState<TextDiffType[] | null>(null);

  useEffect(() => {
    if (!text || !diffText) {
      setDiffs(null);
      return;
    }

    const callback = () => {
      setDiffs(cleanupEfficiency(makeDiff(diffText, text, { timeout: 1, checkLines: true }), 4));
    };

    const timeout = setTimeout(callback, 200);
    return () => clearTimeout(timeout);
  }, [text, diffText]);

  return diffs;
}

export const RenderTextDiff = (props: Props) => {
  const theme = useTheme();

  const textDiffs = useMemo(() => props.diffBlock.textDiffs, [props.diffBlock.textDiffs]);

  return (
    <Typography
      sx={{
        mx: 1.5,
        overflowWrap: 'anywhere',
        whiteSpace: 'break-spaces',
        display: 'block',
        ...props.sx,
      }}
    >
      {textDiffs.map(([op, text], index) => (
        <Box
          key={'diff-' + index}
          sx={op === DIFF_DELETE ? styleSub : op === DIFF_INSERT ? styleAdd : styleUnchanged}
        >
          {text}
        </Box>
      ))}
    </Typography>
  );
};
