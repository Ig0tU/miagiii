import * as React from 'react';
import { ActileItem, ActileProvider } from './ActileProvider';
import { ActilePopup } from './ActilePopup';

type UseActileManagerProps = {
  providers: ActileProvider[];
  anchorRef: React.RefObject<HTMLElement>;
};

type UseActileManagerState = {
  popupOpen: boolean;
  provider: ActileProvider | null;
  title: string;
  items: ActileItem[];
  activeSearchString: string;
  activeItemIndex: number;
};

type ActileInterceptTextChangeProps = (trailingText: string) => boolean;

type ActileInterceptKeydownProps = (event: React.KeyboardEvent<HTMLTextAreaElement>) => boolean;

export const useActileManager = ({ providers, anchorRef }: UseActileManagerProps): {
  actileComponent: JSX.Element | null;
  actileInterceptKeydown: ActileInterceptKeydownProps;
  actileInterceptTextChange: ActileInterceptTextChangeProps;
} => {
  // state
  const [state, setState] = React.useState<UseActileManagerState>({
    popupOpen: false,
    provider: null,
    title: '',
    items: [],
    activeSearchString: '',
    activeItemIndex: 0,
  });

  // derived state
  const { popupOpen, provider, title, items, activeSearchString, activeItemIndex } = state;
  const activeItems = React.useMemo(() => {
    const search = activeSearchString.trim().toLowerCase();
    return items.filter((item) => item.label?.toLowerCase().startsWith(search));
  }, [items, activeSearchString]);
  const activeItem = activeItemIndex >= 0 && activeItemIndex < activeItems.length ? activeItems[activeItemIndex] : null;

  // methods
  const handleClose = React.useCallback(() => {
    setState({ ...state, popupOpen: false, provider: null, title: '', items: [], activeSearchString: '', activeItemIndex: 0 });
  }, [state]);

  const handlePopupItemClicked = React.useCallback((item: ActileItem) => {
    provider?.onItemSelect(item);
    handleClose();
  }, [handleClose, provider]);

  const handleEnterKey = React.useCallback(() => {
    activeItem && handlePopupItemClicked(activeItem);
  }, [activeItem, handlePopupItemClicked]);

  const handleBackspaceKey = React.useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Backspace' && activeSearchString === '') {
      event.preventDefault();
      handleClose();
    }
  }, [activeSearchString, handleClose]);

  const fetchItems = React.useCallback(async (provider: ActileProvider) => {
    try {
      const { title, searchPrefix, items } = await provider.fetchItems();
      return { title, searchPrefix, items };
    } catch (error) {
      console.error('Failed to fetch popup items:', error);
      handleClose();
    }
  }, [handleClose]);

  const actileInterceptTextChange = React.useCallback(
    (trailingText: string): boolean => {
      for (const provider of providers) {
        if (provider.fastCheckTriggerText(trailingText)) {
          fetchItems(provider).then(({ title, searchPrefix, items }) => {
            if (items.length) {
              setState({
                ...state,
                popupOpen: true,
                provider,
                title,
                items,
                activeSearchString: searchPrefix,
              });
            }
          });
          return true;
        }
      }
      return false;
    },
    [providers, state, fetchItems]
  );

  const actileInterceptKeydown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
      if (popupOpen) {
        const { key, currentTarget, ctrlKey, metaKey } = event;

        if (key === 'Escape' || key === 'ArrowLeft') {
          event.preventDefault();
          handleClose();
        } else if (key === 'ArrowUp') {
          event.preventDefault();
          setState({
            ...state,
            activeItemIndex:
              activeItemIndex > 0 ? activeItemIndex - 1 : activeItems.length - 1,
          });
        } else if (key === 'ArrowDown') {
          event.preventDefault();
          setState({
            ...state,
            activeItemIndex:
              activeItemIndex < activeItems.length - 1 ? activeItemIndex + 1 : 0,
          });
        } else if (
          key === 'Enter' ||
          key === 'ArrowRight' ||
          key === 'Tab' ||
          (key === ' ' && activeItems.length === 1)
        ) {
          event.preventDefault();
          handleEnterKey();
        } else if (key === 'Backspace') {
          handleBackspaceKey(event);
        } else if (key.length === 1 && !ctrlKey && !metaKey) {
          setState({
            ...state,
            activeSearchString: activeSearchString + key,
            activeItemIndex: 0,
          });
        }
        return true;
      }

      const trailingText = (currentTarget.value || '') + key;
      return actileInterceptTextChange(trailingText);
    },
    [
      popupOpen,
      state,
      activeItems.length,
      handleClose,
      handleEnterKey,
      handleBackspaceKey,
      actileInterceptTextChange,
    ]
  );

  // render
  const actileComponent = React.useMemo(() => {
    return !popupOpen ? null : (
      <ActilePopup
        anchorEl={anchorRef.current}
        onClose={handleClose}
        title={title}
        items={activeItems}
        activeItemIndex={activeItemIndex}
        activePrefixLength={activeSearchString.length}
        onItemClick={handlePopupItemClicked}
      />
    );
  }, [activeItemIndex, activeItems, activeSearchString.length, anchorRef, handleClose, handlePopupItemClicked, popupOpen, title]);

  return {
    actileComponent,
    actileInterceptKeydown,
    actileInterceptTextChange,
  };
};
