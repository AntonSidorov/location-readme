FROM nginx:alpine
# TODO: this

RUN apk add --no-cache curl

WORKDIR /usr/lrf/app

COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf
COPY ./dist/location-readme ./

EXPOSE 8000

HEALTHCHECK CMD curl -sf "http://localhost:8000/"
