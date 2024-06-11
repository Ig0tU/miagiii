import * as React from 'react';

import {
  Box,
  Button,
  FormControl,
  Input,
  Sheet,
  Textarea,
  Typography,
} from '@mui/joy';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import OpenAIIcon from '~/common/components/icons/vendors/OpenAIIcon';
import { useFormRadio } from '~/common/components/forms/useFormRadio';
import { InlineError } from '~/common/components/InlineError';
import { KeyStroke } from '~/common/components/KeyStroke';
import { apiAsyncNode } from '~/common/util/trpc.client';
import { createDConversation, createDMessage, DConversationId, DMessage, useChatStore } from '~/common/state/store-chats';
import { ImportOutcomeModal } from './ImportOutcomeModal';

type ImportConfig = { dir: 'import' };

const chatGptMedia: FormRadioOption<'source' | 'link'>[] = [
  { label: 'Shared Chat URL', value: 'link' },
  { label: 'Page Source', value: 'source' },
];

type ChatGptFormValues = {
  media: 'source' | 'link';
  url?: string;
  source?: string;
};

const ChatGptForm = (props: {
  values: ChatGptFormValues;
  onChange: (values: ChatGptFormValues) => void;
}) => {
  const { values, onChange } = props;

  return (
    <Sheet variant="soft" color="primary" sx={{ display: 'flex', flexDirection: 'column', borderRadius: 'md', p: 1, gap: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        {useFormRadio(values.media, chatGptMedia, onChange)}
        <OpenAIIcon sx={{ ml: 'auto', my: 1 }} />
      </Box>

      {values.media === 'link' && (
        <Input
          variant="outlined"
          placeholder="https://chat.openai.com/share/..."
          required
          error={!values.url || !values.url.startsWith('https://chat.openai.com/share/') || values.url.length <= 40}
          value={values.url || ''}
          onChange={(event) => onChange({ ...values, url: event.target.value })}
        />
      )}

      {values.media === 'source' && (
        <Textarea
          variant="outlined"
          placeholder="Paste the page source here"
          required
          minRows={4}
          maxRows={8}
          value={values.source || ''}
          onChange={(event) => onChange({ ...values, source: event.target.value })}
        />
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="soft" color="primary" onClick={() => onChange({ media: 'link', url: undefined, source: undefined })} sx={{ mr: 'auto' }}>
          Cancel
        </Button>
        <Button color="primary" disabled={!values.url || !values.url.startsWith('https://chat.openai.com/share/') || values.url.length <= 40 || (values.media === 'source' && !values.source?.length)} onClick={props.onChatGptLoad}>
          Import Chat
        </Button>
      </Box>
    </Sheet>
  );
};

type ImportChatsProps = {
  onConversationActivate: (conversationId: DConversationId) => void;
  onClose: () => void;
};

export const ImportChats = (props: ImportChatsProps) => {
  const [importMedia, importMediaControl] = useFormRadio('link', chatGptMedia);
  const [chatGptEdit, setChatGptEdit] = React.useState(false);
  const [chatGptFormValues, setChatGptFormValues] = React.useState<ChatGptFormValues>({ media: 'link', url: '' });
  const [importJson, setImportJson] = React.useState<string | null>(null);
  const [importOutcome, setImportOutcome] = React.useState<ImportedOutcome | null>(null);

  const isUrl = importMedia === 'link';
  const isSource = importMedia === 'source';
  const chatGptUrlValid = chatGptFormValues.url && chatGptFormValues.url.startsWith('https://chat.openai.com/share/') && chatGptFormValues.url.length > 40;

  const handleImportFromFiles = React.useCallback(async () => {
    const outcome = await openAndLoadConversations(true);

    if (outcome?.activateConversationId)
      props.onConversationActivate(outcome.activateConversationId);

    setImportOutcome(outcome);
  }, [props.onConversationActivate]);

  const handleChatGptToggleShown = React.useCallback(() => setChatGptEdit(!chatGptEdit), [chatGptEdit]);

  const handleChatGptLoad = React.useCallback(async () => {
    setImportJson(null);
    if ((isUrl && !chatGptUrlValid) || (isSource && !chatGptFormValues.source))
      return;

    const outcome: ImportedOutcome = { conversations: [], activateConversationId: null };

    let conversationId: DConversationId, data: any;
    try {
      if (isUrl) {
        ({ conversationId, data } = await apiAsyncNode.trade.importChatGptShare.mutate({ url: chatGptFormValues.url }));
      } else {
        ({ conversationId, data } = await apiAsyncNode.trade.importChatGptSource.mutate({ source: chatGptFormValues.source }));
      }
    } catch (error) {
      outcome.conversations.push({ fileName: 'chatgpt', success: false, error: (error as any)?.message || error?.toString() || 'unknown error' });
      setImportOutcome(outcome);
      return;
    }

    setImportJson(JSON.stringify(data, null, 2));

    const conversation = createDConversation();
    conversation.id = conversationId;
    conversation.created = Math.round(data.create_time * 1000);
    conversation.updated = Math.round(data.update_time * 1000);
    conversation.autoTitle = data.title;
    conversation.messages = data.linear_conversation.filter(msgNode => msgNode.message?.content.parts?.length).map(msgNode => {
      const message = msgNode.message;
      if (message?.content.parts) {
        const role = message.author.role;
        const joinedText = message.content.parts.join('\n');
        if ((role === 'user' || role === 'assistant') && joinedText.length >= 1) {
          const dMessage = createDMessage(role, joinedText);
          dMessage.id = message.id;
          if (message.create_time)
            dMessage.created = Math.round(message.create_time * 1000);
          return dMessage;
        }
      }
      return null;
    }).filter(msg => !!msg) as DMessage[];

    const success = conversation.messages.length >= 1;
    if (success) {
      useChatStore.getState().importConversation(conversation, false);
      props.onConversationActivate(conversationId);
      outcome.conversations.push({ success: true, fileName: 'chatgpt', conversation });
    } else {
      outcome.conversations.push({ success: false, fileName: 'chatgpt', error: `Empty conversation` });
    }
    setImportOutcome(outcome);
  }, [chatGptFormValues, isUrl, isSource, props.onConversationActivate]);

  const handleImportOutcomeClosed = React.useCallback(() => {
    setImportOutcome(null);
    props.onClose();
  }, [props.onClose]);

  return (
    <>
      <Box sx={{ display: 'grid', gap: 1, mx: 'auto' }}>
        <Typography level='body-sm'>
          Select where to <strong>import from</strong>:
        </Typography>

        <GoodTooltip title={<KeyStroke dark combo='Ctrl + O' />}>
          <Button
            variant='soft' endDecorator={<FileUploadIcon />} sx={{ minWidth: 240, justifyContent: 'space-between' }}
            onClick={handleImportFromFiles}
          >
            {Brand.Title.Base} · JSON
          </Button>
        </GoodTooltip>

        {!chatGptEdit && (
          <Button
            variant='soft' endDecorator={<OpenAIIcon />} sx={{ minWidth: 240, justifyContent: 'space-between' }}
            color={chatGptEdit ? 'neutral' : 'primary'}
            onClick={handleChatGptToggleShown}
          >
            ChatGPT · Shared Link
          </Button>
        )}
      </Box>

      {chatGptEdit && (
        <ChatGptForm
          values={chatGptFormValues}
          onChange={setChatGptFormValues}
          onChatGptLoad={handleChatGptLoad}
        />
      )}

      {!!importOutcome && (
        <ImportOutcomeModal
          outcome={importOutcome}
          rawJson={importJson}
          onClose={handleImportOutcomeClosed}
        />
      )}
    </>
  );
};
