import * as React from 'react';

import { FormControl, Switch } from '@mui/joy';

import { FormLabelStart } from './FormLabelStart';

/**
 * Switch control
 */
export function FormSwitchControl(props: {
  title: string | React.ReactNode,
  description?: string | React.ReactNode,
  on?: string,
  off?: string,
  fullWidth?: boolean,
  checked: boolean,
  onChange: (on: boolean) => void,
  disabled?: boolean,
  defaultChecked?: boolean,
  name?: string,
  required?: boolean,
}) {
  return (
    <FormControl
      orientation='horizontal'
      disabled={props.disabled}
      sx={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem' }}
      required={props.required}
      name={props.name}
    >
      <FormLabelStart title={props.title} description={props.description} fontSize='1rem' />
      <Switch
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        onChange={event => props.onChange(event.target.checked)}
        endDecorator={props.checked ? props.on || 'On' : props.off || 'Off'}
        sx={props.fullWidth ? { flexGrow: 1 } : undefined}
        slotProps={{ endDecorator: { sx: { minWidth: 26 } } }}
        color='primary'
        size='medium'
      />
    </FormControl>
  );
}
