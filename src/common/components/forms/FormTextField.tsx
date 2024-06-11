import * as React from 'react';
import { FormControl, Input, InputLabel, FormHelperText } from '@mui/joy';
import { FormLabelStart } from './FormLabelStart';

/**
 * Text form field (e.g. enter a host)
 */
export function FormTextField(props: {
  autoCompleteId: string,
  title: string | React.ReactNode,
  description?: string | React.ReactNode,
  tooltip?: string | React.ReactNode,
  placeholder?: string,
  isError?: boolean,
  disabled?: boolean,
  value?: string,
  onChange: (text: string) => void,
}) {
  const acId = `text-${props.autoCompleteId}`;
  const inputProps = {
    required: true,
    'aria-required': true,
    autoCapitalize: 'off',
    autoCorrect: 'off',
  };
  return (
    <FormControl
      id={acId}
      component="fieldset"
      variant="outlined"
      orientation='horizontal'
      disabled={props.disabled}
      sx={{
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <InputLabel htmlFor={acId} shrink>
        {props.title}
      </InputLabel>
      <Input
        key={acId}
        name={acId}
        autoComplete='off'
        variant='outlined'
        placeholder={props.placeholder}
        error={props.isError}
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
        sx={{ flexGrow: 1, minWidth: 200 }}
        inputProps={inputProps}
        endDecorator={props.isError ? <span role="alert">!</span> : null}
        aria-invalid={props.isError ? 'true' : 'false'}
        aria-describedby={`${acId}-description ${acId}-tooltip`}
      />
      <FormHelperText id={`${acId}-description`}>
        {props.description}
      </FormHelperText>
      <FormHelperText id={`${acId}-tooltip`}>
        {props.tooltip}
      </FormHelperText>
    </FormControl>
  );
}
