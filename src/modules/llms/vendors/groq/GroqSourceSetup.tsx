import * as React from 'react';
import { Typography, Link as MuiLink } from '@mui/joy';

import { AlreadySet, FormInputKey, InlineError, Link, SetupFormRefetchButton } from '~/common/components';
import { DModelSourceId, useSourceSetup, useLlmUpdateModels } from '../../store-llms';
import { ModelVendorGroq } from './groq.vendor';

const GROQ_REG_LINK = 'https://console.groq.com/keys';

interface GroqSourceSetupProps {
  sourceId: DModelSourceId;
}

export function GroqSourceSetup(props: GroqSourceSetupProps) {
  const {
    source,
    access,
    sourceSetupValid,
    hasNoBackendCap: needsUserKey,
    updateSetup,
  } = useSourceSetup(props.sourceId, ModelVendorGroq);

  const { oaiKey: groqKey } = access;

  const shallFetchSucceed = !needsUserKey || (!!groqKey && sourceSetupValid);
  const showKeyError = !!groqKey && !sourceSetupValid;

  const {
    isFetching,
    refetch,
    isError,
    error: refetchError,
  } = useLlmUpdateModels(shallFetchSucceed, source);

  const isErrorExists = isError && refetchError;

  return (
    <>
      <FormInputKey
        autoCompleteId="groq-key"
        label="Groq API Key"
        rightLabel={
          <>
            {needsUserKey ? (
              !groqKey ? (
                <MuiLink
                  level="body-sm"
                  href={GROQ_REG_LINK}
                  target="_blank"
                >
                  API keys
                </MuiLink>
              ) : (
                <AlreadySet />
              )
            ) : null}
          </>
        }
        value={groqKey}
        onChange={(value) => updateSetup({ groqKey: value })}
        required={needsUserKey}
        isError={showKeyError}
        placeholder="..."
      />

      <Typography level="body-sm">
        Groq offers inference as a service for a variety of models. See the{' '}
        <MuiLink href="https://console.groq.com/docs/quickstart" target="_blank">
          Groq
        </MuiLink>{' '}
        documentation for more information.
      </Typography>

      <SetupFormRefetchButton
        refetch={refetch}
        disabled={!shallFetchSucceed || isFetching}
        loading={isFetching}
        error={isErrorExists}
      />

      {isErrorExists && <InlineError error={refetchError} />}
    </>
  );
}
