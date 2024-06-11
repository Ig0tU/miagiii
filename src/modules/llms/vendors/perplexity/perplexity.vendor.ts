import { PerplexityIcon } from '~/common/components/icons/vendors/PerplexityIcon';
import { IModelVendor } from '../IModelVendor';
import { OpenAIAccessSchema } from '../../server/openai/openai.router';
import { LLMOptionsOpenAI, ModelVendorOpenAI } from '../openai/openai.vendor';
import { OpenAILLMOptions } from '../openai/OpenAILLMOptions';
import { PerplexitySourceSetup } from './PerplexitySourceSetup';

export interface SourceSetupPerplexity {
  perplexityKey: string;
}

export const ModelVendorPerplexity: IModelVendor<SourceSetupPerplexity, OpenAIAccessSchema, LLMOptionsOpenAI> = {
  id: 'perplexity',
  name: 'Perplexity',
  rank: 18,
  location: 'cloud',
  instanceLimit: 1,
  hasBackendCapKey: 'hasLlmPerplexity',

  // Components
  Icon: PerplexityIcon,
  SourceSetupComponent: PerplexitySourceSetup,
  LLMOptionsComponent: OpenAILLMOptions,

  // Functions
  initializeSetup(): SourceSetupPerplexity {
    return {
      perplexityKey: '',
    };
  },

  validateSetup(setup: SourceSetupPerplexity): setup is NonNullable<SourceSetupPerplexity> {
    return setup.perplexityKey?.length >= 50;
  },

  getTransportAccess(partialSetup: Partial<SourceSetupPerplexity>): OpenAIAccessSchema {
    return {
      dialect: 'perplexity',
      oaiKey: partialSetup?.perplexityKey || '',
      oaiOrg: '',
      oaiHost: '',
      heliKey: '',
      moderationCheck: false,
    };
  },

  // OpenAI transport ('perplexity' dialect in 'access')
  ...ModelVendorOpenAI,
};
