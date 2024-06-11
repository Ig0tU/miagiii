import * as React from 'react';

import { Alert, Typography } from '@mui/joy';

import { FormRadioControl, FormRadioOption } from '~/common/components/forms/FormRadioControl';
import { useCapabilityTextToImage } from '~/common/components/useCapabilities';

type T2ISettingsProps = {
  mayWork: boolean;
  providers: { id: string; label: string; configured: boolean }[];
  activeProviderId: string | null;
  setActiveProviderId: (id: string | null) => void;
};

export function T2ISettings({ mayWork, providers, activeProviderId, setActiveProviderId }: T2ISettingsProps) {
  // derived state
  const providerOptions = React.useMemo(() => {
    const options: FormRadioOption<string>[] = [];
    providers.forEach((provider) => {
      options.push({
        key: provider.id,
        label: provider.label,
        value: provider.id,
        disabled: !provider.configured,
      });
    });
    return options;
  }, [providers]);

  return (
    <>
      {!mayWork ? (
        <Alert variant="soft" sx={{ mb: 2 }}>
          <Typography level="body2">
            There are no configured services for text-to-image generation. Please configure one service, such as an OpenAI LLM service, or the Prodia service below.
          </Typography>
        </Alert>
      ) : (
        <FormRadioControl
          title="Text-to-Image"
          description="Active Service"
          tooltip="Select the service to use for text-to-image generation."
          disabled={!mayWork}
          options={providerOptions}
          value={activeProviderId}
          defaultValue={activeProviderId}
          required
          onChange={setActiveProviderId}
        />
      )}
    </>
  );
}
