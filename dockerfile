FROM        node:16.13.2-alpine
LABEL       author="DEFRA"

ENV         PORT=3000

WORKDIR     /usr/src/packages/credit-sales-web-application

COPY        package*.json ./
COPY        . .
RUN         npm ci

EXPOSE      $PORT

CMD         [ "npm", "start" ]
