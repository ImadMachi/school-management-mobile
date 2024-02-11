FROM node:20-alpine3.18

WORKDIR /app

COPY package.json ./
COPY app.json ./

RUN yarn global add @expo/cli @expo/ngrok@^4.1.0

RUN yarn install

COPY . .

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006
EXPOSE 8081


CMD npx expo start --tunnel