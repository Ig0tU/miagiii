import * as React from 'react';
import { FormControl, FormLabel, ListItemDecorator, Option, Select } from '@mui/joy';
import FormatPaintTwoToneIcon from '@mui/icons-material/FormatPaintTwoTone';
import { OpenAIIcon } from '~/common/components/icons/vendors/OpenAIIcon';
import { hideOnMobile } from '~/common/app.theme';
import { TextToImageProvider, TextToImageProviderConfigured } from '~/common/components/useCapabilities';

type ProviderSelectProps = {
  providers: TextToImageProvider[],
  activeProviderId: string | null,
  setActiveProviderId: (providerId: string | null) => void
}

export function ProviderSelect(props: ProviderSelectProps) {
  // create the options
  const providerOptions = React.useMemo(() => {
    const options: { label: string, value: string, configured: boolean, Icon?: React.FC }[] = [];
    props.providers.forEach(provider => {
      options.push({
        label: provider.label + (provider.painter !== provider.label ? ` ${provider.painter}` : ''),
        value: provider.id,
        configured: provider.configured,
        Icon: provider.vendor === 'openai' ? OpenAIIcon : FormatPaintTwoToneIcon,
      });
    });
    return options;
  }, [props.providers]);

  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const filteredOptions = providerOptions.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <FormControl orientation='horizontal' sx={{ justifyContent: 'start', alignItems: 'center' }}>

      <FormLabel sx={hideOnMobile}>
        Service:
      </FormLabel>

      <Select
        variant='outlined'
        value={props.activeProviderId || ''}
        placeholder='Select a service'
        onChange={(_event, value) => value && props.setActiveProviderId(value)}
        startDecorator={<FormatPaintTwoToneIcon sx={{ display: { xs: 'none', sm: 'inherit' } }} />}
        sx={{
          minWidth: '12rem',
        }}
        noOptionsMessage={() => 'No options'}
        filterOption={(option, { inputValue }) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        }
        renderValue={(value) => {
          const option = providerOptions.find(option => option.value === value);
          return option ? option.label : value;
        }}
        renderOption={(props, option) => (
          <Option
            key={option.value}
            value={option.value}
            {...props}
            disabled={!option.configured}
          >
            <ListItemDecorator>
              {!!option.Icon && <option.Icon />}
            </ListItemDecorator>
            {option.label}
            {!option.configured && ' (not configured)'}
          </Option>
        )}
        PopperProps={{
          sx: {
            '& .MuiMenu-paper': {
              width: 250,
              maxHeight: 300,
              overflowY: 'auto',
            },
          },
        }}
        InputProps={{
          onChange: handleChange,
        }}
      >
        <Option value='' disabled>
          Select a service
        </Option>
        {filteredOptions.map(option => (
          <Option key={option.value} value={option.value} disabled={!option.configured}>
            <ListItemDecorator>
              {!!option.Icon && <option.Icon />}
            </ListItemDecorator>
            {option.label}
            {!option.configured && ' (not configured)'}
          </Option>
        ))}
      </Select>

    </FormControl>
  );
}
