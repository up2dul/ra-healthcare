# ---- Base ----
# Common Node.js + pnpm setup reused across stages
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# ---- Dependencies ----
# Install ALL dependencies (dev + prod) needed for building
FROM base AS deps

COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --no-frozen-lockfile

# ---- Build ----
# Compile the React Router application
FROM deps AS build

# Copy workspace package sources (needed during build)
COPY packages/env/ ./packages/env/
COPY packages/config/ ./packages/config/

# Copy web app source
COPY apps/web/ ./apps/web/

# Build-time env var — Vite embeds this into the client bundle
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

RUN pnpm --filter web build

# Create a standalone production bundle via pnpm deploy
# This resolves workspace:* deps and installs only prod dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm --filter web deploy --prod /app/out

# ---- Runner ----
# Minimal production image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4173

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 webapp

# Copy the standalone production bundle (package.json + node_modules)
COPY --from=build --chown=webapp:nodejs /app/out ./

# pnpm deploy may skip gitignored dirs — copy build output explicitly
COPY --from=build --chown=webapp:nodejs /app/apps/web/build ./build

USER webapp

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:4173').then(r=>{if(!r.ok)throw r.status})"

CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]