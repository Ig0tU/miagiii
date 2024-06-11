import * as React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  useTheme,
} from '@mui/joy';
import DoneIcon from '@mui/icons-material/Done';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyStroke from '~/common/components/KeyStroke';
import GoodTooltip from '~/common/components/GoodTooltip';
import { getBackendCapabilities } from '~/modules/backend/store-backend-capabilities';
import { DConversationId, getConversation } from '~/common/state/store-chats';
import ChatLinkExport from './link/ChatLinkExport';
import PublishExport from './publish/PublishExport';
import { downloadAllConversationsJson, downloadConversation } from './trade.client';

type ExportConfig = {
  dir: 'export';
  conversationId?: DConversationId;
  exportAll: boolean;
};

/**
 * Export Buttons and functionality
 */
const ExportChats: React.FC<{ config: ExportConfig; onClose: () => void }> = (props) => {
  // state
  const [downloadedJSONState, setDownloadedJSONState] = React.useState<
    'ok' | 'fail' | null
  >(null);
  const [downloadedMarkdownState, setDownloadedMarkdownState] = React.useState<
    'ok' | 'fail' | null
  >(null);
  const [downloadedAllState, setDownloadedAllState] = React.useState<
    'ok' | 'fail' | null
  >(null);

  // external state
  const enableSharing = getBackendCapabilities().hasDB;

  // derived state
  const { exportAll, conversationId } = props.config;
  const hasConversation = Boolean(conversationId);

  // download chats
  const handleDownloadConversationJSON = () => {
    if (!conversationId) return;
    const conversation = getConversation(conversationId);
    if (!conversation) return;
    downloadConversation(conversation, 'json')
      .then(() => setDownloadedJSONState('ok'))
      .catch(() => setDownloadedJSONState('fail'));
  };

  const handleDownloadConversationMarkdown = () => {
    if (!conversationId) return;
    const conversation = getConversation(conversationId);
    if (!conversation) return;
    downloadConversation(conversation, 'markdown')
      .then(() => setDownloadedMarkdownState('ok'))
      .catch(() => setDownloadedMarkdownState('fail'));
  };

  const handleDownloadAllConversationsJSON = () => {
    downloadAllConversationsJson()
      .then(() => setDownloadedAllState('ok'))
      .catch(() => setDownloadedAllState('fail'));
  };

  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {/* Current Chat */}
      <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-start', py: 2 }}>
        <Box sx={{ display: 'grid', gap: 1, mx: 'auto' }}>
          {exportAll && (
            <Typography level="body-sm">
              Download or share <strong>this chat</strong>:
            </Typography>
          )}
          <GoodTooltip title={<KeyStroke dark combo="Ctrl + S" />}>
            <Button
              variant="soft"
              disabled={!hasConversation}
              color={
                downloadedJSONState === 'ok'
                  ? 'success'
                  : downloadedJSONState === 'fail'
                  ? 'warning'
                  : 'primary'
              }
              endDecorator={
                downloadedJSONState === 'ok' ? <DoneIcon /> : downloadedJSONState === 'fail' ? '✘' : <FileDownloadIcon />
              }
              sx={{
                minWidth: 240,
                justifyContent: 'space-between',
                borderRadius: theme.shape.borderRadius,
              }}
              onClick={handleDownloadConversationJSON}
            >
              Download · JSON
            </Button>
          </GoodTooltip>
          <Button
            variant="soft"
            disabled={!hasConversation}
            color={
              downloadedMarkdownState === 'ok'
                ? 'success'
                : downloadedMarkdownState === 'fail'
                ? 'warning'
                : 'primary'
            }
            endDecorator={
              downloadedMarkdownState === 'ok' ? <DoneIcon /> : downloadedMarkdownState === 'fail' ? '✘' : <FileDownloadIcon />
            }
            sx={{
              minWidth: 240,
              justifyContent: 'space-between',
              borderRadius: theme.shape.borderRadius,
            }}
            onClick={handleDownloadConversationMarkdown}
          >
            Export · Markdown
          </Button>
          {enableSharing && (
            <ChatLinkExport
              conversationId={conversationId}
              enableSharing={enableSharing}
              onClose={props.onClose}
            />
          )}
          <PublishExport
            conversationId={conversationId}
            onClose={props.onClose}
          />
        </Box>
      </Grid>
      {/* All Chats */}
      {exportAll && (
        <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-start', py: 2 }}>
          <Box sx={{ display: 'grid', gap: 1, mx: 'auto' }}>
            <Typography level="body-sm">
              Backup or transfer <strong>all chats</strong>:
            </Typography>
            <Button
              variant="soft"
              color={
                downloadedAllState === 'ok'
                  ? 'success'
                  : downloadedAllState === 'fail'
                  ? 'warning'
                  : 'primary'
              }
              endDecorator={
                downloadedAllState === 'ok' ? <DoneIcon /> : downloadedAllState === 'fail' ? '✘' : <FileDownloadIcon />
              }
              sx={{
                minWidth: 240,
                justifyContent: 'space-between',
                borderRadius: theme.shape.borderRadius,
              }}
              onClick={handleDownloadAllConversationsJSON}
            >
              Download All · JSON
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ExportChats;
