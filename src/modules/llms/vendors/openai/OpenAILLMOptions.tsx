import * as React from 'react';
import { IconButton, Tooltip } from '@mui/joy';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { FormSliderControl } from '~/common/components/forms/FormSliderControl';
import { InlineError } from '~/common/components/InlineError';
import { DLLM, useModelsStore } from '../../store-llms';
import { LLMOptionsOpenAI } from './openai.vendor';

export function OpenAILLMOptions({ llm }: { llm: DLLM<unknown, LLMOptionsOpenAI> }) {
  const { id: llmId, maxOutputTokens, options } = llm;
  const { llmResponseTokens, llmTemperature } = options;
  const { updateLLMOptions } = useModelsStore();
  const [overheat, setOverheat] = React.useState(llmTemperature > 1);

  const showOverheatButton = overheat || llmTemperature >= 1;

  const normalizeOpenAIOptions = (partialOptions?: Partial<LLMOptionsOpenAI>) => ({
    llmRef: 'unknown_id',
    llmTemperature: FALLBACK_LLM_TEMPERATURE,
    llmResponseTokens: FALLBACK_LLM_RESPONSE_TOKENS,
    ...partialOptions,
  });

  const handleOverheatToggle = React.useCallback(() => {
    if (overheat && llmTemperature > 1) {
      updateLLMOptions(llmId, { llmTemperature: 1 });
    }
    setOverheat(!overheat);
  }, [llmId, llmTemperature, overheat, updateLLMOptions]);

  return (
    <>
      <FormSliderControl
        key="temperature"
        title="Temperature"
        aria-label="Model Temperature"
        description={llmTemperature < 0.33 ? 'More strict' : llmTemperature > 1 ? 'Extra hot ♨️' : llmTemperature > 0.67 ? 'Larger freedom' : 'Creativity'}
        min={0}
        max={overheat ? 2 : 1}
        step={0.1}
        defaultValue={0.5}
        valueLabelDisplay="on"
        value={llmTemperature}
        disabled={!overheat}
        onChange={(value) => updateLLMOptions(llmId, { llmTemperature: value })}
        endAdornment={
          showOverheatButton && (
            <Tooltip title={overheat ? 'Disable LLM Overheating' : 'Increase Max LLM Temperature to 2'} sx={{ p: 1 }}>
              <IconButton
                variant={overheat ? 'soft' : 'plain'}
                color={overheat ? 'danger' : 'neutral'}
                onClick={handleOverheatToggle}
                aria-label="Toggle LLM Overheating"
                sx={{ ml: 2 }}
              >
                <LocalFireDepartmentIcon />
              </IconButton>
            </Tooltip>
          )
        }
      />

      {llmResponseTokens !== null && maxOutputTokens !== null ? (
        <FormSliderControl
          key="output-tokens"
          title="Output Tokens"
          aria-label="Model Max Tokens"
          min={256}
          max={maxOutputTokens}
          step={256}
          defaultValue={1024}
          valueLabelDisplay="on"
          value={llmResponseTokens}
          onChange={(value) => updateLLMOptions(llmId, { llmResponseTokens: value })}
        />
      ) : (
        <InlineError
          key="output-tokens-error"
          error="Max Output Tokens: Token computations are disabled because this model does not declare the context window size."
          aria-describedby={`error-${llmId}-output-tokens`}
        />
      )}
    </>
  );
}
