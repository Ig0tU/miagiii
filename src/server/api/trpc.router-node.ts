import { createTRPCRouter, publicProcedure } from './trpc';

// Import routers
import browseRouter from '~/modules/browse/browse.router';
import tradeRouter from '~/modules/trade/server/trade.router';

// Shared procedures
const sharedProcedures = {
  // add any shared procedures here
};

// Create the root TRPC router
const appRouterNode = createTRPCRouter({
  browse: browseRouter,
  trade: tradeRouter,
  ...sharedProcedures,
});

// Export the router and its type definition
export { appRouterNode as router };
export type { AppRouterNode } from './trpc';
