import { TRPCError } from '@trpc/server';
import { debugGenerateCurlCommand, safeErrorString, SERVER_DEBUG_WIRE } from '~/server/wire';

type HeadersInit = { [key: string]: string | string[] };
type Method = 'GET' | 'POST' | 'DELETE';
type Fetcher<TOut, TPostBody = undefined> = (
  url: string,
  method: Method,
  headers: HeadersInit,
  body?: TPostBody,
  moduleName: string
) => Promise<TOut>;

const createFetcherFromTRPC = <TOut, TPostBody, E = Error>(
  parser: (response: Response) => Promise<TOut>,
  parserName: string,
  errorCode: number
): Fetcher<TOut, TPostBody> => {
  return async (url, method, headers, body, moduleName) => {
    let response: Response;
    try {
      if (SERVER_DEBUG_WIRE)
        console.log('-> tRPC', debugGenerateCurlCommand(method, url, headers, body as any));

      response = await fetch(url, { method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    } catch (error) {
      console.error(`[${method}] ${moduleName} error (fetch):`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `[Issue] ${moduleName}: (network): ${safeErrorString(error) || 'unknown fetch error'}`,
      });
    }

    if (!response.ok) {
      let payload: any | null = await response.json().catch(() => null);
      if (payload === null)
        payload = await response.text().catch(() => null);
      console.error(`[${method}] ${moduleName} error (upstream):`, response.status, response.statusText, payload);
      throw new TRPCError({
        code: errorCode,
        message: `[Issue] ${moduleName}: ${response.statusText}`
          + (payload ? ` - ${safeErrorString(payload)}` : ''),
      });
    }

    try {
      return await parser(response);
    } catch (error) {
      console.error(`[${method}] ${moduleName} error (parse):`, error);
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `[Issue] ${moduleName}: (parsing): ${safeErrorString(error) || `Unknown ${parserName} parsing error`}`,
      });
    }
  };
};

export const fetchJsonOrTRPCError: Fetcher<object> = createFetcherFromTRPC(async (response) => await response.json(), 'json', 400);
export const fetchTextOrTRPCError: Fetcher<string> = createFetcherFromTRPC(async (response) => await response.text(), 'text', 400);
