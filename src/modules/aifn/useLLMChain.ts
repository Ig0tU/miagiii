import { DLLMId, findLLMOrThrow } from '~/modules/llms/store-llms';
import { llmStreamingChatGenerate, VChatMessageIn } from '~/modules/llms/llm.client';

type LLMChainStep = {
  name: string;
  setSystem?: string;
  addPrevAssistant?: boolean;
  addUserInput?: boolean;
  addUser?: string;
};

type ChainState = {
  steps: StepState[];
  chatHistory: VChatMessageIn[];
  progress: number;
  safeInputLength: number | null;
  overrideResponseTokens: number | null;
  input: string;
  output: string | null;
};

type StepState = {
  ref: LLMChainStep;
  output?: string;
  isComplete: boolean;
  isLast: boolean;
};

const DEBUG_CHAIN = false;

const initChainState = (llmId: DLLMId, input: string, steps: LLMChainStep[]): ChainState => {
  const llm = findLLMOrThrow(llmId);
  const overrideResponseTokens = llm.maxOutputTokens;
  const safeInputLength = llm.contextTokens && overrideResponseTokens ? Math.floor((llm.contextTokens - overrideResponseTokens) * 2) : null;

  return {
    steps: steps.map((step, i) => ({
      ref: step,
      output: undefined,
      isComplete: false,
      isLast: i === steps.length - 1,
    })),
    chatHistory: [],
    overrideResponseTokens,
    safeInputLength,
    progress: 0,
    input: input,
    output: null,
  };
};

const updateChainState = (chain: ChainState, stepIdx: number, output: string): ChainState => {
  const stepsCount = chain.steps.length;
  return {
    ...chain,
    steps: chain.steps.map((step, i) =>
      (i === stepIdx) ? {
        ...step,
        output: output,
        isComplete: true,
      } : step),
    progress: Math.round(100 * (stepIdx + 1) / stepsCount) / 100,
    output: (stepIdx === stepsCount - 1) ? output : null,
  };
};

const implodeText = (text: string, maxLength: number | null) => {
  if (!maxLength || text.length <= maxLength) return text;
  const halfLength = Math.floor(maxLength / 2);
  return `${text.substring(0, halfLength)}\n...\n${text.substring(text.length - halfLength)}`;
};

const getLLMChatInput = (chainStep: LLMChainStep, chainHistory: VChatMessageIn[]) => {
  const llmChatInput: VChatMessageIn[] = [...chainHistory];

  if (chainStep.setSystem) {
    llmChatInput.filter((msg) => msg.role !== 'system');
    llmChatInput.unshift({ role: 'system', content: chainStep.setSystem });
  }
  if (chainStep.addUserInput)
    llmChatInput.push({ role: 'user', content: implodeText(chain.input, chain.safeInputLength) });
  if (chainStep.addPrevAssistant && chainStep.addPrevAssistant && chainStep.addPrevAssistant.length > 0)
    llmChatInput.push({ role: 'assistant', content: implodeText(chain.steps[chainStep.addPrevAssistant - 1].output!, chain.safeInputLength) });
  if (chainStep.addUser)
    llmChatInput.push({ role: 'user', content: chainStep.addUser });

  return llmChatInput;
};

/**
 * React hook to manage a chain of LLM transformations.
 */
const useLLMChain = (steps: LLMChainStep[], llmId: DLLMId | undefined, chainInput: string | undefined, onSuccess?: (output: string, input: string) => void) => {
  const [chain, setChain] = React.useState<ChainState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [chainStepInterimText, setChainStepInterimText] = React.useState<string | null>(null);
  const chainAbortController = React.useRef(new AbortController());

  const abortChain = React.useCallback((reason: string) => {
    DEBUG_CHAIN && console.log('chain: abort (' + reason + ')');
    chainAbortController.current.abort(reason);
    chainAbortController.current = new AbortController();
  }, []);

  const userCancelChain = React.useCallback(() => {
    abortChain('user canceled');
    setError('Canceled');
  }, [abortChain]);

  const isChainRunning = Boolean(chain);

  const startChain = React.useCallback((inputText: string | undefined, llmId: DLLMId | undefined, steps: LLMChainStep[]) => {
    DEBUG_CHAIN && console.log('chain: restart', { textLen: inputText?.length, llmId, stepsCount: steps.length });

    abortChain('restart');

    setError(!llmId ? 'LLM not provided' : null);
    setChain((inputText && llmId) ? initChainState(llmId, inputText, steps) : null);
    setChainStepInterimText(null);

  }, [abortChain]);

  const restartChain = React.useCallback(() => {
    startChain(chainInput, llmId, steps);
  }, [chainInput, llmId, startChain, steps]);

  React.useEffect(() => {
    restartChain();
    return () => abortChain('unmount');
  }, [restartChain, abortChain]);

  React.useEffect(() => {
    if (!chain || !llmId) return;

    const stepIdx = chain.steps.findIndex((step) => !step.isComplete);
    if (stepIdx === -1) return;

    const chainStep = chain.steps[stepIdx];
    if (chainStep.output) return console.log('WARNING - Output overlap - FIXME', chainStep);

    const llmChatInput = getLLMChatInput(chainStep, chain.chatHistory);

    let stepDone = false;
    const stepAbortController = new AbortController();
    const globalToStepListener = () => stepAbortController.abort('chain aborted');
    chainAbortController.current.signal.addEventListener('abort', globalToStepListener);

    let interimText = '';
    setChainStepInterimText(null);

    llmStreamingChatGenerate(llmId, llmChatInput, null, null, stepAbortController.signal,
      ({ textSoFar }) => {
        textSoFar && setChainStepInterimText(interimText = textSoFar);
      })
      .then(() => {
        if (stepAbortController.signal.aborted) return;
        const chainState = updateChainState(chain, stepIdx, interimText);
        if (chainState.output && onSuccess)
          onSuccess(chainState.output, chainState.input);
        setChain(chainState);
      })
      .catch((err) => {
        if (!stepAbortController.signal.aborted)
          setError(`Transformation error: ${err?.message || err?.toString() || err || 'unknown'}`);
      })
      .finally(() => {
        stepDone = true;
        setChainStepInterimText(null);
      });

    return () => {
      if (!stepDone)
        stepAbortController.abort('step aborted');
      chainAbortController.current.signal.removeEventListener('abort', globalToStepListener);
    };
  }, [chain, llmId, onSuccess]);

  const isFinished = !!chain?.output;
  const isTransforming = !!chain?.steps?.length && !chain?.output && !error;
  const chainOutput = chain?.output ?? null;
  const chainProgress = chain?.progress ?? 0;
  const chainStepName = chain?.steps?.find((step) => !step.isComplete)?.ref.name ?? null;
  const chainStepInterimChars = chainStepInterimText?.length ?? null;
  const chainIntermediates = chain?.steps?.map((step) => ({ name: step.ref.name, output: step.output ?? null })).filter(i => !!i.output) ?? [];
  const chainError = error;

  return {
    isFinished,
    isTransforming,
    chainOutput,
    chainProgress,
    chainStepName,
    chainStepInterimChars,
    chainIntermediates,
    chainError,
    userCancelChain,
    restartChain,
    isChainRunning,
  };
};

export default useLLMChain;
