import { conversationTitle, DConversationId, messageHasUserFlag, useChatStore } from '~/common/state/store-chats';
import { ActileItem, ActileProvider } from './ActileProvider';

export interface StarredMessageItem extends ActileItem {
  conversationId: DConversationId;
  messageId: string;
}

export function providerStarredMessage(onMessageSelect: (item: StarredMessageItem) => void): ActileProvider<StarredMessageItem> {
  let conversations: any[] = [];

  return {
    fastCheckTriggerText: (trailingText: string) => trailingText === '@' || trailingText.endsWith(' @'),

    fetchItems: async () => {
      const chatStore = useChatStore();
      conversations = Array.from(chatStore.getState().conversations || []);

      const starredMessages: StarredMessageItem[] = [];
      conversations.forEach((conversation) => {
        conversation.messages.forEach((message) => {
          if (messageHasUserFlag(message, 'starred')) {
            const { id: conversationId } = conversation;
            const { id: messageId } = message;
            starredMessages.push({
              conversationId,
              messageId,
              key: messageId,
              label: `${conversationTitle(conversation)} - ${message.text.slice(0, 32)}...`,
              Icon: undefined,
            });
          }
        });
      });

      return {
        title: 'Starred Messages',
        searchPrefix: '',
        items: starredMessages,
      };
    },

    onItemSelect: (item) => onMessageSelect(item as StarredMessageItem),
  };
}
