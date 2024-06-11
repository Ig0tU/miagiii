/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

// 1. CONTEXT

type FetchContext = {
  hostName: string;
};

export const createTRPCFetchContext = ({ req }: { req: Request; }) => {
  return {
    hostName: req.headers?.get('host') ?? 'localhost',
  };
};

// 2. INITIALIZATION

const t = initTRPC<FetchContext>().context<typeof createTRPCFetchContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
