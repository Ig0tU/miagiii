import * as React from 'react';
import { AppNews, markNewsAsSeen } from '../src/apps/news';
import { withLayout } from '~/common/layout/withLayout';

export default function NewsPage() {
  const markNewsAsSeenMemoized = React.useCallback(markNewsAsSeen, []);

  // 'touch' the last seen news version
  React.useEffect(() => markNewsAsSeenMemoized(), [markNewsAsSeenMemoized]);

  const layoutType = 'optima';
  const suspendAutoModelsSetup = true;

  return withLayout(
    { type: layoutType, suspendAutoModelsSetup },
    <AppNews key={layoutType} />
  );
}
