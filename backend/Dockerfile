FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json nest-cli.json ./
COPY src ./src/
RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

COPY --chown=nestjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
RUN node /app/dist/seed.js

USER nestjs

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
