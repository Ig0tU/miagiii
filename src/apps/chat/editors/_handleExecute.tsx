import {
  getChatLLMId,
  createDMessage,
  DConversationId,
  DMessage,
  getConversationSystemPurposeId,
} from '~/common/state/store-chats';
import {
  extractChatCommand,
  findAllChatCommands,
} from '../commands/commands.registry';
import {
  ConversationsManager,
  runAssistantUpdatingState,
  runBrowseGetPageUpdatingState,
  runImageGenerationUpdatingState,
  runReActUpdatingState,
} from './';
import { ChatModeId, ChatCommand } from '../types';

export async function handleExecute(
  chatModeId: ChatModeId,
  conversationId: DConversationId,
  history: DMessage[]
): Promise<string> {
  if (!conversationId) {
    return 'err-no-conversation';
  }

  const chatLLMId = getChatLLMId();

  const cHandler = ConversationsManager.getHandler(conversationId);
  cHandler.inlineUpdatePurposeInHistory(history, chatLLMId || undefined);
  updateHistoryForReplyTo(history);

  if (!chatLLMId || !chatModeId) {
    cHandler.messagesReplace(history);
    return !chatLLMId ? 'err-no-chatllm' : 'err-no-chatmode';
  }

  const lastMessage = history[history.length - 1];
  const chatCommand = extractChatCommand(lastMessage?.text)[0];

  if (chatCommand && chatCommand.type === 'cmd') {
    switch (chatCommand.providerId) {
      case 'ass-browse':
        cHandler.messagesReplace(history);
        return await runBrowseGetPageUpdatingState(cHandler, chatCommand.params);

      case 'ass-t2i':
        cHandler.messagesReplace(history);
        return await runImageGenerationUpdatingState(cHandler, chatCommand.params);

      case 'ass-react':
        cHandler.messagesReplace(history);
        return await runReActUpdatingState(cHandler, chatCommand.params, chatLLMId);

      case 'chat-alter':
        if (chatCommand.command === '/clear') {
          if (chatCommand.params === 'all') {
            cHandler.messagesReplace([]);
          } else {
            cHandler.messagesReplace(history);
            cHandler.messageAppendAssistant(
              'Issue: this command requires the \'all\' parameter to confirm the operation.',
              undefined,
              'issue',
              false
            );
          }
          return true;
        }

        Object.assign(lastMessage, {
          role:
            chatCommand.command.startsWith('/s')
              ? 'system'
              : chatCommand.command.startsWith('/a')
              ? 'assistant'
              : 'user',
          sender: 'Bot',
          text: chatCommand.params || '',
        });

        cHandler.messagesReplace(history);
        return true;

      case 'cmd-help':
        const chatCommandsText = findAllChatCommands()
          .map(
            (cmd: ChatCommand) =>
              ` - ${cmd.primary}` +
              (cmd.alternatives?.length
                ? ` (${cmd.alternatives.join(', ')})`
                : '') +
              `: ${cmd.description}`
          )
          .join('\n');

        cHandler.messagesReplace(history);
        cHandler.messageAppendAssistant(
          `Available Chat Commands:\n${chatCommandsText}`,
          undefined,
          'help',
          false
        );
        return true;

      case 'mode-beam':
        if (chatCommand.isError) {
          cHandler.messagesReplace(history);
          return false;
        }

        Object.assign(lastMessage, { text: chatCommand.params || '' });
        cHandler.messagesReplace(history);
        ConversationsManager.getHandler(conversationId).beamInvoke(
          history,
          [],
          null
        );
        return true;

      default:
        cHandler.messagesReplace([...history, createDMessage('assistant', 'This command is not supported.')]);
        return false;
    }
  }

  if (!getConversationSystemPurposeId(conversationId)) {
    cHandler.messagesReplace(history);
    cHandler.messageAppendAssistant(
      'Issue: no Persona selected.',
      undefined,
      'issue',
      false
    );
    return 'err-no-persona';
  }

  switch (chatModeId) {
    case 'generate-text':
      cHandler.messagesReplace(history);
      return await runAssistantUpdatingState(
        conversationId,
        history,
        chatLLMId,
        getUXLabsHighPerformance() ? 0 : getInstantAppChatPanesCount()
      );

    case 'generate-text-beam':
      cHandler.messagesReplace(history);
      cHandler.beamInvoke(history, [], null);
      return true;

    case 'append-user':
      cHandler.messagesReplace(history);
      return true;

    case 'generate-image':
      if (!lastMessage?.text) break;

      cHandler.messagesReplace(history.map(
        (message) => (message.id !== lastMessage.id) ? message : {
          ...message,
          text: `/draw ${lastMessage.text}`,
        }
      ));

      return await runImageGenerationUpdatingState(cHandler, lastMessage.text);

    case 'generate-react':
      if (!lastMessage?.text) break;

      cHandler.messagesReplace(history);
      return await runReActUpdatingState(cHandler, lastMessage.text, chatLLMId);
  }

  console.log('Chat execute: issue running', chatModeId, conversationId, lastMessage);
  cHandler.messagesReplace(history);
  return false;
}
