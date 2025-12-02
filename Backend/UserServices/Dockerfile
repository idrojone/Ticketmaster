FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Provide tooling for native module builds (argon2, etc.)
RUN apt-get update && apt-get install -y python3 build-essential --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Use corepack/pnpm for deterministic installs (pnpm lock exists)
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --no-optional

COPY . .

FROM node:20-slim
WORKDIR /usr/src/app
WORKDIR /usr/src/app

# install production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "app/api/index.js"]
