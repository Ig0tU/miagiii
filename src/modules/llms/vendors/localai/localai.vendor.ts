import { LocalAIIcon } from '~/common/components/icons/vendors/LocalAIIcon';
import type { IModelVendor } from '../IModelVendor';
import type { OpenAIAccessSchema } from '../../server/openai/openai.router';
import { LLMOptionsOpenAI, ModelVendorOpenAI } from '../openai/openai.vendor';
import { OpenAILLMOptions } from '../openai/OpenAILLMOptions';
import { LocalAISourceSetup } from './LocalAISourceSetup';

export interface SourceSetupLocalAI {
  localAIHost: string;
  localAIKey: string;
}

export const ModelVendorLocalAI: IModelVendor<SourceSetupLocalAI, OpenAIAccessSchema, LLMOptionsOpenAI> = {
  id: 'localai',
  name: 'LocalAI',
  rank: 20,
  location: 'local',
  instanceLimit: 4,
  hasBackendCapKey: 'hasLlmLocalAIHost',
  hasBackendCapFn: (backendCapabilities) =>
    backendCapabilities.hasLlmLocalAIHost || backendCapabilities.hasLlmLocalAIKey,
  Icon: LocalAIIcon,
  SourceSetupComponent: LocalAISourceSetup,
  LLMOptionsComponent: OpenAILLMOptions,
  initializeSetup: () => ({
    localAIHost: '',
    localAIKey: '',
  }),
  getTransportAccess: (partialSetup) => ({
    dialect: 'localai',
    oaiKey: partialSetup?.localAIKey || '',
    oaiOrg: '',
    oaiHost: partialSetup?.localAIHost || '',
    heliKey: '',
    moderationCheck: false,
  }),
  rpcUpdateModelsOrThrow: ModelVendorOpenAI.rpcUpdateModelsOrThrow,
  rpcChatGenerateOrThrow: ModelVendorOpenAI.rpcChatGenerateOrThrow,
  streamingChatGenerateOrThrow: ModelVendorOpenAI.streamingChatGenerateOrThrow,
};

// Add this helper function to handle OpenAI-compatible hosts and keys
export const isOpenAICompatible = (host: string, apiKey: string): boolean => {
  // Implement your logic to check if the host and API key are OpenAI-compatible
};

// Add this type to make the intent clearer
type LocalAIBackendCapabilities = {
  hasLlmLocalAIHost: boolean;
  hasLlmLocalAIKey: boolean;
};

// Initialize the LocalAIBackendCapabilities
export const localAIBackendCapabilities: LocalAIBackendCapabilities = {
  hasLlmLocalAIHost: false,
  hasLlmLocalAIKey: false,
};
