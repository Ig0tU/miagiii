/// set this to true to see the tRPC and fetch requests made by the server
export const SERVER_DEBUG_WIRE = false;

type HeadersInitWithContentType = Omit<HeadersInit, 'Content-Type'> & { 'Content-Type'?: string };

export class ServerFetchError extends Error {
  public statusCode: number;

  constructor({ statusCode, message }: { statusCode: number, message: string }) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ServerFetchError';
  }
}

/**
 * Fetches a URL, but throws an Error if the response is not ok.
 */
export async function nonTrpcServerFetchOrThrow<T>(url: string, method: 'GET' | 'POST', headers: HeadersInitWithContentType, body: object | undefined): Promise<Response & T> {
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      'Content-Type': headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // Throws an error if the response is not ok
  // Use in server-side code, and not tRPC code (which has utility functions in trpc.serverutils.ts)
  if (!response.ok) {
    let payload: any | null = await response.json().catch(() => null);
    if (payload === null)
      payload = await response.text().catch(() => null);
    const errorPayloadString = payload ? `: ${JSON.stringify(payload, null, 2).slice(1, -1)}` : '';
    throw new ServerFetchError({
      message: `${response.statusText} (${response.status})${errorPayloadString}`,
      statusCode: response.status,
    });
  }

  return response as Response & T;
}

/**
 * Safely convert a typical exception/error to a string.
 */
export async function safeErrorString(error: any): Promise<string | null> {
  // skip nulls
  if (!error)
    return null;

  // descend into an 'error' object
  if (error.error)
    return safeErrorString(error.error);

  // choose the 'message' property if available
  if (error.message)
    return safeErrorString(error.message);
  if (typeof error === 'string')
    return error;
  if (typeof error === 'object') {
    try {
      return JSON.stringify(error, null, 2).slice(1, -1);
    } catch (error) {
      // ignore
    }
  }

  // unlikely fallback
  return error.toString();
}

export function serverCapitalizeFirstLetter(string: string) {
  return string?.length ? (string.charAt(0).toUpperCase() + string.slice(1)) : string;
}

/**
 * Weak (meaning the string could be encoded poorly) function that returns a string that can be used to debug a request
 */
export function debugGenerateCurlCommand(method: 'GET' | 'POST' | 'DELETE', url: string, headers: HeadersInit, body: object | undefined): string {
  let curl = `curl -X ${method} '${url}' `;

  const headersRecord = headers as Record<string, string>;

  for (const header in headersRecord)
    curl += `-H '${header}: ${headersRecord[header]}' `;

  if (method === 'POST' && body)
    curl += `-d '${JSON.stringify(body)}'`;

  // Add User-Agent header
  curl += `-H 'User-Agent: ${navigator.userAgent}'`;

  return curl;
}

export function createEmptyReadableStream<T = Uint8Array>(): ReadableStream<T> {
  return new ReadableStream({
    start: (controller) => controller.close(),
  });
}

export async function serverErrorToString(error: any): Promise<string> {
  const errorString = await safeErrorString(error);
  if (errorString) {
    return errorString;
  } else {
    return 'Unknown error';
  }
}
