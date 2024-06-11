import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import axios from 'axios';

export interface BackendCapabilities {
  hasDB: boolean;
  hasBrowsing: boolean;
  hasGoogleCustomSearch: boolean;
  hasImagingProdia: boolean;
  hasLlmAnthropic: boolean;
  hasLlmAzureOpenAI: boolean;
  hasLlmGemini: boolean;
  hasLlmGroq: boolean;
  hasLlmLocalAIHost: boolean;
  hasLlmLocalAIKey: boolean;
  hasLlmMistral: boolean;
  hasLlmOllama: boolean;
  hasLlmOpenAI: boolean;
  hasLlmOpenRouter: boolean;
  hasLlmPerplexity: boolean;
  hasLlmTogetherAI: boolean;
  hasVoiceElevenLabs: boolean;
  llmConfigHash: string;
}

interface BackendStore extends BackendCapabilities {
  loadedCapabilities: boolean;
  setCapabilities: (capabilities: Partial<BackendCapabilities>) => void;
}

const useBackendCapabilitiesStore = create<BackendStore>()(
  (set) => ({
    // capabilities
    hasDB: false,
    hasBrowsing: false,
    hasGoogleCustomSearch: false,
    hasImagingProdia: false,
    hasLlmAnthropic: false,
    hasLlmAzureOpenAI: false,
    hasLlmGemini: false,
    hasLlmGroq: false,
    hasLlmLocalAIHost: false,
    hasLlmLocalAIKey: false,
    hasLlmMistral: false,
    hasLlmOllama: false,
    hasLlmOpenAI: false,
    hasLlmOpenRouter: false,
    hasLlmPerplexity: false,
    hasLlmTogetherAI: false,
    hasVoiceElevenLabs: false,
    llmConfigHash: '',

    loadedCapabilities: false,
    setCapabilities: (capabilities: Partial<BackendCapabilities>) =>
      set({
        loadedCapabilities: true,
        ...Object.assign({}, capabilities),
      }),
  }),
);

export function useKnowledgeOfBackendCaps(): [boolean, (capabilities: Partial<BackendCapabilities>) => void] {
  const [loadedCapabilities, setCapabilities] = useBackendCapabilitiesStore(useShallow(state => [state.loadedCapabilities, state.setCapabilities]));

  return [loadedCapabilities, setCapabilities];
}

export function getBackendCapabilities(): BackendCapabilities {
  return useBackendCapabilitiesStore.getState();
}

// Load the backend capabilities from an API endpoint
export function loadBackendCapabilities(): Promise<void> {
  return new Promise((resolve) => {
    axios.get('/api/backend-capabilities')
      .then((response) => {
        const capabilities = response.data as BackendCapabilities;
        useBackendCapabilitiesStore.getState().setCapabilities(capabilities);
        resolve();
      })
      .catch((error) => {
        console.error('Error loading backend capabilities:', error);
        resolve();
      });
  });
}
