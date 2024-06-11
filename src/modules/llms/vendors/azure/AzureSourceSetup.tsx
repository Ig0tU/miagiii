import * as React from 'react';
import { AlreadySet } from '~/common/components/AlreadySet';
import { FormInputKey } from '~/common/components/forms/FormInputKey';
import { FormTextField } from '~/common/components/forms/FormTextField';
import { InlineError } from '~/common/components/InlineError';
import { Link } from '~/common/components/Link';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';
import { asValidURL } from '~/common/util/urlUtils';
import { DModelSourceId } from '../../store-llms';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { useSourceSetup } from '../useSourceSetup';
import { isValidAzureApiKey, ModelVendorAzure } from './azure.vendor';

type AzureSourceSetupProps = {
  sourceId: DModelSourceId;
};

export function AzureSourceSetup(props: AzureSourceSetupProps) {
  const {
    source,
    sourceHasLLMs,
    access,
    needsUserKey,
    updateSetup,
  } = useSourceSetup(props.sourceId, ModelVendorAzure);

  const { azureKey, azureEndpoint } = access;

  const keyValid = isValidAzureApiKey(azureKey);
  const keyError = !!azureKey && !keyValid;
  const hostValid = !!asValidURL(azureEndpoint);
  const hostError = !!azureEndpoint && !hostValid;
  const shallFetchSucceed = azureKey ? keyValid : !needsUserKey;

  const { isFetching, refetch, isError, error } = useLlmUpdateModels(
    !sourceHasLLMs && shallFetchSucceed,
    source
  );

  return (
    <>
      <FormTextField
        autoCompleteId="azure-endpoint"
        title="Azure Endpoint"
        description={
          <Link
            level="body-sm"
            href="https://github.com/enricoros/big-agi/blob/main/docs/config-azure-openai.md"
            target="_blank"
            alt="Azure OpenAI configuration"
          >
            configuration
          </Link>
        }
        placeholder="https://your-resource-name.openai.azure.com/"
        isError={hostError}
        value={azureEndpoint}
        onChange={(text) => updateSetup({ azureEndpoint: text })}
      />

      <FormInputKey
        autoCompleteId="azure-key"
        label="Azure Key"
        rightLabel={
          <>
            {needsUserKey ? (
              !azureKey ? (
                <Link
                  level="body-sm"
                  href="https://azure.microsoft.com/en-us/products/ai-services/openai-service"
                  target="_blank"
                  title="Request Azure Key"
                >
                  request Key
                </Link>
              ) : (
                <AlreadySet />
              )
            ) : null}
          </>
        }
        value={azureKey}
        onChange={(value) => updateSetup({ azureKey: value })}
        required={needsUserKey}
        isError={keyError}
        placeholder="..."
      />

      <SetupFormRefetchButton
        refetch={refetch}
        disabled={!shallFetchSucceed || isFetching}
        loading={isFetching}
        error={isError}
      />

      {isError && <InlineError error={error} />}
    </>
  );
}
