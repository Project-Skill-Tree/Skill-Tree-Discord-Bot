FROM node:16.14.2-alpine
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
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD ["yarn", "start"]
