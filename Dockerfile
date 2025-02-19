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

# generate again to have the client available
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

EXPOSE 8080
CMD ["node", "./dist/index.js"]

