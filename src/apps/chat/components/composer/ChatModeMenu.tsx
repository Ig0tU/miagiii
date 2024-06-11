import React, { useCallback } from 'react';
import { Box, MenuItem, Radio, Typography } from '@mui/joy';
import { CloseableMenu } from '~/common/components/CloseableMenu';
import { KeyStroke, platformAwareKeystrokes } from '~/common/components/KeyStroke';
import { useUIPreferencesStore } from '~/common/state/store-ui';
import { ChatModeId } from '../../AppChat';
import { ChatModeDescription } from './ChatModeMenu.types';
import { filterChatModeItems } from './ChatModeMenu.utils';

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
  if (shortcut === 'ENTER') {
    return enterIsNewLine ? 'Shift + Enter' : 'Enter';
  }
  return shortcut;
}

function filterDesktopOrMobileChatModeItems(
  chatModeItems: { [key in ChatModeId]: ChatModeDescription },
  isMobile: boolean,
) {
  return Object.entries(chatModeItems).filter(
    ([_, data]) => !data.hideOnDesktop || isMobile,
  );
}

export const ChatModeMenu: React.FC<{
  isMobile: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  chatModeId: ChatModeId;
  onSetChatModeId: (chatMode: ChatModeId) => void;
  capabilityHasTTI: boolean;
  enterIsNewline: boolean;
}> = ({ isMobile, anchorEl, onClose, chatModeId, onSetChatModeId, capabilityHasTTI, enterIsNewline }) => {
  const handleMenuItemClick = useCallback(
    (key: ChatModeId) => () => {
      onSetChatModeId(key);
      onClose();
    },
    [onClose, onSetChatModeId],
  );

  const chatModeItems = filterDesktopOrMobileChatModeItems(ChatModeItems, isMobile);

  return (
    <CloseableMenu
      placement="top-end"
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorEl={anchorEl}
      sx={{ minWidth: 320 }}
    >
      {chatModeItems.map(([key, data]) => (
        <MenuItem
          key={'chat-mode-' + key}
          onClick={handleMenuItemClick(key as ChatModeId)}
          selected={key === chatModeId}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Radio color={data.highlight ? 'success' : undefined} checked={key === chatModeId} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography>{data.label}</Typography>
              <Typography level="body-xs">
                {data.description}
                {data.requiresTTI && !capabilityHasTTI ? ' (Unconfigured)' : ''}
              </Typography>
            </Box>
            {(key === chatModeId || data.shortcut) && (
              <KeyStroke
                combo={platformAwareKeystrokes(
                  fixNewLineShortcut(data.shortcut ?? 'ENTER', enterIsNewline),
                )}
                alt={data.shortcut}
              />
            )}
          </Box>
        </MenuItem>
      ))}
    </CloseableMenu>
  );
};


export type ChatModeDescription = {
  label: string;
  description: string | React.ReactNode;
  highlight?: boolean;
  shortcut?: string;
  hideOnDesktop?: boolean;
  requiresTTI?: boolean;
};

export type ChatModeId = 'generateText' | 'generateTextBeam' | 'appendUser' | 'generateImage' | 'generateReact';


export function filterDesktopOrMobileChatModeItems(
  chatModeItems: { [key in ChatModeId]: ChatModeDescription },
  isMobile: boolean,
) {
  return Object.entries(chatModeItems).filter(
    ([_, data]) => !data.hideOnDesktop || isMobile,
  );
}
