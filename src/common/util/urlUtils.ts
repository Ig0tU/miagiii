import { isBrowser, isVercelFromBackendOrSSR } from './pwaUtils';

const getBaseUrl = () => {
  if (isBrowser) return '';
  if (isVercelFromBackendOrSSR) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

const getOriginUrl = () => {
  if (isBrowser) return window.location.origin;
  return getBaseUrl();
};

const asValidURL = (textString: string | null): string | null => {
  if (!textString) return null;
  const urlRegex = /^(https?:\/\/\S+)$/g;
  const trimmedTextString = textString.trim();
  const urlMatch = urlRegex.exec(trimmedTextString);
  return urlMatch ? urlMatch[1] : null;
};

const fixupHost = (host: string, apiPath: string): string => {
  if (!host.startsWith('http')) host = `https://${host}`;
  if (host.endsWith('/') && apiPath.startsWith('/')) host = host.slice(0, -1);
  return host;
};

export { getBaseUrl, getOriginUrl, asValidURL, fixupHost };
