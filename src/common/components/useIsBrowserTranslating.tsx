import * as React from 'react';
import { Alert, IconButton } from '@mui/joy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useUICounter } from '~/common/state/store-ui';

type UseIsBrowserTranslatingReturnType = [boolean, () => void];

export function useIsBrowserTranslating(timeout: number = 5000): UseIsBrowserTranslatingReturnType {
  // state
  const [isTranslating, setIsTranslating] = React.useState(false);

  React.useEffect(() => {
    const htmlElementMutationCallback: MutationCallback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        // only look for class attribute changes
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'class')
          continue;

        const target = mutation.target as HTMLElement;
        const isTranslatingChrome = target.classList?.contains('translated-ltr') || target.classList?.contains('translated-rtl');
        setIsTranslating(isTranslatingChrome);
        break;
      }
    };

    // Start observing the <html> element for only attribute changes to 'class'
    const observer = new MutationObserver(htmlElementMutationCallback);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return [isTranslating, () => setIsTranslating(false)];
}

type UseBrowserTranslationWarningReturnType = React.ReactElement | null;

export function useBrowserTranslationWarning(): UseBrowserTranslationWarningReturnType {
  // state
  const [hideWarning, setHideWarning] = React.useState(false);

  // external state
  const [isTranslating, setIsTranslating] = useIsBrowserTranslating();
  const { novel: lessThanFive, touch: touchUICounter } = useUICounter<{ novel: number, touch: number }>('acknowledge-translation-warning', { novel: 5, touch: 0 });

  const showWarning = isTranslating && !hideWarning && lessThanFive;

  const touch = React.useCallback(() => {
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      touchUICounter.touch();
    } else {
      touchUICounter.novel();
    }
  }, [touchUICounter]);

  return React.useMemo(() => showWarning ? (
    <Alert
      key="translation-warning"
      variant='outlined' color='warning'
      startDecorator={<WarningRoundedIcon />}
      endDecorator={
        <IconButton color='warning' sx={{ ml: 1 }}>
          <CloseRoundedIcon title="Dismiss" onClick={() => {
            setHideWarning(true);
            touch();
          }} />
        </IconButton>
      }
      onTransitionClose={() => setIsTranslating(false)}
    >
      <div dangerouslySetInnerHTML={{ __html: 'This page is being translated by your browser. It is recommended to turn OFF translation as it may cause issues, such as &quot;<span style="color: red;">a client-side exception has occurred</span>&quot;.' }} />
    </Alert>
  ) : null, [showWarning, touch]);
}
