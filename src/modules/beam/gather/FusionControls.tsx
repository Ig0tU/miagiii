import * as React from 'react';
import { Box, CircularProgress, IconButton, Sheet, SvgIconProps, Tooltip } from '@mui/joy';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import { BFusion } from './beam.gather';
import { FusionFactorySpec } from './instructions/beam.gather.factories';
import { GoodTooltip } from '~/common/components/GoodTooltip';

type FusionControlsProps = {
  fusion: BFusion;
  factory: FusionFactorySpec;
  isFusing: boolean;
  isInterrupted: boolean;
  isUsable: boolean;
  llmLabel: string;
  llmVendorIcon: React.FunctionComponent<SvgIconProps>;
  onRemove: () => void;
  onToggleGenerate: () => void;
};

export const FusionControlsMemo: React.FC<FusionControlsProps> = React.memo(FusionControls);

function FusionControls(props: FusionControlsProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* LLM Icon */}
      <Tooltip title={props.llmLabel} placement='top'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'neutral.50',
            ...(props.isUsable ? {} : { opacity: 0.5 }),
            ...(props.isFusing ? { pointerEvents: 'none' } : {}),
          }}
        >
          <props.llmVendorIcon
            fontSize='lg'
            sx={{ color: 'neutral.800', ...(props.isFusing ? { opacity: 0.5 } : {}) }}
            alt={props.llmLabel}
          />
        </Box>
      </Tooltip>

      {/* Title / Progress Component */}
      <Sheet
        variant='outlined'
        // color={GATHER_COLOR}
        sx={{
          // backgroundColor: `${GATHER_COLOR}.softBg`,
          flex: 1,
          borderRadius: 'sm',
          minHeight: '2rem',
          pl: 1,
          // layout
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* [progress] Spinner | Factory Icon */}
        {props.fusion.fusingProgressComponent ? (
          <CircularProgress
            color='neutral'
            size='sm'
            sx={{ '--CircularProgress-size': '16px', '--CircularProgress-trackThickness': '2px', ...(props.isFusing ? {} : { display: 'none' }) }}
            disabled={!props.isFusing}
          />
        ) : (
          !!props.factory.Icon && (
            <IconButton
              size='sm'
              variant='plain'
              color='neutral'
              title={props.factory.cardTitle}
              onClick={props.onToggleGenerate}
              disabled={!props.isUsable}
              sx={{ ...(props.isUsable ? {} : { opacity: 0.5 }), ...(props.isFusing ? { pointerEvents: 'none' } : {}) }}
              aria-label={props.factory.cardTitle}
              type='button'
            >
              <props.factory.Icon fontSize='lg' />
            </IconButton>
          )
        )}

        {/* [progress] Component | Title */}
        {props.fusion.fusingProgressComponent
          // Show the progress in place of the title
          ? props.fusion.fusingProgressComponent
          : (
            <Box
              sx={{
                fontSize: 'sm',
                fontWeight: 'md',
                ...(props.isUsable ? {} : { color: 'neutral.500' }),
                ...(props.isFusing ? { pointerEvents: 'none' } : {}),
              }}
            >
              {props.factory.cardTitle} {props.isInterrupted && <em> - Interrupted</em>}
            </Box>
          )}
      </Sheet>

      {!props.isFusing ? (
        <GoodTooltip title={!props.isUsable ? 'Start Merge' : 'Retry'}>
          <IconButton
            size='sm'
            variant='plain'
            color='success'
            onClick={props.onToggleGenerate}
            disabled={!props.isUsable}
            sx={{ ...(props.isUsable ? {} : { opacity: 0.5 }), ...(props.isFusing ? { pointerEvents: 'none' } : {}) }}
            aria-label={!props.isUsable ? 'Start Merge' : 'Retry'}
            type='button'
          >
            {!props.isUsable ? <PlayArrowRoundedIcon sx={{ fontSize: 'xl2' }} /> : <ReplayRoundedIcon />}
          </IconButton>
        </GoodTooltip>
      ) : (
        <GoodTooltip title='Stop'>
          <IconButton
            size='sm'
            variant='plain'
            color='danger'
            onClick={props.onToggleGenerate}
            sx={{ ...(props.isFusing ? {} : { opacity: 0.5 }), ...(props.isFusing ? {} : { pointerEvents: 'none' }) }}
            aria-label='Stop'
            type='button'
          >
            <StopRoundedIcon />
          </IconButton>
        </GoodTooltip>
      )}

      <GoodTooltip title='Remove'>
        <IconButton
          size='sm'
          variant='plain'
          color='neutral'
          onClick={props.onRemove}
          sx={{ ...(props.isUsable ? {} : { opacity: 0.5 }), ...(props.isFusing ? { pointerEvents: 'none' } : {}) }}
          aria-label='Remove'
          type='button'
        >
          <RemoveCircleOutlineRoundedIcon />
        </IconButton>
      </GoodTooltip>
    </Box>
  );
}
