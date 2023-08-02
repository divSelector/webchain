FROM nginx:latest

RUN mkdir -p /usr/share/nginx/react

COPY ./nginx/build/* /usr/share/nginx/react
COPY ./nginx/html/* /usr/share/nginx/html

WORKDIR /usr/share/nginx/