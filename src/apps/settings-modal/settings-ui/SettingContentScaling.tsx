import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { FormControl, IconButton, Step, Stepper } from '@mui/joy';

import type { ContentScaling } from '~/common/app.theme';
import { FormLabelStart } from '~/common/components/forms/FormLabelStart';
import { useUIPreferencesStore } from '~/common/state/store-ui';

type SettingContentScalingProps = {
  noLabel?: boolean;
};

export function SettingContentScaling(props: SettingContentScalingProps) {
  // external state
  const [contentScaling, setContentScaling] = useUIPreferencesStore(
    (state) => [state.contentScaling, state.setContentScaling],
    shallow
  );

  // handle setting content scaling
  const handleContentScalingChange = (scaling: ContentScaling) => {
    setContentScaling(scaling);
  };

  // map scaling values to their display names
  const scalingDisplayValues = {
    xs: 'Dense',
    sm: 'Default',
    md: 'Comfy',
  };

  // get the display value for the current scaling
  const currentScalingDisplayValue = scalingDisplayValues[contentScaling];

  // get the active step indicator style
  const activeStepIndicatorStyles = {
    borderRadius: '50%',
    width: '1rem',
    height: '1rem',
    '--variant-borderWidth': '2px',
    borderColor: 'primary.solidBg',
  };

  return (
    <FormControl
      orientation="horizontal"
      sx={{
        justifyContent: props.noLabel ? 'center' : 'space-between',
      }}
    >
      {!props.noLabel && (
        <FormLabelStart
          title="Text Size"
          description={currentScalingDisplayValue}
        />
      )}
      <Stepper
        sx={{
          maxWidth: 160,
          width: '100%',
          '--Step-connectorThickness': '2px',
          '--StepIndicator-size': '2rem',
        }}
      >
        {(['xs', 'sm', 'md'] as ContentScaling[]).map((sizeKey) => {
          const isActive = sizeKey === contentScaling;

          return (
            <Step
              key={sizeKey}
              onClick={() => handleContentScalingChange(sizeKey)}
              indicator={
                <IconButton
                  size="sm"
                  variant={isActive ? 'outlined' : 'soft'}
                  color={isActive ? 'primary' : 'neutral'}
                  sx={isActive ? activeStepIndicatorStyles : {}}
                >
                  Aa
                </IconButton>
              }
            />
          );
        })}
      </Stepper>
    </FormControl>
  );
}
