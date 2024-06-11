import * as React from 'react';
import { fileSave } from 'browser-fs-access';
import { Box, Button, Card, CardContent, Typography } from '@mui/joy';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Brand,
  ROUTE_APP_CHAT,
  ROUTE_INDEX,
} from '~/common/app.config';
import {
  AppPlaceholder,
  getBackendCapabilities,
  getLLMsDebugInfo,
  getPlantUmlServerUrl,
  withLayout,
} from '~/common';
import {
  useAppNewsStateStore,
  useAppStateStore,
  useCapabilityBrowserSpeechRecognition,
  useCapabilityElevenLabs,
  useCapabilityTextToImage,
  useChatStore,
  useFolderStore,
  useUXLabsStore,
} from '~/common/state/store';
import {
  clientHostName,
  isChromeDesktop,
  isFirefox,
  isIPhoneUser,
  isMacUser,
  isPwa,
  isVercelFromFrontend,
} from '~/common/util/pwaUtils';
import {
  getGA4MeasurementId,
  prettyTimestampForFilenames,
  supportsClipboardRead,
  supportsScreenCapture,
} from '~/common/util';

interface DebugCardProps {
  title: string;
  children: React.ReactNode;
}

function DebugCard({ title, children }: DebugCardProps) {
  return (
    <Box>
      <Typography level="title-lg">
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function prettifyJsonString(
  jsonString: string,
  deleteChars: number,
  removeDoubleQuotes: boolean,
  removeTrailComma: boolean
): string {
  return jsonString.split('\n').map(l => {
    if (deleteChars > 0)
      l = l.substring(deleteChars);
    if (removeDoubleQuotes)
      l = l.replaceAll('\"', '');
    if (removeTrailComma && l.endsWith(','))
      l = l.substring(0, l.length - 1);
    return l;
  }).join('\n').trim();
}

interface DebugJsonCardProps {
  title: string;
  data: any;
}

function DebugJsonCard({ title, data }: DebugJsonCardProps) {
  return (
    <DebugCard title={title}>
      <Typography level="body-sm" sx={{ whiteSpace: 'break-spaces', fontFamily: 'code', fontSize: { xs: 'xs' } }}>
        {prettifyJsonString(JSON.stringify(data, null, 2), 2, true, true)}
      </Typography>
    </DebugCard>
  );
}

interface AppDebugProps {}

function AppDebug(props: AppDebugProps) {
  // state
  const [saved, setSaved] = React.useState(false);

  // external state
  const backendCaps = getBackendCapabilities();
  const chatsCount = useChatStore.getState().conversations?.length;
  const uxLabsExperiments = Object.entries(useUXLabsStore.getState()).filter(([_, v]) => v === true).map(([k, _]) => k).join(', ');
  const { folders, enableFolders } = useFolderStore.getState();
  const { lastSeenNewsVersion } = useAppNewsStateStore.getState();
  const { usageCount } = useAppStateStore.getState();

  // derived state
  const cClient = {
    // isBrowser: isBrowser(),
    isChromeDesktop: isChromeDesktop(),
    isFirefox: isFirefox(),
    isIPhone: isIPhoneUser(),
    isMac: isMacUser(),
    isPWA: isPwa(),
    supportsClipboardPaste: supportsClipboardRead,
    supportsScreenCapture: supportsScreenCapture(),
  };
  const cProduct = {
    capabilities: {
      mic: useCapabilityBrowserSpeechRecognition(),
      elevenLabs: useCapabilityElevenLabs(),
      textToImage: useCapabilityTextToImage(),
    },
    models: getLLMsDebugInfo(),
    state: {
      chatsCount,
      foldersCount: folders?.length,
      foldersEnabled: enableFolders,
      newsCurrent: incrementalNewsVersion,
      newsSeen: lastSeenNewsVersion,
      labsActive: uxLabsExperiments,
      reloads: usageCount,
    },
  };
  const cBackend = {
    configuration: backendCaps,
    deployment: {
      home: Brand.URIs.Home,
      hostName: clientHostName(),
      isVercelFromFrontend,
      measurementId: getGA4MeasurementId(),
      plantUmlServerUrl: getPlantUmlServerUrl(),
      routeIndex: ROUTE_INDEX,
      routeChat: ROUTE_APP_CHAT,
    },
  };

  const handleDownload = async () => {
    try {
      const blob = new Blob([JSON.stringify({ client: cClient, agi: cProduct, backend: cBackend }, null, 2)], { type: 'application/json' });
      await fileSave(blob, {
        fileName: `big-agi_debug_${prettyTimestampForFilenames()}.json`,
        extensions: ['.json'],
      });
      setSaved(true);
    } catch (e) {
      console.error('Error saving debug.json', e);
    }
  };

  return (
    <AppPlaceholder title={`${Brand.Title.Common} Debug`}>
      <Box sx={{ display: 'grid', gap: 3, my: 3 }}>
        <Button
          variant={saved ? 'soft' : 'outlined'} color={saved ? 'success' : 'neutral'}
          onClick={handleDownload}
          endDecorator={<DownloadIcon />}
          sx={{
            backgroundColor: saved ? undefined : 'background.surface',
            boxShadow: 'sm',
            placeSelf: 'start',
            minWidth: 260,
          }}
        >
          Download debug JSON
        </Button>
        <Card>
          <CardContent sx={{ display: 'grid', gap: 3 }}>
            <DebugJsonCard title='Client' data={cClient} />
            <DebugJsonCard title='AGI' data={cProduct} />
            <DebugJsonCard title='Backend' data={cBackend} />
          </CardContent>
        </Card>
      </Box>
    </AppPlaceholder>
  );
}

export default function DebugPage() {
  return withLayout({ type: 'plain' }, <AppDebug />);
}
