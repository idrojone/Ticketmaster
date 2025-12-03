# Multi-stage build for dashboard-empresa NestJS monorepo
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 build-essential openssl ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Use corepack/pnpm for deterministic installs
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the package files first for faster install
COPY dashboard-empresa/package.json dashboard-empresa/pnpm-lock.yaml dashboard-empresa/pnpm-workspace.yaml dashboard-empresa/nest-cli.json ./dashboard-empresa/
WORKDIR /usr/src/app/dashboard-empresa
RUN pnpm install --no-frozen-lockfile --no-optional

# Copy source files
COPY dashboard-empresa .

# Copy prisma schema from the Backend context
COPY prisma ../prisma

# Generate Prisma Client using the schema located at ../prisma/schema.prisma
RUN echo '{"name":"prisma-temp-root","private":true,"dependencies":{"@prisma/client":"6.19.0"}}' > /usr/src/app/package.json \
	&& pnpm install --prod --silent --dir /usr/src/app \
	# Remove prisma/.env to prevent conflicting env vars between dashboard-empresa/.env and prisma/.env during build
	&& rm -f ../prisma/.env || true \
	&& pnpm run prisma

# Build each NestJS application separately
RUN pnpm exec nest build api-gateway
RUN pnpm exec nest build auth-service
RUN pnpm exec nest build merch-service
RUN pnpm exec nest build categoria-service

# Production stage
FROM node:20-slim AS runner

WORKDIR /usr/src/app/dashboard-empresa

# Install runtime dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/* \
	&& corepack enable && corepack prepare pnpm@latest --activate

# Copy compiled apps and node_modules from builder
COPY --from=builder /usr/src/app/dashboard-empresa/dist ./dist
COPY --from=builder /usr/src/app/dashboard-empresa/node_modules ./node_modules
COPY --from=builder /usr/src/app/dashboard-empresa/package.json ./package.json

# Install concurrently globally using npm
RUN npm install -g concurrently

ENV NODE_ENV=production

# Expose ports for all microservices (match internal app ports)
EXPOSE 3030 3031 3069 3070 3032 3033 3034

# Start all microservices using concurrently
CMD ["concurrently", \
	"node dist/apps/api-gateway/main.js", \
	"node dist/apps/auth-service/main.js", \
	"node dist/apps/merch-service/main.js", \
	"node dist/apps/categoria-service/main.js"]
