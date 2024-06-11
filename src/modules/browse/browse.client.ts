import { useBrowseStore } from '~/modules/browse/store-module-browsing';
import { apiAsyncNode } from '~/common/util/trpc.client';

const DEBUG_SHOW_SCREENSHOT = false;

export async function callBrowseFetchPage(
  url: string,
): Promise<BrowsePage> {
  // validate url
  url = url?.trim() || '';
  if (!url) {
    throw new Error('Browsing error: Invalid URL');
  }

  const urlObj = new URL(url);
  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    url = `https:${urlObj.origin}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
  }

  const { wssEndpoint, pageTransform } = useBrowseStore.getState();

  const { pages } = await apiAsyncNode.browse.fetchPages.mutate({
    access: {
      dialect: 'browse-wss',
      ...(wssEndpoint && { wssEndpoint }),
    },
    requests: [{
      url,
      transforms: [pageTransform],
      screenshot: DEBUG_SHOW_SCREENSHOT ? {
        width: 512,
        height: 512,
      } : undefined,
    }],
  });

  const [page] = pages as [BrowsePage, ...BrowsePage[]];

  if (DEBUG_SHOW_SCREENSHOT && page.screenshot) {
    const img = document.createElement('img');
    img.src = page.screenshot.webpDataUrl;
    img.style.width = `${page.screenshot.width}px`;
    img.style.height = `${page.screenshot.height}px`;
    document.body.appendChild(img);
  }

  if (page.error) {
    console.warn('Browsing service error:', page.error);
    if (!Object.entries(page.content).length) {
      throw new Error(page.error);
    }
  }

  return page;
}
