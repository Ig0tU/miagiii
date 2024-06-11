//
// Application Routes
//
// We will centralize them here, for UI and routing purposes.
//

import { useRouter } from 'next/router';
import type { AppCallIntent, AppChatIntent } from '../apps/call/AppCall';
import type { DConversationId } from '~/common/state/store-chats';
import { isBrowser } from './util/pwaUtils';

export const ROUTE_INDEX = '/';
export const ROUTE_APP_CHAT = '/chat';
export const ROUTE_APP_CALL = '/call';
export const ROUTE_APP_LINK_CHAT = '/link/chat/[chatLinkId]';
export const ROUTE_APP_NEWS = '/news';
export const ROUTE_APP_PERSONAS = '/personas';
const ROUTE_CALLBACK_OPENROUTER = '/link/callback_openrouter';

export const getCallbackUrl = (source: 'openrouter') => {
  const callbackUrl = new URL(window.location.href);
  switch (source) {
    case 'openrouter':
      callbackUrl.pathname = ROUTE_CALLBACK_OPENROUTER;
      break;
    default:
      throw new Error(`Unknown source: ${source}`);
  }
  return callbackUrl.toString();
};

export const getChatLinkRelativePath = (chatLinkId: string) =>
  ROUTE_APP_LINK_CHAT.replace('[chatLinkId]', chatLinkId);

export function useRouterQuery<TQuery>(): TQuery {
  const router = useRouter();
  return router.query as TQuery;
}

export function useRouterRoute(): string {
  const router = useRouter();
  return router.route;
}

export const navigateToIndex = () => navigateFn(ROUTE_INDEX);

export const navigateToNews = () => navigateFn(ROUTE_APP_NEWS);

export const navigateToPersonas = () => navigateFn(ROUTE_APP_PERSONAS);

export const navigateToChatLinkList = () => navigateFn(ROUTE_APP_LINK_CHAT.replace('[chatLinkId]', 'list'));

export const navigateBack = () => Router.back();

export const reloadPage = () => isBrowser && window.location.reload();

function navigateFn(path: string) {
  return (replace?: boolean): Promise<void> =>
    new Promise((resolve) => Router[replace ? 'replace' : 'push'](path).then(resolve));
}

export async function launchAppChat(conversationId?: DConversationId) {
  const query = conversationId ? { initialConversationId: conversationId } : {};
  try {
    await Router.push({ pathname: ROUTE_APP_CHAT, query }, ROUTE_APP_CHAT);
  } catch (err) {
    console.error(err);
  }
}

export function launchAppCall(conversationId: string, personaId: string) {
  const query = { conversationId, personaId, backTo: 'app-chat' };
  void Router.push({ pathname: ROUTE_APP_CALL, query }, ROUTE_APP_CALL).then();
}
