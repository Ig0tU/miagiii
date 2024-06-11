import * as React from 'react';

import { Box, IconButton, Tooltip, Typography } from '@mui/joy';
import { ColorPaletteProp, SxProps, VariantProp, SizeProp, DisableProp, RefProp } from '@mui/joy/styles/types';
import AutoModeIcon from '@mui/icons-material/AutoMode';

type MicContinuationLegendProps = {
  sx?: SxProps;
};

const MicContinuationLegend = (props: MicContinuationLegendProps) => {
  return (
    <Box sx={{ px: 1, py: 0.75, lineHeight: '1.5rem', ...props.sx }}>
      <Typography level="body2">Voice Continuation</Typography>
    </Box>
  );
};

type ButtonMicContinuationProps = {
  variant: VariantProp;
  color: ColorPaletteProp;
  onClick: () => void;
  disabled?: DisableProp;
  disabledSx?: SxProps;
  disabledTitle?: string;
  sx?: SxProps;
  size?: SizeProp;
};

export const ButtonMicContinuationMemo = React.memo(ButtonMicContinuation);

function ButtonMicContinuation(props: ButtonMicContinuationProps) {
  return (
    <Tooltip
      placement="bottom"
      title={
        props.disabled ? (
          <MicContinuationLegend sx={{ color: 'neutral.400' }} />
        ) : (
          <MicContinuationLegend />
        )
      }
    >
      <IconButton
        variant={props.variant}
        color={props.color}
        onClick={props.disabled ? undefined : props.onClick}
        disabled={props.disabled}
        sx={props.disabled ? { ...props.sx, ...props.disabledSx, color: 'neutral.400' } : props.sx}
        size={props.size}
        ref={props.disabled ? undefined : props.ref}
        title={props.disabled ? props.disabledTitle : undefined}
      >
        <AutoModeIcon />
      </IconButton>
    </Tooltip>
  );
}
