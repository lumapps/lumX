# syntax=docker/dockerfile:1.0.0-experimental

FROM node:10.16-buster AS builder

WORKDIR /tmp

COPY . .

RUN mkdir -p /root/.ssh \
&&  ssh-keyscan github.com >> ~/.ssh/known_hosts

RUN --mount=type=ssh yarn install \
&&  yarn build:static-site

FROM nginx:1.17

ARG WEBROOT=/var/www

COPY --from=builder /tmp/dist/ui.lumapps.com/ $WEBROOT
COPY .docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR $WEBROOT

RUN touch /var/run/nginx.pid \
&&  chown -R www-data:www-data /var/run/nginx.pid \
&&  chown -R www-data:www-data /var/cache/nginx \
&&  chmod -R 644 $WEBROOT/* \
&&  chmod -R +X $WEBROOT \
&&  chown -R root:www-data $WEBROOT

USER www-data

