import React, { useState, useCallback, useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import cn from 'classnames';
import {
  SxProps,
  Box,
  Button,
  Step,
  stepClasses,
  StepIndicator,
  stepIndicatorClasses,
  Stepper,
  Typography,
  useMediaQuery,
} from '@mui/joy';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import BlocksRenderer from '~/modules/blocks/BlocksRenderer';
import AgiSquircleIcon from '~/common/components/icons/AgiSquircleIcon';
import ChatBeamIcon from '~/common/components/icons/ChatBeamIcon';
import { GlobalShortcutItem, ShortcutKeyName, useGlobalShortcuts } from '~/common/components/useGlobalShortcut';
import { hasGoogleAnalytics } from '~/common/components/GoogleAnalytics';
import { useIsMobile } from '~/common/components/useMatchMedia';
import { animationTextShadowLimey } from '~/common/util/animUtils';

// Configuration
const colorButtons = 'neutral';
const colorStepper = 'neutral';

interface ExplainerStep {
  stepDigits: string;
  stepName?: string;
}

const stepSequenceSx: SxProps = {
  width: '100%',
  '& .' + stepClasses.completed + '::after': {
    bgcolor: `${colorStepper}.500`,
  },
  '& .' + stepClasses.active + ' .' + stepIndicatorClasses.root: {
    borderColor: `${colorStepper}.500`,
  },
  '& .' + stepClasses.root:has(+ .' + stepClasses.active + ')::after': {
    color: `${colorStepper}.500`,
    backgroundColor: 'transparent',
    backgroundImage: 'radial-gradient(currentColor 2px, transparent 2px)',
    backgroundSize: '7px 7px',
    backgroundPosition: 'center left',
  },
};

const buttonBaseSx: SxProps = {
  justifyContent: 'space-between',
  minHeight: '2.5rem',
  minWidth: 120,
};

const buttonNextSx: SxProps = {
  ...buttonBaseSx,
  boxShadow: `0 8px 24px -4px rgb(var(--joy-palette-${colorButtons}-mainChannel) / 20%)`,
  minWidth: 180,
};

function AllStepsStepper({ steps, activeIndex, isMobile, onStepClicked }: any) {
  return (
    <Stepper sx={stepSequenceSx}>
      {steps.map((step, stepIndex) => {
        const completed = activeIndex > stepIndex;
        const active = activeIndex === stepIndex;
        return (
          <Step
            key={'step-' + stepIndex}
            orientation="vertical"
            completed={completed}
            active={active}
            indicator={
              <StepIndicator
                variant={completed || active ? 'solid' : 'outlined'}
                color={colorStepper}
                onClick={() => onStepClicked(stepIndex)}
                sx={{ cursor: 'pointer' }}
              >
                {completed ? <CheckRoundedIcon sx={{ fontSize: 'md' }} /> : active ? <KeyboardArrowDownRoundedIcon sx={{ fontSize: 'lg' }} /> : undefined}
              </StepIndicator>
            }
          >
            <Typography
              fontSize={isMobile ? 'sm' : undefined}
              fontWeight="xl"
              endDecorator={
                step.stepName && <Typography fontSize="sm" fontWeight="normal" sx={{ mr: 0.5 }}>{step.stepName}</Typography>
              }
            >{step.stepDigits ?? null}</Typography>
          </Step>
        );
      })}
    </Stepper>
  );
}

export interface ExplainerPage extends ExplainerStep {
  titlePrefix?: string;
  titleSquircle?: boolean;
  titleSpark?: string;
  titleSuffix?: string;
  mdContent: string;
}

export function ExplainerCarousel({
  explainerId,
  steps,
  footer,
  noStepper,
  onFinished,
}: {
  explainerId: string;
  steps: ExplainerPage[];
  footer?: React.ReactNode;
  noStepper?: boolean;
  onFinished: () => any;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const isMobile = useIsMobile();
  const isLastPage = stepIndex === steps.length - 1;
  const activeStep = steps[stepIndex] ?? null;

  const handlePrevPage = useCallback(() => {
    setStepIndex((step) => (step > 0 ? step - 1 : step));
  }, []);

  const handleNextPage = useCallback(() => {
    if (isLastPage) {
      hasGoogleAnalytics && sendGAEvent('event', 'tutorial_complete', { tutorial_id: explainerId });
      onFinished();
    } else {
      setStepIndex((step) => (step < steps.length - 1 ? step + 1 : step));
    }
  }, [explainerId, isLastPage, onFinished, steps.length]);

  useEffect(() => {
    const recordTutorialBegun = () => {
      hasGoogleAnalytics && sendGAEvent('event', 'tutorial_begin', { tutorial_id: explainerId });
    };

    const timeoutId = setTimeout(recordTutorialBegun, 500);
    return () => clearTimeout(timeoutId);
  }, [explainerId]);

  const shortcuts = React.useMemo((): GlobalShortcutItem[] => [
    [ShortcutKeyName.Left, false, false, false, handlePrevPage],
    [ShortcutKeyName.Right, false, false, false, handleNextPage],
  ], [handleNextPage, handlePrevPage]);
  useGlobalShortcuts(shortcuts);

  const isSmallerScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        flex: 1,
        mx: 'auto',
        width: { xs: '92%', sm: '86%' },
        maxWidth: '820px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        gap: 2,
      }}
    >
      <Typography
        level="h1"
        component="h1"
        sx={{
          fontSize: isMobile ? '2rem' : '2.5rem',
          fontWeight: 'md',
          textAlign: 'center',
          whiteSpace: 'balance',
        }}
      >
        {activeStep?.titlePrefix}{' '}
        {!!activeStep?.titleSquircle && <AgiSquircleIcon inverted sx={{ color: 'white', fontSize: isMobile ? '1.55rem' : '2.04rem', borderRadius: 'md' }} />}
        {!!activeStep?.titleSquircle && '-'}
        {!!activeStep?.titleSpark && (
          <Box
            component="span"
            sx={{
              fontWeight: 'lg',
              color: 'neutral.softColor',
              animation: `${animationTextShadowLimey} 5s infinite`,
            }}
          >
            {activeStep.titleSpark}
          </Box>
        )}
        {activeStep?.titleSuffix}
      </Typography>

      {!!activeStep?.mdContent && (
        <Box
          sx={{
            minHeight: '24rem',
            backgroundColor: 'background.popup',
            borderRadius: 'lg',
            boxShadow: '0 60px 32px -60px rgb(var(--joy-palette-primary-darkChannel) / 0.14)',
            mb: 2,
            px: { xs: 1, md: 2 },
            py: 2,
            ['.markdown-body img']: {
              '--color-canvas-default': 'transparent!important',
            },
          }}
        >
          <BlocksRenderer
            text={activeStep.mdContent}
            fromRole="assistant"
            contentScaling="md"
            fitScreen={isMobile}
            renderTextAsMarkdown
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="plain"
          color={colorButtons}
          disabled={stepIndex === 0}
          onClick={handlePrevPage}
          startDecorator={<ArrowBackRoundedIcon />}
          sx={buttonBaseSx}
        >
          Previous
        </Button>
        <Button
          variant="solid"
          color={colorButtons}
          onClick={handleNextPage}
          endDecorator={isLastPage ? <ChatBeamIcon /> : <ArrowForwardRoundedIcon />}
          sx={cn(buttonNextSx, { [stepClasses.active]: isLastPage })}
        >
          {isLastPage ? 'Start' : 'Next'}
        </Button>
      </Box>

      {!noStepper && (
        <AllStepsStepper
          steps={steps}
          activeIndex={stepIndex}
          isMobile={isSmallerScreen}
          onStepClicked={setStepIndex}
        />
      )}

      {footer}
    </Box>
  );
}
