FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 build-essential openssl ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Use corepack/pnpm for deterministic installs
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the package files first for faster install
COPY DashboardAdmin/package.json DashboardAdmin/pnpm-lock.yaml ./DashboardAdmin/
WORKDIR /usr/src/app/DashboardAdmin
RUN pnpm install --no-frozen-lockfile --no-optional

# Copy source files
COPY DashboardAdmin .

# Copy prisma schema from the Backend context
COPY prisma ../prisma

# Generate Prisma Client using the schema located at ../prisma/schema.prisma
RUN echo '{"name":"prisma-temp-root","private":true,"dependencies":{"@prisma/client":"6.18.0"}}' > /usr/src/app/package.json \
	&& pnpm install --prod --silent --dir /usr/src/app \
	&& pnpm run prisma

# Build TypeScript
RUN pnpm run build

FROM node:20-slim AS runner
WORKDIR /usr/src/app/DashboardAdmin
RUN apt-get update && apt-get install -y openssl ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/* \
	&& corepack enable && corepack prepare pnpm@latest --activate

# Copy compiled app and node_modules from builder
COPY --from=builder /usr/src/app/DashboardAdmin/dist ./dist
COPY --from=builder /usr/src/app/DashboardAdmin/node_modules ./node_modules

ENV NODE_ENV=production
ENV API_PORT=3010
EXPOSE 3010

CMD ["node", "dist/index.js"]
