import * as React from 'react';
import { type StoreApi, useStore } from 'zustand';

import type { BeamStore } from './store-beam-vanilla';

export type BeamStoreApi = Readonly<StoreApi<BeamStore>>;

export const useBeamStore = <T, >(beamStore: BeamStoreApi, selector: (store: BeamStore) => T): T =>
  useStore(beamStore, selector);

export const useAreBeamsOpen = (beamStores: (BeamStoreApi | null)[]): boolean[] => {
  const [opens, setOpens] = React.useState<boolean[]>(() => Array.from({ length: beamStores.length }, () => false));
  const previousBeamStoresRef = React.useRef(beamStores);

  const setOpensMemoized = React.useCallback((index: number, isOpen: boolean) => {
    setOpens((opens) => {
      const nextOpens = [...opens];
      nextOpens[index] = isOpen;
      return nextOpens;
    });
  }, []);

  React.useEffect(() => {
    if (previousBeamStoresRef.current === beamStores) {
      return;
    }

    previousBeamStoresRef.current = beamStores;

    const unsubscribes = beamStores.map((beamStore, index) => {
      if (!beamStore) {
        return () => {
        }; // Explicitly return a no-op function for clarity
      }
      let previousState = beamStore.getState();
      return beamStore.subscribe((state: BeamStore) => {
        if (state.isOpen !== previousState.isOpen) {
          setOpensMemoized(index, state.isOpen);
        }
        previousState = state;
      });
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [beamStores, setOpensMemoized]);

  return opens;
};
