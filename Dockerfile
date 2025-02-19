FROM node:22.14.0-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN yarn install
COPY . .

# generate prisma client so build has the custom types for repository
RUN npx prisma generate \ 
    && yarn run build

FROM node:22.14.0-alpine

WORKDIR /app

COPY package.json ./
RUN NODE_ENV=production yarn install

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# generate again to have the client available
RUN npx prisma generate

# run migrations to ensure the db is up to date
# TODO: possibly move this to a separate step or out of the dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

