# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Install required packages (e.g., Python for node-gyp)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile;

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app

COPY . .
COPY tsconfig.json .

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm run build;

# Stage 3: Run the application
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
