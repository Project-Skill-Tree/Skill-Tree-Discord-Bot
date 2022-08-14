FROM node:16.14.2-alpine3.15
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app/

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

RUN yarn install --production
RUN yarn cache clean
ENV NODE_ENV development
ENV HEALTH_PORT 80
EXPOSE 80
EXPOSE 443

HEALTHCHECK CMD curl --fail http://localhost:80/ || exit 1

CMD ["yarn", "start"]
