import * as React from 'react';
import type { DLLMId } from '~/modules/llms/store-llms';
import { GlobalShortcutItem, useGlobalShortcuts } from '~/common/components/useGlobalShortcut';

type PreferencesTabType = 0 | 1 | 2 | 3 | 4; // narrowed down type for PreferencesTab

type OptimaLayoutState = {
  appDrawerContent: React.ReactNode | null;
  appBarItems: React.ReactNode | null;
  appMenuItems: React.ReactNode | null;
  showPreferencesTab: PreferencesTabType;
  showModelsSetup: boolean;
  showLlmOptions: DLLMId | null;
  showShortcuts: boolean;
  isFocusedMode: boolean;
};

const initialState: OptimaLayoutState = {
  appDrawerContent: null,
  appBarItems: null,
  appMenuItems: null,
  showPreferencesTab: 0,
  showModelsSetup: false,
  showLlmOptions: null,
  showShortcuts: false,
  isFocusedMode: false,
};

type OptimaLayoutActions = {
  setPluggableComponents: (
    appDrawerContent: React.ReactNode,
    appBarItems: React.ReactNode,
    appMenuItems: React.ReactNode,
  ) => void;

  openPreferencesTab: (tab?: PreferencesTabType) => void;
  closePreferences: () => void;

  openModelsSetup: () => void;
  closeModelsSetup: () => void;

  openLlmOptions: (id: DLLMId) => void;
  closeLlmOptions: () => void;

  openShortcuts: () => void;
  closeShortcuts: () => void;

  setIsFocusedMode: (isFocusedMode: boolean) => void;
};

const UseOptimaLayout = React.createContext<OptimaLayoutState & OptimaLayoutActions | undefined>(undefined);

export function OptimaLayoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<OptimaLayoutState>(initialState);

  const actions: OptimaLayoutActions = React.useMemo(() => ({
    setPluggableComponents: (appDrawerContent, appBarItems, appMenuItems) =>
      setState(state => ({ ...state, appDrawerContent, appBarItems, appMenuItems })),

    openPreferencesTab: tab => setState(state => ({ ...state, showPreferencesTab: tab || 1 })),
    closePreferences: () => setState(state => ({ ...state, showPreferencesTab: 0 })),

    openModelsSetup: () => setState(state => ({ ...state, showModelsSetup: true })),
    closeModelsSetup: () => setState(state => ({ ...state, showModelsSetup: false })),

    openLlmOptions: id => setState(state => ({ ...state, showLlmOptions: id })),
    closeLlmOptions: () => setState(state => ({ ...state, showLlmOptions: null })),

    openShortcuts: () => setState(state => ({ ...state, showShortcuts: true })),
    closeShortcuts: () => setState(state => ({ ...state, showShortcuts: false })),

    setIsFocusedMode: isFocusedMode => setState(state => ({ ...state, isFocusedMode })),
  }), []);

  const shortcuts = React.useMemo<GlobalShortcutItem[]>(
    () => [
      ['?', true, true, false, actions.openShortcuts],
      ['m', true, true, false, actions.openModelsSetup],
      ['p', true, true, false, actions.openPreferencesTab],
    ],
    [actions],
  );

  useGlobalShortcuts(shortcuts);

  return (
    <UseOptimaLayout.Provider value={{ ...state, ...actions }}>
      {children}
    </UseOptimaLayout.Provider>
  );
}

export const useOptimaLayout = (): OptimaLayoutState & OptimaLayoutActions => {
  const context = React.useContext(UseOptimaLayout);
  if (!context) {
    throw new Error('useOptimaLayout must be used within an OptimaLayoutProvider');
  }
  return context;
};

export const usePluggableOptimaLayout = (
  appDrawerContent: React.ReactNode,
  appBarItems: React.ReactNode,
  appMenuItems: React.ReactNode,
  debugCallerName: string,
) => {
  const { setPluggableComponents } = useOptimaLayout();

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && DEBUG_OPTIMA_LAYOUT_PLUGGING) {
      console.log(' +PLUG layout', debugCallerName);
    }
    setPluggableComponents(appDrawerContent, appBarItems, appMenuItems);

    return () => {
      if (process.env.NODE_ENV === 'development' && DEBUG_OPTIMA_LAYOUT_PLUGGING) {
        console.log(' -UNplug layout', debugCallerName);
      }
      setPluggableComponents(null, null, null);
    };
  }, [appBarItems, appMenuItems, appDrawerContent, debugCallerName, setPluggableComponents]);
};
