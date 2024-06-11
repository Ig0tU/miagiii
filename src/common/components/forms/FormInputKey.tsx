import * as React from 'react';

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
} from '@mui/joy';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export function FormInputKey({
  autoCompleteId,
  label,
  rightLabel,
  description,
  value,
  onChange,
  placeholder,
  isVisible,
  required,
  isError,
  noKey,
}: {
  autoCompleteId: string;
  label?: string;
  rightLabel?: string | React.ReactNode;
  description?: string | React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isVisible?: boolean;
  required: boolean;
  isError?: boolean;
  noKey?: boolean;
}) {
  const [internalIsVisible, setInternalIsVisible] = React.useState(!!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const endDecorator = React.useMemo(() => {
    if (!value || noKey) {
      return null;
    }
    return (
      <IconButton onClick={() => setInternalIsVisible(!internalIsVisible)} disabled={!value}>
        {internalIsVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
    );
  }, [value, noKey, internalIsVisible]);

  const acId = `input-${autoCompleteId}`;

  return (
    <FormControl
      id={acId}
      sx={{ marginTop: 2, marginBottom: 2 }}
      required={required}
      error={isError}
    >
      {label && (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <FormLabel sx={{ marginTop: 0.5, marginBottom: 0.5 }}>{label}</FormLabel>
          {rightLabel && <FormHelperText sx={{ display: 'block', marginTop: 0.5, marginBottom: 0.5 }}>
            {rightLabel}
          </FormHelperText>}
        </Box>
      )}

      <Input
        key={acId}
        name={acId}
        autoComplete="off"
        variant={required ? 'outlined' : 'soft'}
        value={value}
        onChange={handleChange}
        placeholder={required ? (placeholder ? `required: ${placeholder}` : 'required') : placeholder || '...'}
        type={(internalIsVisible || !noKey) ? 'text' : 'password'}
        required={required}
        error={isError}
        startDecorator={!noKey && <KeyIcon />}
        endDecorator={endDecorator}
        sx={{ marginTop: 1, marginBottom: 1 }}
      />

      {description && <FormHelperText sx={{ display: 'block', marginTop: 0.5, marginBottom: 0.5 }}>
        {description}
      </FormHelperText>}

    </FormControl>
  );
}
