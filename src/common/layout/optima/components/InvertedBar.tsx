import * as React from 'react';
import { Sheet, styled, useTheme, SxProps } from '@mui/joy';

type BarProps = {
  width: string;
  height: string;
};

const InvertedBarCornerItem = styled(Box)<BarProps>(({ width, height }) => ({
  width,
  height,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledSheet = styled(Sheet)<BarProps>(({ width }) => ({
  '--Bar': width,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const InvertedBar = (props: {
  id?: string;
  component: React.ElementType;
  direction: 'horizontal' | 'vertical';
  sx?: SxProps;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  const isDark = theme?.palette.mode === 'dark';

  const barWidth = React.useMemo(() => {
    if (props.direction === 'horizontal') {
      return { width: props.sx?.minWidth || 'var(--Bar)' };
    } else {
      return { height: props.sx?.minHeight || 'var(--Bar)' };
    }
  }, [props.direction, props.sx]);

  return (
    <StyledSheet
      id={props.id}
      component={props.component}
      variant={isDark ? 'soft' : 'solid'}
      invertedColors={!isDark ? true : undefined}
      {...barWidth}
      sx={props.sx}
    >
      {props.children}
    </StyledSheet>
  );
};
