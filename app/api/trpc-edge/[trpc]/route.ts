import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { AppRouterEdge } from '~/server/api/trpc.router-edge';
import { createTRPCFetchContext } from '~/server/api/trpc.server';

const handlerEdgeRoutes = (req: Request) =>
  fetchRequestHandler({
    router: AppRouterEdge,
    endpoint: '/api/trpc-edge',
    req,
    createContext: createTRPCFetchContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => console.error(`❌ tRPC-edge failed on ${path ?? "<no-path>"}: ${error.message}`)
        : undefined,
  });

if (import.meta.url === import.meta.resolve('.')) {
  export { handlerEdgeRoutes as GET, handlerEdgeRoutes as POST };
  export const runtime = 'edge';
} else {
  export default handlerEdgeRoutes;
}
