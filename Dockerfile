FROM node:16.14.2-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN apk add chromium
RUN npm install && npm cache clean --force
COPY ./ /usr/src/app
CMD ["npm", "start"]
