FROM node:20-slim AS builder

WORKDIR /usr/src/app

RUN apt-get update && \
	apt-get install -y python3 build-essential openssl --no-install-recommends && \
	rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY prisma ./prisma
COPY DashboardAdmin/package.json DashboardAdmin/pnpm-lock.yaml ./DashboardAdmin/

RUN echo '{"private": true}' > package.json

WORKDIR /usr/src/app/DashboardAdmin
RUN pnpm install --no-frozen-lockfile

COPY DashboardAdmin .

RUN pnpm run prisma && ls node_modules/.prisma/client/*.d.ts && pnpm run build 2>&1 | grep "has no exported member" | head -5

# Runtime
FROM node:20-slim

WORKDIR /usr/src/app/DashboardAdmin

RUN apt-get update && \
	apt-get install -y openssl bash --no-install-recommends && \
	rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/DashboardAdmin/dist ./dist
COPY --from=builder /usr/src/app/DashboardAdmin/node_modules ./node_modules

COPY DashboardAdmin/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

ENV NODE_ENV=production
ENV API_PORT=3010

EXPOSE 3010

CMD ["/usr/local/bin/wait-for-it.sh", "mongodb:27017", "--timeout=60", "--strict", "--", \
	"node", "dist/index.js"]