import { createTRPCRouter, publicProcedure } from './trpc';

import { browseRouter } from '~/modules/browse/browse.router';
import { tradeRouter } from '~/modules/trade/server/trade.router';

/**
 * Define shared procedures here
 */
const sharedProcedures = {
  // add any shared procedures here
};

/**
 * Secondary rooter, and will be sitting on an NodeJS Runtime.
 */
export const appRouterNode = createTRPCRouter({
  browse: browseRouter,
  trade: tradeRouter,
  ...sharedProcedures,
});

// export type definition of API
export type AppRouterNode = typeof appRouterNode;
