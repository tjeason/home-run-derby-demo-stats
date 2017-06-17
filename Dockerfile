FROM node:0.12-onbuild

EXPOSE 3000

RUN mkdir /app

ADD . /app

WORKDIR /app

RUN   \
  npm install -g grunt-cli && \
  npm install && \
  grunt

CMD ["node", "app.js"]
