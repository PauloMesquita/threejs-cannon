FROM node:lts-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm install -q

COPY . /usr/src/app
RUN rm -rf build
RUN npm run build
RUN rm -rf src

CMD ["npx", "serve", "build", "-l", "7001"]
EXPOSE 7001