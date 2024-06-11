import { createDMessage, DMessage } from '~/common/state/store-chats';

type MessageRole = 'user' | 'assistant' | 'system';

function isUserMessage(message: DMessage): message is DMessage & { role: 'user' } {
  return message.role === 'user';
}

const replyToSystemPrompt = (text: string) => `The user is referring to this in particular:\n${text}`;

interface CreateSystemMessageFunction {
  (role: 'system', text: string): DMessage;
}

/**
 * Adds a system message to the history, explaining the context of the reply
 *
 * Only works with OpenAI and a couple more right now. Fix it by making it vendor-agnostic
 */
export function updateHistoryForReplyTo(
  history: DMessage[],
  createSystemMessage: CreateSystemMessageFunction,
): void {
  if (!history?.length) {
    return;
  }

  const lastMessage = history[history.length - 1];

  if (isUserMessage(lastMessage) && lastMessage.metadata?.inReplyToText) {
    history.push(createSystemMessage('system', replyToSystemPrompt(lastMessage.metadata.inReplyToText)));
  }
}

