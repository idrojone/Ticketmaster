FROM node:22-slim as builder

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
	&& rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

ENV CI=true

WORKDIR /app

COPY . .

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Generate Prisma client
RUN pnpm exec prisma generate --schema=./prisma/schema.prisma
RUN find node_modules/.prisma -type f | head -5

# Build the project
RUN pnpm run build:all

# Use the SAME base image (node:22-slim) to ensure Prisma binaries are compatible
FROM node:22-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends bash openssl \
	&& rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/pnpm-workspace.yaml .
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/wait-for-it.sh .
COPY --from=builder /app/init.sh .

# Copy the entire node_modules to preserve all symlinks exactly
COPY --from=builder /app/node_modules /app/node_modules

# Explicitly copy the generated Prisma client
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

RUN chmod +x /app/init.sh /app/wait-for-it.sh

EXPOSE 3030 3031 3069 3070 3032 3033 3034

CMD ["sh", "-c" , "/app/init.sh"]