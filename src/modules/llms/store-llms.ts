import { create, persist } from 'zustand';

type DLLMId = string;
type DModelSourceId = string;
type ModelVendorId = string;
type SourceSetupOpenRouter = { oaiKey: string };

type DModelInterfaceV1 =
  | 'oai-chat'
  | 'oai-chat-json'
  | 'oai-chat-vision'
  | 'oai-chat-fn'
  | 'oai-complete';

interface DLLMOptions {
  llmRef?: string;
  // add other options here
}

interface DModelSourceSetup<T = unknown> {
  id: DModelSourceId;
  label: string;
  vId: ModelVendorId;
  setup: T;
}

interface DLLM<TSourceSetup = unknown, TOptions = DLLMOptions> {
  id: DLLMId;
  label: string;
  created: number;
  updated?: number;
  description: string;
  hidden: boolean;
  isEdited?: boolean;
  contextTokens: number | null;
  maxOutputTokens: number | null;
  trainingDataCutoff?: string;
  interfaces: DModelInterfaceV1[];
  benchmark?: { cbaElo?: number; cbaMmlu?: number };
  pricing?: { chatIn?: number; chatOut?: number };
  tmpIsFree?: boolean;
  tmpIsVision?: boolean;
  sId: DModelSourceId;
  _source: DModelSource<TSourceSetup>;
  options: TOptions;
}

interface ModelsStore {
  llms: DLLM[];
  sources: DModelSource[];
  chatLLMId: DLLMId | null;
  fastLLMId: DLLMId | null;
  funcLLMId: DLLMId | null;

  setLLMs: (
    llms: DLLM[],
    sourceId: DModelSourceId,
    deleteExpiredVendorLlms: boolean,
    keepUserEdits: boolean
  ) => void;
  removeLLM: (id: DLLMId) => void;
  updateLLM: (id: DLLMId, partial: Partial<DLLM>) => void;
  updateLLMOptions: <TOptions extends DLLMOptions>(
    id: DLLMId,
    partialOptions: Partial<TOptions>
  ) => void;
  addSource: (source: DModelSource<any>) => void;
  removeSource: (id: DModelSourceId) => void;
  updateSourceSetup: <T>(id: DModelSourceId, partialSetup: Partial<T>) => void;
  setChatLLMId: (id: DLLMId | null) => void;
  setFastLLMId: (id: DLLMId | null) => void;
  setFuncLLMId: (id: DLLMId | null) => void;
  setOpenRoutersKey: (key: string) => void;
}

interface DModelSource<T = unknown> {
  id: DModelSourceId;
  label: string;
  vId: ModelVendorId;
  setup: T;
}

const useModelsStore = create<ModelsStore>()(
  persist(
    (set) => ({
      // ...
    }),
    {
      name: 'app-models',
      version: 2,
      migrate: (state: any, fromVersion: number) => {
        // ...
      },
      partialize: (state) => ({
        // ...
      }),
      onRehydrateStorage: () => (state) => {
        // ...
      },
    }
  )
);

// ...

export type { DLLM, DModelSource, DModelSourceId, DLLMId, ModelVendorId, SourceSetupOpenRouter, DModelInterfaceV1 };
export {
  useModelsStore,
  getChatLLMId,
  findLLMOrThrow,
  findSourceOrThrow,
  getDiverseTopLlmIds,
  useChatLLM,
  getLLMsDebugInfo,
};
