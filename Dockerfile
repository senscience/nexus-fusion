FROM timbru31/node-alpine-git:22 as builder

WORKDIR /tmp/nexus-fusion
COPY . /tmp/nexus-fusion
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

RUN yarn
RUN NODE_OPTIONS=--max-old-space-size=8192 yarn build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /opt/nexus
COPY --from=builder /tmp/nexus-fusion/dist /opt/nexus/dist
EXPOSE 8000
ENTRYPOINT ["node", "dist/index.mjs"]
