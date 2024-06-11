import * as React from 'react';
import { Typography, Link as MuiLink } from '@mui/joy';

import { AlreadySet, FormInputKey, InlineError, Link as CustomLink, SetupFormRefetchButton } from '~/common/components';
import { DModelSourceId, useSourceSetup, useLlmUpdateModels } from '../../store-llms';
import { ModelVendorGroq } from './groq.vendor';

const GROQ_REG_LINK = 'https://console.groq.com/keys';

interface GroqSourceSetupProps {
  sourceId: DModelSourceId;
}

interface GroqSourceSetupState {
  groqKey: string | null;
  hasNoBackendCap: boolean;
  sourceSetupValid: boolean;
  isFetching: boolean;
  isError: boolean;
  refetchError: unknown;
}

function GroqSourceSetup(props: GroqSourceSetupProps) {
  const { sourceId } = props;
  const {
    source,
    access,
    sourceSetupValid,
    hasNoBackendCap,
    updateSetup,
  } = useSourceSetup(sourceId, ModelVendorGroq);
  const { oaiKey: groqKey } = access;

  const {
    isFetching,
    refetch,
    isError,
    error: refetchError,
  } = useLlmUpdateModels(sourceSetupValid && hasNoBackendCap, source);

  const state: GroqSourceSetupState = {
    groqKey,
    hasNoBackendCap,
    sourceSetupValid,
    isFetching,
    isError,
    refetchError,
  };

  return (
    <GroqSourceSetupForm {...state} onGroqKeyChange={updateSetup} />
  );
}

interface GroqSourceSetupFormProps extends GroqSourceSetupState {
  onGroqKeyChange: (value: { groqKey: string }) => void;
}

function GroqSourceSetupForm(props: GroqSourceSetupFormProps) {
  const {
    groqKey,
    hasNoBackendCap,
    sourceSetupValid,
    isFetching,
    isError,
    refetchError,
    onGroqKeyChange,
  } = props;

  const shallFetchSucceed = !hasNoBackendCap || (!!groqKey && sourceSetupValid);
  const showKeyError = !!groqKey && !sourceSetupValid;

  return (
    <>
      <FormInputKey
        autoCompleteId="groq-key"
        label="Groq API Key"
        rightLabel={
          <>
            {hasNoBackendCap ? (
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
        value={groqKey || ''}
        onChange={(value) => onGroqKeyChange({ groqKey: value })}
        required={hasNoBackendCap}
        isError={showKeyError}
        placeholder="..."
      />

      <Typography level="body-sm">
        Groq offers inference as a service for a variety of models. See the{' '}
        <CustomLink href="https://console.groq.com/docs/quickstart" target="_blank">
          Groq
        </CustomLink>{' '}
        documentation for more information.
      </Typography>

      <SetupFormRefetchButton
        refetch={refetch}
        disabled={!shallFetchSucceed || isFetching}
        loading={isFetching}
        error={isError}
      />

      {isError && <InlineError error={refetchError} />}
    </>
  );
}

export { GroqSourceSetup };
