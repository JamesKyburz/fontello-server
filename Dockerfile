from node:6.9-alpine

maintainer James Kyburz "james.kyburz@gmail.com"

CMD npm start

WORKDIR /usr/src/app
ADD package.json /usr/src/app/
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python && \
    npm install --production && \
    apk del native-deps
ADD . /usr/src/app

EXPOSE 2016
EXPOSE 2017
