# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: install with devDependencies ----
FROM base AS deps
ENV NODE_ENV=development
RUN apk add --no-cache libc6-compat
RUN corepack enable

COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN --mount=type=cache,target=/root/.cache \
  corepack prepare yarn@1.22.22 --activate \
  && yarn install --frozen-lockfile --production=false

# ---- builder: build in production mode ----
FROM deps AS builder
# IMPORTANT: build with production env
ENV NODE_ENV=production
COPY . .
RUN --mount=type=cache,target=/root/.cache \
  yarn build

# ---- runner ----
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1

CMD ["node", "server.js"]
