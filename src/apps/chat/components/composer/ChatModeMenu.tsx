import * as React from 'react';
import { Box, MenuItem, Radio, Typography } from '@mui/joy';
import { CloseableMenu } from '~/common/components/CloseableMenu';
import { KeyStroke, platformAwareKeystrokes } from '~/common/components/KeyStroke';
import { useUIPreferencesStore } from '~/common/state/store-ui';
import { ChatModeId } from '../../AppChat';

interface ChatModeDescription {
  label: string;
  description: string | React.ReactNode;
  highlight?: boolean;
  shortcut?: string;
  hideOnDesktop?: boolean;
  requiresTTI?: boolean;
}

const ChatModeItems: { [key in ChatModeId]: ChatModeDescription } = {
  generateText: {
    label: 'Chat',
    description: 'Persona replies',
  },
  generateTextBeam: {
    label: 'Beam',
    description: 'Combine multiple models',
    shortcut: 'Ctrl + Enter',
    hideOnDesktop: true,
  },
  appendUser: {
    label: 'Write',
    description: 'Append a message',
    shortcut: 'Alt + Enter',
  },
  generateImage: {
    label: 'Draw',
    description: 'AI Image Generation',
    requiresTTI: true,
  },
  generateReact: {
    label: 'Reason + Act',
    description: 'Answer questions in multiple steps',
  },
};

function fixNewLineShortcut(shortcut: string, enterIsNewLine: boolean) {
  if (shortcut === 'ENTER') return enterIsNewLine ? 'Shift + Enter' : 'Enter';
  return shortcut;
}

export function ChatModeMenu(props: {
  isMobile: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  chatModeId: ChatModeId;
  onSetChatModeId: (chatMode: ChatModeId) => void;
  capabilityHasTTI: boolean;
}) {
  const enterIsNewline = useUIPreferencesStore(state => state.enterIsNewline);

  return (
    <CloseableMenu
      placement="top-end"
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
      anchorEl={props.anchorEl}
      sx={{ minWidth: 320 }}
    >
      {Object.entries(ChatModeItems)
        .filter(([_, data]) => !data.hideOnDesktop || props.isMobile)
        .map(([key, data]) => (
          <MenuItem
            key={'chat-mode-' + key}
            onClick={() => props.onSetChatModeId(key as ChatModeId)}
            selected={key === props.chatModeId}
          >
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Radio color={data.highlight ? 'success' : undefined} checked={key === props.chatModeId} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{data.label}</Typography>
                <Typography level="body-xs">
                  {data.description}
                  {data.requiresTTI && !props.capabilityHasTTI ? ' (Unconfigured)' : ''}
                </Typography>
              </Box>
              {(key === props.chatModeId || data.shortcut) && (
                <KeyStroke
                  combo={platformAwareKeystrokes(fixNewLineShortcut(data.shortcut ?? 'ENTER', enterIsNewline))}
                />
              )}
            </Box>
          </MenuItem>
        ))}
    </CloseableMenu>
  );
}
