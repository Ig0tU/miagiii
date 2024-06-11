import React, { useState } from 'react';
import {
  Alert,
  FormInputKey,
  FormSwitchControl,
  FormTextField,
  InlineError,
  Link,
  SetupFormRefetchButton,
} from '~/common/components';
import { AlreadySet, useToggleableBoolean } from '~/common/components/AlreadySet';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { useSourceSetup } from '../useSourceSetup';
import { DModelSourceId, ModelVendorOpenAI } from './openai.vendor';

const HELICONE_OPENAI_HOST = 'oai.hconeai.com';

export function OpenAISourceSetup({ sourceId }: { sourceId: DModelSourceId }) {
  const [advanced, setAdvanced] = useToggleableBoolean(!!sourceId?.includes('-'));
  const {
    source,
    sourceHasLLMs,
    access,
    hasNoBackendCap: needsUserKey,
    updateSetup,
  } = useSourceSetup(sourceId, ModelVendorOpenAI);

  const { oaiKey, oaiOrg, oaiHost, heliKey, moderationCheck } = access;

  const [keyValid, setKeyValid] = useState(true);
  const keyError = (needsUserKey || oaiKey) && !keyValid;
  const shallFetchSucceed = oaiKey ? keyValid : !needsUserKey;

  const { isFetching, refetch, isError, error } = useLlmUpdateModels(
    !sourceHasLLMs && shallFetchSucceed,
    source
  );

  const handleKeyChange = (value: string) => {
    updateSetup({ oaiHost, oaiOrg, heliKey, moderationCheck, oaiKey: value });

    // Perform key validation here
    // setKeyValid(isValidOpenAIApiKey(value));
  };

  return (
    <>
      <FormInputKey
        autoCompleteId="openai-key"
        label="API Key"
        rightLabel={
          <>
            {needsUserKey ? (
              <>
                <Link
                  level="body-sm"
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                >
                  create key
                </Link>
                <Link
                  level="body-sm"
                  href="https://openai.com/waitlist/gpt-4-api"
                  target="_blank"
                >
                  request access to GPT-4
                </Link>
              </>
            ) : (
              <AlreadySet />
            )}
            {oaiKey && keyValid && (
              <Link level="body-sm" href="https://platform.openai.com/account/usage" target="_blank">
                check usage
              </Link>
            )}
          </>
        }
        value={oaiKey || ''}
        onChange={handleKeyChange}
        required={needsUserKey}
        isError={keyError}
        placeholder="sk-..."
      />

      {advanced && (
        <>
          <FormTextField
            autoCompleteId="openai-host"
            title="API Endpoint"
            tooltip={`An OpenAI compatible endpoint to be used in place of 'api.openai.com'.\n\nCould be used for Helicone, Cloudflare, or other OpenAI compatible cloud or local services.\n\nExamples:\n - ${HELICONE_OPENAI_HOST}\n - localhost:1234`}
            description={
              <>
                <Link level="body-sm" href="https://www.helicone.ai" target="_blank">
                  Helicone
                </Link>
                ,{' '}
                <Link
                  level="body-sm"
                  href="https://developers.cloudflare.com/ai-gateway/"
                  target="_blank"
                >
                  Cloudflare
                </Link>
              </>
            }
            placeholder={`e.g., ${HELICONE_OPENAI_HOST}, https://gateway.ai.cloudflare.com/v1/<ACCOUNT_TAG>/<GATEWAY_URL_SLUG>/openai, etc..`}
            value={oaiHost || ''}
            onChange={(text) =>
              updateSetup({ oaiKey, oaiOrg, heliKey, moderationCheck, oaiHost: text })
            }
          />

          <FormTextField
            autoCompleteId="openai-org"
            title="Organization ID"
            description={
              <Link
                level="body-sm"
                href={`${Brand.URIs.OpenRepo}/issues/63`}
                target="_blank"
              >
                What is this
              </Link>
            }
            placeholder="Optional, for enterprise users"
            value={oaiOrg || ''}
            onChange={(text) =>
              updateSetup({ oaiKey, oaiHost, heliKey, moderationCheck, oaiOrg: text })
            }
          />

          <FormTextField
            autoCompleteId="openai-helicone-key"
            title="Helicone Key"
            description={
              <>
                Generate <Link level="body-sm" href="https://www.helicone.ai/keys" target="_blank">
                  here
                </Link>
              </>
            }
            placeholder="sk-..."
            value={heliKey || ''}
            onChange={(text) =>
              updateSetup({ oaiHost, oaiOrg, oaiKey, moderationCheck, heliKey: text })
            }
          />

          {heliKey && (
            <Alert
              variant="soft"
              color={oaiHost?.includes(HELICONE_OPENAI_HOST) ? 'success' : 'warning'}
            >
              Advanced: You set the Helicone key. {!oaiHost?.includes(HELICONE_OPENAI_HOST)
              ? `But you also need to set the OpenAI Host to ${HELICONE_OPENAI_HOST} to use Helicone.`
              : 'OpenAI traffic will now be routed through Helicone.'}
            </Alert>
          )}

          <FormSwitchControl
            title="Moderation"
            on="Enabled"
            fullWidth
            description={
              <>
                <Link
                  level="body-sm"
                  href="https://platform.openai.com/docs/guides/moderation/moderation"
                  target="_blank"
                >
                  Overview
                </Link>
                ,{' '}
                <Link
                  level="body-sm"
                  href="https://openai.com/policies/usage-policies"
                  target="_blank"
                >
                  policy
                </Link>
              </>
            }
            checked={moderationCheck || false}
            onChange={(on) =>
              updateSetup({ oaiHost, oaiOrg, heliKey, oaiKey, moderationCheck: on })
            }
          />
        </>
      )}

      <SetupFormRefetchButton
        refetch={refetch}
        disabled={isFetching}
        error={isError}
        loading={isFetching}
        advanced={advanced}
      />

      {isError && <InlineError error={error} />}
    </>
  );
}
