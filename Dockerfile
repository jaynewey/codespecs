FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY nginx.template ./

RUN yarn install

RUN apk add nginx gettext
ARG DOMAIN
RUN envsubst '$DOMAIN' < "./nginx.template" > "/etc/nginx/nginx.conf"

COPY . .

EXPOSE 80 443
CMD /usr/sbin/nginx -g "daemon off;" & yarn prod
