import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { Box, Button, ButtonGroup, Chip, Divider, IconButton, Typography } from '@mui/joy';
import FormatPaintTwoToneIcon from '@mui/icons-material/FormatPaintTwoTone';

import { animationShadowRingLimey } from '~/common/util/animUtils';

export type DrawHeadingProps = {
  section: number;
  setSection: (section: number) => void;
  showSections?: boolean;
  onRemoveHeading?: () => void;
  sx?: SxProps;
  refineHeading?: string;
  generateHeading?: string;
};

export function DrawHeading(props: DrawHeadingProps) {
  return (
    <Box onClick={props.onRemoveHeading} sx={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3,
      ...props.sx,
    }}>

      {/* Flashy Button */}
      <IconButton
        variant='soft' color='success'
        sx={{
          '--IconButton-size': { xs: '4.2rem', md: '5rem' },
          borderRadius: '50%',
          pointerEvents: 'none',
          backgroundColor: 'background.popup',
          animation: `${animationShadowRingLimey} 5s infinite`,
        }}>
        <FormatPaintTwoToneIcon />
      </IconButton>

      {/* Messaging */}
      <Box>
        <Typography
          level='title-lg'
          fontSize='2rem'
          color='text.primary'
          textAlign='left'
          sx={{ mb: 1 }}
        >
          {props.generateHeading || 'Draw with AI'}
        </Typography>
        <Typography
          level='title-sm'
          fontSize='1.25rem'
          color='text.secondary'
          textAlign='left'
          sx={{ mt: 1 }}
        >
          Turn your ideas into images
        </Typography>
        <Chip
          variant='outlined'
          size='sm'
          sx={{ px: 1, py: 0.5, mt: 0.25, ml: -1, textWrap: 'wrap', opacity: 0.75, cursor: 'not-allowed' }}
          disabled
        >
          Multi-models, AI assisted
        </Chip>
      </Box>

      {/* Section Selector*/}
      {props.showSections && (
        <Divider sx={{ flex: 1 }}>

          <ButtonGroup
            color='primary'
            size='sm'
            orientation='horizontal'
            sx={{
              mx: 'auto',
              backgroundColor: 'background.surface',
              boxShadow: 'sm',
              '& > button': {
                minWidth: 104,
              },
              ...props.sx,
            }}
          >
            <Button
              variant={props.section === 0 ? 'solid' : 'plain'}
              onClick={() => props.setSection(0)}
              key='generate'
            >
              {props.generateHeading || 'Generate'}
            </Button>
            <Button
              disabled={props.section === 1}
              variant={props.section === 1 ? 'solid' : 'plain'}
              onClick={() => props.setSection(1)}
              key='refine'
            >
              {props.refineHeading || 'Refine'}
            </Button>
            {/*<Button*/}
            {/*  disabled={props.section === 2}*/}
            {/*  variant={props.section === 2 ? 'solid' : 'plain'}*/}
            {/*  onClick={() => props.setSection(1)}*/}
            {/*  key='gallery'*/}
            {/*>*/}
            {/*  Gallery*/}
            {/*</Button>*/}
          </ButtonGroup>

        </Divider>
      )}

    </Box>
  );
}
