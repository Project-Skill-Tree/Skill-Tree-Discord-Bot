FROM node:16.14.2-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app/

RUN yarn install --production
RUN yarn cache clean
ENV NODE_ENV production
ENV HEALTH_PORT 80
EXPOSE 80/tcp
EXPOSE 8080/tcp

HEALTHCHECK CMD curl --fail http://localhost:80/ || exit 1

CMD ["yarn", "start"]
