# ===================================
# Stage 1: Builder
# ===================================
FROM node:22-alpine AS builder

RUN apk add --no-cache bash
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm exec prisma generate --schema=./prisma/schema.prisma \
    && mkdir -p node_modules/@prisma/client/.prisma \
    && cp -r node_modules/.prisma/client node_modules/@prisma/client/.prisma/ || true

# Build all services (excluding ia-service)
RUN pnpm exec nest build api-gateway \
    && pnpm exec nest build auth-service \
    && pnpm exec nest build merch-service \
    && pnpm exec nest build categoria-service \
    && pnpm exec nest build ia-service \
    && pnpm exec nest build common

# ===================================
# Stage 2: Runner
# ===================================
FROM node:22-alpine AS runner

RUN apk add --no-cache bash
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/pnpm-workspace.yaml .
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules ./node_modules

# Copy scripts
COPY --from=builder /app/wait-for-it.sh .
COPY --from=builder /app/init.sh .

# Set executable permissions
RUN chmod +x init.sh wait-for-it.sh

# Expose ports
# API Gateway: 3030
# Auth Service: 3031 (HTTP), 3032 (TCP)
# Categoria Service: 3070 (HTTP), 3033 (TCP)
# Merch Service: 3069 (HTTP), 3034 (TCP)
EXPOSE 3030 3031 3032 3033 3034 3069 3070

CMD ["sh", "-c", "/app/init.sh"]
