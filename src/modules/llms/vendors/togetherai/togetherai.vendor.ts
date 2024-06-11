import { TogetherIcon } from '~/common/components/icons/vendors/TogetherIcon';

import { LLMOptionsOpenAI, ModelVendorOpenAI } from '../openai/openai.vendor';
import { OpenAILLMOptions } from '../openai/OpenAILLMOptions';
import { TogetherAISourceSetup } from './TogetherAISourceSetup';

export interface SourceSetupTogetherAI {
  togetherKey: string;
  togetherHost: string;
  togetherFreeTrial: boolean;
}

export const ModelVendorTogetherAI: IModelVendor<SourceSetupTogetherAI, any, LLMOptionsOpenAI> = {
  id: 'togetherai',
  name: 'Together AI',
  rank: 17,
  location: 'cloud',
  instanceLimit: 1,
  hasBackendCapKey: 'hasLlmTogetherAI',

  // components
  Icon: TogetherIcon,
  SourceSetupComponent: TogetherAISourceSetup,
  LLMOptionsComponent: OpenAILLMOptions,

  // functions
  initializeSetup(): SourceSetupTogetherAI {
    return {
      togetherKey: '',
      togetherHost: 'https://api.together.xyz',
      togetherFreeTrial: false,
    };
  },
  validateSetup(setup: SourceSetupTogetherAI) {
    return setup.togetherKey?.length >= 64;
  },
  getTransportAccess(partialSetup: Partial<SourceSetupTogetherAI>) {
    if (!partialSetup) {
      throw new Error('Missing partialSetup');
    }

    return {
      dialect: 'togetherai',
      oaiKey: partialSetup?.togetherKey || '',
      oaiOrg: '',
      oaiHost: partialSetup?.togetherHost || '',
      heliKey: '',
      moderationCheck: false,
    };
  },

  getRateLimitDelay(_llm: any, partialSetup: Partial<SourceSetupTogetherAI>) {
    const now = Date.now();
    const elapsed = now - (partialSetup.nextGenerationTs || 0);
    const wait = partialSetup?.togetherFreeTrial
      ? 1000 + 50 /* 1 seconds for free call, plus some safety margin */
      : 50;

    if (elapsed < wait) {
      const delay = wait - elapsed;
      partialSetup.nextGenerationTs = now + delay;
      return delay;
    } else {
      partialSetup.nextGenerationTs = now;
      return 0;
    }
  },

  // OpenAI transport ('togetherai' dialect in 'access')
  rpcUpdateModelsOrThrow: ModelVendorOpenAI.rpcUpdateModelsOrThrow,
  rpcChatGenerateOrThrow: ModelVendorOpenAI.rpcChatGenerateOrThrow,
  streamingChatGenerateOrThrow: ModelVendorOpenAI.streamingChatGenerateOrThrow,

  // rate limit timestamp
  nextGenerationTs: 0,
};
