import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UXLabsStore {
  labsAttachScreenCapture: boolean;
  setLabsAttachScreenCapture: (value: boolean) => void;

  labsCameraDesktop: boolean;
  setLabsCameraDesktop: (value: boolean) => void;

  labsChatBarAlt: false | 'title';
  setLabsChatBarAlt: (value: false | 'title') => void;

  labsHighPerformance: boolean;
  setLabsHighPerformance: (value: boolean) => void;

  labsShowCost: boolean;
  setLabsShowCost: (value: boolean) => void;
}

const useUXLabsStore = create<UXLabsStore>()(
  persist(
    (set) => ({
      labsAttachScreenCapture: false,
      setLabsAttachScreenCapture: (value: boolean) => set({ labsAttachScreenCapture: value }),

      labsCameraDesktop: false,
      setLabsCameraDesktop: (value: boolean) => set({ labsCameraDesktop: value }),

      labsChatBarAlt: false,
      setLabsChatBarAlt: (value: false | 'title') => set({ labsChatBarAlt: value }),

      labsHighPerformance: false,
      setLabsHighPerformance: (value: boolean) => set({ labsHighPerformance: value }),

      labsShowCost: true,
      setLabsShowCost: (value: boolean) => set({ labsShowCost: value }),
    }),
    {
      name: 'app-ux-labs',
      // only allow these properties to be persisted
      allowList: ['labsAttachScreenCapture', 'labsCameraDesktop', 'labsChatBarAlt', 'labsHighPerformance', 'labsShowCost'],
    },
  )
);

export function getUXLabsHighPerformance() {
  return useUXLabsStore.getState().labsHighPerformance;
}

export type UseUXLabsStore = typeof useUXLabsStore;
export type GetUXLabsHighPerformance = typeof getUXLabsHighPerformance;
