import * as React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  SxProps,
  VariantProp,
  ColorPaletteProp,
  SizeProp,
  DisableProp,
  RefProp,
} from '@mui/joy';
import AutoModeIcon from '@mui/icons-material/AutoMode';

type MicContinuationLegendProps = {
  sx?: SxProps;
  color?: ColorPaletteProp;
};

const MicContinuationLegend = (props: MicContinuationLegendProps) => {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.75,
        lineHeight: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        ...props.sx,
      }}
    >
      <Typography level="body2" mr={1}>
        Voice Continuation
      </Typography>
      {props.color && <Typography level="body2" color={props.color}>•</Typography>}
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

const ButtonMicContinuationMemo = React.memo(ButtonMicContinuation);

function ButtonMicContinuation(props: ButtonMicContinuationProps) {
  return (
    <Tooltip
      placement="bottom"
      title={
        <MicContinuationLegend color={props.disabled ? 'neutral.400' : undefined} />
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

export { ButtonMicContinuationMemo as ButtonMicContinuation };
