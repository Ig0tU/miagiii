import * as React from 'react';
import { useRouter } from 'next/router';
import { withLayout } from '~/common/layout/withLayout';
import { AppLinkChat } from '../../../src/apps/link-chat/AppLinkChat';

export default function ChatLinkPage() {
  // get the chatLinkId from the query parameters of the URL
  const router = useRouter();
  const { chatLinkId } = router.query;

  // render the AppLinkChat component only when chatLinkId is available
  if (chatLinkId) {
    return withLayout({ type: 'optima', suspendAutoModelsSetup: true }, <AppLinkChat chatLinkId={chatLinkId} />);
  }

  // render a fallback message when chatLinkId is not available
  return <div>Chat link not found.</div>;
}
