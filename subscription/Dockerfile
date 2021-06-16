FROM node:14-alpine3.11 AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps

COPY . .

RUN npm run build

RUN npm run format

RUN npm prune --production




FROM node:14-alpine3.11 as production

RUN apk add --update --no-cache curl dumb-init

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

#USER node

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/dist ./dist
COPY --chown=node:node --from=development /usr/src/app/package*.json .

EXPOSE 50055

USER node

CMD ["dumb-init", "node", "dist/main"]