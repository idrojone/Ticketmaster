# Build stage
FROM node:20-slim AS builder

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y python3 build-essential --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --no-frozen-lockfile

COPY . .

# Runtime stage
FROM node:20-slim

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y bash --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/app ./app
COPY --from=builder /usr/src/app/package.json ./package.json

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["/usr/local/bin/wait-for-it.sh", "mongodb:27017", "--timeout=60", "--strict", "--", \
    "/usr/local/bin/wait-for-it.sh", "dashboard-admin:3010", "--timeout=60", "--strict", "--", \
    "node", "app/api/index.js"]
