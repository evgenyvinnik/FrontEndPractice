FROM node:12.15-alpine3.11

WORKDIR /home/node/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . .