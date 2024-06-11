import * as React from 'react';
import {
  Button,
  Typography,
  Link as MuiLink,
  FormHelperInfo as MuiFormHelperInfo,
} from '@mui/joy';
import { AlreadySet, FormInputKey, InlineError, Link, SetupFormRefetchButton } from '~/common/components';
import { DModelSourceId, useSourceSetup } from '../useSourceSetup';
import { isValidOpenRouterKey, ModelVendorOpenRouter } from './openrouter.vendor';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { getCallbackUrl } from '~/common/app.routes';

interface OpenRouterSourceSetupProps {
  sourceId: DModelSourceId;
}

export function OpenRouterSourceSetup(props: OpenRouterSourceSetupProps) {
  const { source, sourceHasLLMs, access, hasNoBackendCap: needsUserKey, updateSetup } =
    useSourceSetup(props.sourceId, ModelVendorOpenRouter);

  const { oaiKey } = access;

  const keyValid = isValidOpenRouterKey(oaiKey);
  const keyError = !keyValid && !!oaiKey;
  const shallFetchSucceed = oaiKey ? keyValid : !needsUserKey;

  const { isFetching, refetch, isError, error } = useLlmUpdateModels(
    !sourceHasLLMs && shallFetchSucceed,
    source,
    true
  );

  const handleOpenRouterLogin = () => {
    const callbackUrl = getCallbackUrl('openrouter');
    const oauthUrl = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(callbackUrl)}`;
    window.open(oauthUrl, '_self');
  };

  return (
    <>
      <Typography level="body-sm">
        <MuiLink href="https://openrouter.ai/keys" target="_blank">
          OpenRouter
        </MuiLink>{' '}
        is an independent service granting access to exclusive models such as GPT-4 32k, Claude, and more.{' '}
        <MuiLink
          href="https://github.com/enricoros/big-agi/blob/main/docs/config-openrouter.md"
          target="_blank"
        >
          Configuration & documentation
        </MuiLink>
        .
      </Typography>

      <FormInputKey
        autoCompleteId="openrouter-key"
        label="OpenRouter API Key"
        rightLabel={
          <>
            {needsUserKey ? (
              !oaiKey ? (
                <Link level="body-sm" href="https://openrouter.ai/keys" target="_blank">
                  your keys
                </Link>
              ) : (
                <AlreadySet />
              )
            ) : (
              <MuiFormHelperInfo>Already set</MuiFormHelperInfo>
            )}
            {oaiKey && keyValid && (
              <Link level="body-sm" href="https://openrouter.ai/activity" target="_blank">
                check usage
              </Link>
            )}
          </>
        }
        value={oaiKey}
        onChange={(value) => updateSetup({ oaiKey: value })}
        required={needsUserKey}
        isError={keyError}
        placeholder="sk-or-..."
      />

      <Typography level="body-sm">
        🎁 A selection of <MuiLink href="https://openrouter.ai/docs#models" target="_blank">OpenRouter models</MuiLink>{' '}
        are made available without charge. You can get an API key by using the{' '}
        <Button
          color="neutral"
          variant={needsUserKey && !keyValid ? 'solid' : 'outlined'}
          onClick={handleOpenRouterLogin}
          endDecorator={needsUserKey && !keyValid ? '🎁' : undefined}
        >
          OpenRouter Login
        </Button>{' '}
        button below.
      </Typography>

      <SetupFormRefetchButton
        refetch={refetch}
        disabled={!shallFetchSucceed || isFetching}
        loading={isFetching}
        error={isError}
        leftButton={
          <Button
            color="neutral"
            variant={needsUserKey && !keyValid ? 'solid' : 'outlined'}
            onClick={handleOpenRouterLogin}
            endDecorator={needsUserKey && !keyValid ? '🎁' : undefined}
          >
            OpenRouter Login
          </Button>
        }
      />

      {isError && <InlineError error={error} />}
    </>
  );
}
