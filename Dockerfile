from node:6.9-alpine

maintainer James Kyburz "james.kyburz@gmail.com"

RUN apk --no-cache add --virtual .build-deps \
        g++ \
        gcc \
        libgcc \
        linux-headers \
        make \
        python

WORKDIR /usr/src/app
ADD package.json /usr/src/app/
RUN npm install --production
ADD . /usr/src/app

RUN apk del .build-deps

CMD npm start

EXPOSE 2016
EXPOSE 2017
