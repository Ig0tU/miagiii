import * as React from 'react';
import { Button, Link as MuiLink, Typography } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getChatShowSystemMessages } from '../../../apps/chat/store-app-chat';
import { Brand } from '~/common/app.config';
import { ConfirmationModal } from '~/common/components/ConfirmationModal';
import { DConversationId, getConversation } from '~/common/state/store-chats';
import { Link } from '~/common/components/Link';
import { apiAsyncNode } from '~/common/util/trpc.client';
import { isBrowser } from '~/common/util/pwaUtils';
import type { PublishedSchema } from '../server/pastegg';
import { PublishDetails } from './PublishDetails';
import { conversationToMarkdown } from '../trade.client';
import { publishToState } from '../atoms';

function linkToOrigin() {
  let origin = isBrowser ? window.location.href : '';
  if (!origin || origin.includes('//localhost'))
    origin = Brand.URIs.OpenRepo;
  origin = origin.replace('https://', '');
  if (origin.endsWith('/'))
    origin = origin.slice(0, -1);
  return origin;
}

export function PublishExport() {
  const [publishConversationId, setPublishConversationId] = useRecoilState(publishToState);
  const [publishUploading, setPublishUploading] = React.useState(false);
  const [publishResponse, setPublishResponse] = React.useState<PublishedSchema | null>(null);
  const conversationId = useRecoilValue(publishToState);
  const conversation = getConversation(conversationId);
  const showSystemMessages = getChatShowSystemMessages();
  const markdownContent = conversationToMarkdown(conversation, !showSystemMessages, false);

  const handlePublishConversation = () => setPublishConversationId(props.conversationId);

  const handlePublishConfirmed = async () => {
    if (!conversationId) return;

    setPublishUploading(true);

    try {
      const paste = await apiAsyncNode.trade.publishTo.mutate({
        to: 'paste.gg',
        title: '🤖💬 Chat Conversation',
        fileContent: markdownContent,
        fileName: 'my-chat.md',
        origin: linkToOrigin(),
      });
      setPublishResponse(paste);
    } catch (error: any) {
      alert(`Failed to publish conversation: ${error?.message ?? error?.toString() ?? 'unknown error'}`);
      setPublishResponse(null);
    }

    setPublishUploading(false);
  };

  const handlePublishResponseClosed = () => {
    setPublishResponse(null);
  };

  const hasConversation = !!conversationId;

  return (
    <>
      <Button
        variant='soft' disabled={!hasConversation || publishUploading}
        loading={publishUploading}
        color={publishResponse ? 'success' : 'primary'}
        endDecorator={<ExitToAppIcon />}
        sx={{ minWidth: 240, justifyContent: 'space-between' }}
        onClick={handlePublishConversation}
      >
        Share Copy · Paste.gg
      </Button>

      {/* [publish] confirmation */}
      {conversationId && (
        <ConfirmationModal
          open onClose={() => setPublishConversationId(null)} onPositive={handlePublishConfirmed}
          confirmationText={
            <Typography variant='body1'>
              Share your conversation anonymously on <MuiLink href='https://paste.gg' target='_blank' color='inherit'>paste.gg</MuiLink>?
              It will be unlisted and available to share and read for 30 days. Keep in mind, deletion may not be possible.
              Do you wish to continue?
            </Typography>
          }
          positiveActionText={'Understood, Upload to Paste.gg'}
        />
      )}

      {/* [publish] response */}
      {!!publishResponse && (
        <PublishDetails open onClose={handlePublishResponseClosed} response={publishResponse} />
      )}

    </>
  );
}
