import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { BeamCard } from '../BeamCard';
import { Fusion } from './Fusion';
import { findFusionFactory, FusionFactorySpec } from './instructions/beam.gather.factories';
import { BeamStoreApi, useBeamStore } from '../store-beam.hooks';
import { GATHER_COLOR } from '../beam.config';
import { browserLangNotUS } from '~/common/util/pwaUtils';
import { SxProps } from '@mui/joy/styles/types';
import { Button, Typography, useTheme } from '@mui/joy';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import LanguageIcon from '@mui/icons-material/Language';

const fusionGridDesktopSx: SxProps = {
  mt: '-1 * var(--Pad)',
  px: 'var(--Pad)',
  pb: 'var(--Pad)',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(max(min(100%, 390px), 100%/5), 1fr))',
  gap: 'var(--Pad)',
};

const fusionGridMobileSx: SxProps = {
  ...fusionGridDesktopSx,
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
};

interface FusionAddButtonProps {
  canGather: boolean;
  currentFactory: FusionFactorySpec | null;
  onAddFusion: () => void;
  sx?: SxProps;
  small?: boolean;
  textOverride?: string;
  variant?: VariantProp;
}

function FusionAddButton(props: FusionAddButtonProps) {
  if (props.currentFactory === null) return null;
  return (
    <Button
      size={props.small ? 'sm' : undefined}
      color={GATHER_COLOR}
      variant={props.variant}
      disabled={!props.canGather}
      onClick={props.onAddFusion}
      startDecorator={
        props.currentFactory?.Icon ? (
          <props.currentFactory.Icon />
        ) : (
          <AddCircleOutlineRoundedIcon title='Add Fusion' />
        )
      }
      sx={{
        justifyContent: 'end',
        gap: 1,
        ...props.sx,
      }}
    >
      {props.textOverride || props.currentFactory?.addLabel}
    </Button>
  );
}

interface BeamFusionGridProps {
  beamStore: BeamStoreApi;
  canGather: boolean;
  fusionIds: string[];
  isMobile: boolean;
  onAddFusion: () => void;
  raysCount: number;
}

export function BeamFusionGrid(props: BeamFusionGridProps) {
  const { currentFactory } = useBeamStore(props.beamStore, useShallow(state => ({
    currentFactory: findFusionFactory(state.currentFactoryId),
  })));
  const isDarkMode = useTheme().palette.mode === 'dark';

  const isEmpty = props.fusionIds.length === 0;
  const isNoFactorySelected = currentFactory === null;

  return (
    <Box
      sx={{
        ...(props.isMobile ? fusionGridMobileSx : fusionGridDesktopSx),
        ...(isEmpty ? {
          backgroundColor: 'neutral.solidBg',
        } : {
          backgroundColor: isDarkMode ? 'success.900' : '#F2FFFA',
          pt: 'var(--Pad)',
        }),
      }}
    >
      {props.fusionIds.map((fusionId) => (
        <Fusion
          key={'fusion-' + fusionId}
          beamStore={props.beamStore}
          fusionId={fusionId}
        />
      ))}

      {(isEmpty || !isNoFactorySelected) && (
        <BeamCard
          className={isEmpty ? beamCardClasses.smashTop : undefined}
          sx={{
            backgroundColor: props.canGather ? `${GATHER_COLOR}.softBg` : undefined,
            boxShadow: `0px 6px 16px -12px rgb(var(--joy-palette-${props.canGather ? GATHER_COLOR : 'neutral'}-darkChannel) / 40%)`,
            mb: '0.25rem',
          }}
        >
          {isNoFactorySelected ? null : props.canGather ? (
            <Box sx={{ display: 'flex', flexDirection: props.isMobile ? 'column-reverse' : undefined, alignItems: props.isMobile ? undefined : 'center', gap: 1 }}>
              <FusionAddButton
                canGather={props.canGather}
                currentFactory={currentFactory}
                onAddFusion={props.onAddFusion}
                sx={{
                  minHeight: props.isMobile ? 'calc(2 * var(--Card-padding) + 2rem - 0.5rem)' : undefined,
                  marginBottom: 'calc(-1 * var(--Card-padding) + 0.25rem)',
                  marginInline: 'calc(-1 * var(--Card-padding) + 0.375rem)',
                  whiteSpace: 'nowrap',
                }}
              />
              <Typography
                level='body-sm'
                variant='soft'
                color={GATHER_COLOR}
                fontWeight='bold'
                fontSize='sm'
                sx={{ marginBlockStart: '0.5rem', marginInline: '0.5rem' }}
              >
                {currentFactory.description}
              </Typography>
            </Box>
          ) : (
            <Typography
              level='body-sm'
              sx={{
                opacity: 0.8,
                marginBlockStart: '0.5rem',
                marginInline: '0.5rem',
              }}
            >
              Waiting for multiple responses.
            </Typography>
          )}
        </BeamCard>
      )}

      {browserLangNotUS && (
        <Alert color='warning' sx={{ gridColumn: '1 / -1' }}>
          <Typography
            level='body-sm'
            color='warning'
            startDecorator={<LanguageIcon />}
            fontSize='sm'
            sx={{ marginBlockStart: '0.5rem', marginInline: '0.5rem' }}
          >
            Note: Merges are defined in English and have not been translated to your browser language ({navigator.language}) yet.
          </Typography>
        </Alert>
      )}

      {/*{padItems > 0 && (*/}
      {/*  Array.from({ length: padItems }).map((_, index) => (*/}
      {/*    <Box*/}
      {/*      key={'pad-' + index}*/}
      {/*      sx={{*/}
      {/*        paddingBlockStart: 'var(--Pad)',*/}
      {/*        paddingBlockEnd: 'var(--Pad)',*/}
      {/*        paddingInlineStart: 'var(--Pad)',*/}
      {/*        paddingInlineEnd: 'var(--Pad)',*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  ))*/}
      {/*)}*/}

    </Box>
  );
}
