import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

import { useAppStateStore } from '~/common/state/store-appstate';

// update this variable every time you want to broadcast a new version to clients
export const incrementalNewsVersion: number = 16.1;

interface NewsState {
  lastSeenNewsVersion: number;
}

export const useAppNewsStateStore = create<NewsState>()(
  persist(
    (set) => ({
      lastSeenNewsVersion: 0,
    }),
    {
      name: 'app-news',
    },
  ),
);

function useAppState() {
  const appStateStore = useAppStateStore();
  const appState = useAppStateStore.getState();
  return { appStateStore, appState };
}

function useAppNewsState() {
  const appNewsStateStore = useAppNewsStateStore();
  const appNewsState = useAppNewsStateStore.getState();
  return { appNewsStateStore, appNewsState };
}

export function shallRedirectToNews(): boolean {
  const { appState } = useAppState();
  const { appNewsState } = useAppNewsState();
  const isNewsOutdated = (appNewsState.lastSeenNewsVersion || 0) < incrementalNewsVersion;
  return isNewsOutdated && appState.usageCount > 2;
}

export function markNewsAsSeen() {
  useAppNewsStateStore.setState({ lastSeenNewsVersion: incrementalNewsVersion });
}
