import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TextToImageStore {
  activeProviderId: string | null;
  setActiveProviderId: (providerId: string | null) => void;
}

const useTextToImageStore = create<TextToImageStore>()(
  persist(
    (set) => ({
      activeProviderId: null,
      setActiveProviderId: (providerId: string | null) => set({ activeProviderId }),
    }),
    {
      name: 'app-module-t2i',
      version: 1,
    }
  )
);

// Add a helper function to easily get the active provider
useTextToImageStore.getActiveProvider = () => {
  const { activeProviderId } = useTextToImageStore.getState();
  return activeProviderId;
};

// Add a helper function to easily set the active provider
useTextToImageStore.setActiveProvider = (providerId: string | null) => {
  useTextToImageStore.setState({ activeProviderId: providerId });
};

export default useTextToImageStore;


const activeProvider = useTextToImageStore.getActiveProvider();
useTextToImageStore.setActiveProvider('newProviderId');
