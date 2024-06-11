import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import type { DLLMId } from '~/modules/llms/store-llms';
import type { FFactoryId } from './gather/instructions/beam.gather.factories';

interface BeamConfigSnapshot {
  id: string;
  name: string;
  rayLlmIds: DLLMId[];
  gatherFactoryId?: FFactoryId | null;
  gatherLlmId?: DLLMId | null;
}

interface ModuleBeamState {
  presets: BeamConfigSnapshot[];
  lastConfig: BeamConfigSnapshot | null;
  cardScrolling: boolean;
  scatterShowLettering: boolean;
  scatterShowPrevMessages: boolean;
  gatherAutoStartAfterScatter: boolean;
  gatherShowAllPrompts: boolean;
}

interface ModuleBeamActions {
  addPreset: (name: string, rayLlmIds: DLLMId[], gatherLlmId: DLLMId | null, gatherFactoryId: FFactoryId | null) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  updateLastConfig: (update: Partial<BeamConfigSnapshot>) => void;
  deleteLastConfig: () => void;
  toggleCardScrolling: () => void;
  toggleScatterShowLettering: () => void;
  toggleScatterShowPrevMessages: () => void;
  toggleGatherAutoStartAfterScatter: () => void;
  toggleGatherShowAllPrompts: () => void;
}

const useModuleBeamStore = create<ModuleBeamState & ModuleBeamActions>()(
  persist(
    (set, get) => ({
      presets: [],
      lastConfig: null,
      cardScrolling: false,
      scatterShowLettering: false,
      scatterShowPrevMessages: false,
      gatherShowAllPrompts: false,
      gatherAutoStartAfterScatter: false,

      addPreset: (name, rayLlmIds, gatherLlmId, gatherFactoryId) =>
        set(state => ({
          presets: [...state.presets, { id: uuidv4(), name, rayLlmIds, gatherLlmId, gatherFactoryId }],
        })),

      deletePreset: (id) =>
        set(state => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        })),

      renamePreset: (id, name) =>
        set(state => ({
          presets: state.presets.map((preset) => (preset.id === id ? { ...preset, name } : preset)),
        })),

      updateLastConfig: (update) =>
        set(state => ({
          lastConfig: !state.lastConfig
            ? { id: 'current', name: '', rayLlmIds: [], ...update }
            : { ...state.lastConfig, ...update },
        })),

      deleteLastConfig: () => set({ lastConfig: null }),

      toggleCardScrolling: () =>
        set(state => ({ cardScrolling: !state.cardScrolling })),

      toggleScatterShowLettering: () =>
        set(state => ({ scatterShowLettering: !state.scatterShowLettering })),

      toggleScatterShowPrevMessages: () =>
        set(state => ({ scatterShowPrevMessages: !state.scatterShowPrevMessages })),

      toggleGatherAutoStartAfterScatter: () =>
        set(state => ({ gatherAutoStartAfterScatter: !state.gatherAutoStartAfterScatter })),

      toggleGatherShowAllPrompts: () =>
        set(state => ({ gatherShowAllPrompts: !state.gatherShowAllPrompts })),
    }),
    {
      name: 'app-module-beam',
      version: 1,
      migrate: (state: any, fromVersion: number): ModuleBeamState => {
        if (state && fromVersion === 0 && !state.presets)
          return { ...state, presets: state.scatterPresets || [] };
        return state;
      },
    }
  )
);

export const getBeamCardScrolling = () => useModuleBeamStore(state => state.cardScrolling);
export const useBeamCardScrolling = () => useModuleBeamStore(state => state.cardScrolling);
export const useBeamScatterShowLettering = () => useModuleBeamStore(state => state.scatterShowLettering);
export const updateBeamLastConfig = (update: Partial<BeamConfigSnapshot>) =>
  useModuleBeamStore.getState().updateLastConfig(update);
