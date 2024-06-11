import * as React from 'react';

import { DConversationId } from '~/common/state/store-chats';
import { GoodModal } from '~/common/components/GoodModal';

import { ExportChats, ExportConfig } from './ExportChats';
import { ImportChats, ImportConfig } from './ImportChats';

type ImportConfigProps = {
  onConversationActivate: (conversationId: DConversationId) => void;
  onClose: () => void;
};

type ExportConfigProps = {
  config: ExportConfig;
  onClose: () => void;
};

type TradeConfig = ImportConfig | ExportConfig;

type TradeModalType = {
  config: TradeConfig;
  onConversationActivate: (conversationId: DConversationId) => void;
  onClose: () => void;
};

const getTitle = (config: TradeConfig) => {
  if (config.dir === 'import') {
    return 'Import conversation';
  }
  if (config.dir === 'export') {
    return config.exportAll ? 'Export conversations' : 'Export conversation';
  }
  return '';
};

const getModalContent = (config: TradeConfig, onConversationActivate: (conversationId: DConversationId) => void, onClose: () => void) => {
  if (config.dir === 'import') {
    return <ImportChats onConversationActivate={onConversationActivate} onClose={onClose} />;
  }
  if (config.dir === 'export') {
    return <ExportChats config={config} onClose={onClose} />;
  }
  return null;
};

const getModalProps = (config: TradeConfig, onClose: () => void) => ({
  open: true,
  onClose,
  dividers: true,
  title: (
    <>
      <b>{getTitle(config)}</b>
    </>
  ),
});

export const TradeModal: React.FC<TradeModalType> = (props) => {
  return <GoodModal {...getModalProps(props.config, props.onClose)}>{getModalContent(props.config, props.onConversationActivate, props.onClose)}</GoodModal>;
};
