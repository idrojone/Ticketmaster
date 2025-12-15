FROM node:22-alpine AS builder

RUN apk add --no-cache bash
RUN apk add --no-cache pnpm

WORKDIR /app

COPY . .
# COPY DashboardAdmin/.env ./

RUN pnpm install \
	&& npx prisma generate fastify \
	&& mkdir -p node_modules/@prisma/client/.prisma \
	&& cp -r node_modules/.prisma/client node_modules/@prisma/client/.prisma/ || true
RUN pnpm run build

FROM node:22-alpine AS runner

RUN apk add --no-cache bash
RUN apk add --no-cache pnpm

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/prisma.config.ts .
COPY --from=builder /app/wait-for-it.sh .
COPY --from=builder /app/init.sh .
COPY --from=builder /app/node_modules ./node_modules

RUN chmod +x init.sh
RUN chmod +x wait-for-it.sh

EXPOSE 3010

CMD ["sh", "-c", "/app/init.sh"]