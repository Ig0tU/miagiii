import * as React from 'react';
import {
  FormControl,
  FormHelperText,
  Option,
  Select,
  useTheme,
} from '@mui/joy';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import Link from 'next/link';
import { AlreadySet } from '~/common/components/AlreadySet';
import { FormInputKey } from '~/common/components/forms/FormInputKey';
import { FormLabelStart } from '~/common/components/forms/FormLabelStart';
import { InlineError } from '~/common/components/InlineError';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';
import { DModelSourceId, useLlmUpdateModels, useSourceSetup } from '../../llm.client.hooks';
import { GeminiBlockSafetyLevel } from '../../server/gemini/gemini.wiretypes';
import { ModelVendorGemini } from './gemini.vendor';

const GEMINI_API_KEY_LINK = 'https://makersuite.google.com/app/apikey';

const SAFETY_OPTIONS: { value: GeminiBlockSafetyLevel; label: string }[] = [
  { value: 'HARM_BLOCK_THRESHOLD_UNSPECIFIED', label: 'Default' },
  { value: 'BLOCK_LOW_AND_ABOVE', label: 'Low and above' },
  { value: 'BLOCK_MEDIUM_AND_ABOVE', label: 'Medium and above' },
  { value: 'BLOCK_ONLY_HIGH', label: 'Only high' },
  { value: 'BLOCK_NONE', label: 'None' },
];

export function GeminiSourceSetup(props: { sourceId: DModelSourceId }) {
  const theme = useTheme();

  // external state
  const {
    source,
    sourceHasLLMs,
    sourceSetupValid,
    access,
    hasNoBackendCap: needsUserKey,
    updateSetup,
  } = useSourceSetup(props.sourceId, ModelVendorGemini);

  // derived state
  const { geminiKey, minSafetyLevel = 'BLOCK_MEDIUM_AND_ABOVE' } = access;

  const shallFetchSucceed = !needsUserKey || (!!geminiKey && sourceSetupValid);
  const showKeyError = !!geminiKey && !sourceSetupValid;

  // fetch models
  const { isFetching, refetch, isError, error } = useLlmUpdateModels(
    !sourceHasLLMs && shallFetchSucceed,
    source
  );

  return (
    <>
      <FormInputKey
        autoCompleteId="gemini-key"
        label="Gemini API Key"
        rightLabel={
          <>
            {needsUserKey
              ? !geminiKey && (
                  <Link
                    level="body-sm"
                    href={GEMINI_API_KEY_LINK}
                    target="_blank"
                  >
                    request Key
                  </Link>
                )
              : <AlreadySet />}
          </>
        }
        value={geminiKey}
        onChange={(value) => updateSetup({ geminiKey: value.trim() })}
        required={needsUserKey}
        isError={showKeyError}
        placeholder="..."
      />

      <FormControl
        orientation="horizontal"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            '& > *': {
              width: '100%',
            },
          },
        }}
      >
        <FormLabelStart
          title="Safety Settings"
          description="Threshold"
        />
        <Select
          variant="outlined"
          value={minSafetyLevel}
          onChange={(_event, value) => value && updateSetup({ minSafetyLevel: value })}
          startDecorator={<HealthAndSafetyIcon sx={{ display: { xs: 'none', sm: 'inherit' } }} />}
          endDecorator={<HealthAndSafetyIcon sx={{ display: { xs: 'inherit', sm: 'none' } }} />}
          aria-label="Safety Settings"
          slotProps={{
            root: { sx: { width: '100%' } },
            indicator: { sx: { opacity: 0.5 } },
            button: { sx: { whiteSpace: 'inherit' } },
          }}
        >
          {SAFETY_OPTIONS.map((option) => (
            <Option
              key={`gemini-safety-${option.value}`}
              value={option.value}
              sx={{ whiteSpace: 'inherit' }}
            >
              {option.label}
            </Option>
          ))}
        </Select>
      </FormControl>

      <FormHelperText sx={{ display: 'block' }}>
        Gemini has{' '}
        <Link href="https://ai.google.dev/docs/safety_setting_gemini" target="_blank" noLinkStyle>
          adjustable safety settings
        </Link>{' '}
        on four categories: Harassment, Hate speech, Sexually explicit, and Dangerous content, in
        addition to non-adjustable built-in filters. By default, the model will block content with{' '}
        <em>medium and above</em> probability of being unsafe.
      </FormHelperText>

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

// Add missing export statement
export function useSourceSetup(
  sourceId: DModelSourceId,
  vendor: ModelVendorGemini
) {
  // ...
}
