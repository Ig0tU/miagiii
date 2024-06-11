import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Stack,
  Textarea,
  Typography,
} from '@mui/joy';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { lineHeightTextareaMd } from '~/common/app.theme';
import type { SimplePersonaProvenance } from '../store-app-personas';

const MIN_CHARS = 100;

interface FromTextProps {
  isCreating: boolean;
  onCreate: (text: string, provenance: SimplePersonaProvenance) => void;
}

export const FromText: React.FC<FromTextProps> = (props) => {
  const [text, setText] = React.useState('');
  const [helperText, setHelperText] = React.useState('');

  const handleCreateFromText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length >= MIN_CHARS) {
      props.onCreate(text, { type: 'text' });
    } else {
      setHelperText(`Minimum characters required: ${MIN_CHARS}`);
    }
  };

  return (
    <Stack spacing={3}>
      <FormControl>
        <InputLabel>
          <Typography level='title-md' startDecorator={<TextFieldsIcon />}>
            <b>Text</b> -&gt; Persona
          </Typography>
        </InputLabel>
        <Textarea
          required
          variant='outlined'
          minRows={4}
          maxRows={8}
          placeholder='Paste your text (e.g. tweets, social media, etc.) here...'
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setHelperText('');
          }}
          sx={{
            backgroundColor: 'background.level1',
            '&:focus-within': {
              backgroundColor: 'background.popup',
            },
            lineHeight: lineHeightTextareaMd,
            mb: 1.5,
          }}
        />
        <FormHelperText error={helperText.length > 0}>{helperText}</FormHelperText>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          type='submit'
          variant='solid'
          disabled={props.isCreating || text.length < MIN_CHARS}
          sx={{ minWidth: 140 }}
          onClick={handleCreateFromText}
        >
          Create
        </Button>
        <Typography level='body-sm'>
          {text.length.toLocaleString()}
        </Typography>
      </Box>
    </Stack>
  );
};
