FROM node:16-alpine

WORKDIR /usr/src/app

COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY nginx.template ./

# install nginx and evsubst
RUN apk add nginx gettext
ARG DOMAIN
# build nginx config and check it's valid
RUN envsubst '$DOMAIN' < "./nginx.template" > "/etc/nginx/nginx.conf"
RUN /usr/sbin/nginx -t

# install frontend dependencies
RUN yarn --cwd ./frontend install
# install backend dependencies
RUN yarn --cwd ./backend install

# add the rest of our app to the fs
COPY . .

# build and place files ready for nginx to serve
RUN yarn --cwd ./frontend build
RUN mkdir -p /var/www/$DOMAIN/html/
RUN cp -r ./frontend/dist/* /var/www/$DOMAIN/html/

# serve files
EXPOSE 80 443
CMD /usr/sbin/nginx -g "daemon off;" & yarn --cwd ./backend prod
