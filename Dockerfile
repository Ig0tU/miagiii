# Base image
FROM node:18-alpine AS base
ENV NEXT_TELEMETRY_DISABLED 1

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY src/server/prisma ./src/server/prisma
RUN apk add --no-cache --virtual .build-deps gcc libc-dev musl-dev linux-headers && \
    npm ci && \
    apk del .build-deps

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set GA4 measurement ID if provided
ARG NEXT_PUBLIC_GA4_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA4_MEASUREMENT_ID=${NEXT_PUBLIC_GA4_MEASUREMENT_ID}

# Build the application
RUN npm run build

# Prune production dependencies
RUN npm prune --production

# Runner stage
FROM base AS runner
WORKDIR /app

# Create non-root user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built app and production dependencies
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/src/server/prisma ./src/server/prisma

# Set environment variables for production
ENV NODE_ENV production
ENV PATH $PATH:/app/node_modules/.bin

# Run as non-root user
USER nextjs

# Expose port 3000 for the application to listen on
EXPOSE 3000

# Start the application
CMD ["next", "start"]
