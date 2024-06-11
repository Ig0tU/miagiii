import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

interface AppState {
  usageCount: number;
}

interface NewsState {
  lastSeenNewsVersion: number;
  incrementalNewsVersion: number;
}

const useAppStateStore = create<AppState>()(
  persist(
    (set) => ({
      usageCount: 0,
    }),
    {
      name: 'app-state',
    },
  ),
);

const useAppNewsStateStore = create<NewsState>()(
  persist(
    (set) => ({
      lastSeenNewsVersion: 0,
      incrementalNewsVersion: 16.1,
    }),
    {
      name: 'app-news',
    },
  ),
);

function useAppState() {
  return useStore.getState();
}

function useAppNewsState() {
  const { lastSeenNewsVersion, incrementalNewsVersion } = useStore.getState();
  return { lastSeenNewsVersion, incrementalNewsVersion };
}

export function shallRedirectToNews(): boolean {
  const { usageCount } = useAppState();
  const { lastSeenNewsVersion, incrementalNewsVersion } = useAppNewsState();
  const isNewsOutdated = lastSeenNewsVersion < incrementalNewsVersion;
  return isNewsOutdated && usageCount > 2;
}

export function markNewsAsSeen() {
  useAppNewsStateStore.setState({ lastSeenNewsVersion: useAppNewsStateStore.getState().incrementalNewsVersion });
}
