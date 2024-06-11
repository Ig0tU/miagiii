import * as React from 'react';
import { Alert, Link as MuiLink, Typography } from '@mui/joy';
import { FormTextField, SetupFormRefetchButton } from '~/common/components/forms';
import { InlineError } from '~/common/components/InlineError';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { useSourceSetup } from '../useSourceSetup';
import { DModelSourceId, ModelVendor } from '../../types';
import { ModelVendorOoobabooga } from './oobabooga.vendor';

export function OobaboogaSourceSetup({ sourceId }: { sourceId: DModelSourceId }) {
  const { source, sourceHasLLMs, access, updateSetup } = useSourceSetup(sourceId, ModelVendorOoobabooga);
  const { oaiHost } = access;
  const { isFetching, refetch, isError, error } = useLlmUpdateModels(false, source);

  const hasValidOaiHost = oaiHost.length >= 7;

  return (
    <>
      <Typography level='body-sm'>
        You can use a running <MuiLink href='https://github.com/oobabooga/text-generation-webui' target='_blank'>text-generation-webui</MuiLink> instance as a source for local models. Follow <MuiLink href='https://github.com/enricoros/big-agi/blob/main/docs/config-local-oobabooga.md' target='_blank'>the instructions</MuiLink> to set up the server.
      </Typography>

      <FormTextField
        autoCompleteId='oobabooga-host'
        title='API Base'
        description='Excluding /v1'
        placeholder='http://127.0.0.1:5000'
        value={oaiHost}
        onChange={text => updateSetup({ oaiHost: text })}
        disabled={isFetching}
      />

      {sourceHasLLMs && (
        <Alert variant='soft' color='warning' sx={{ display: 'block' }}>
          Success! Note: your model of choice must be loaded in the{' '}
          <MuiLink noLinkStyle href='http://127.0.0.1:7860' target='_blank'>
            Oobabooga UI
          </MuiLink>
          , as Oobabooga does not support switching models via API. Concurrent model execution is also not supported.
        </Alert>
      )}

      <SetupFormRefetchButton refetch={refetch} disabled={!hasValidOaiHost || isFetching} loading={isFetching} error={isError} />

      {isError && !isFetching && <InlineError error={error} />}
    </>
  );
}
