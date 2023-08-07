FROM nginx:latest

RUN mkdir -p /usr/share/nginx/react

COPY ./nginx/build/* /usr/share/nginx/react
COPY ./nginx/html/* /usr/share/nginx/html
COPY ./nginx/include/* /etc/nginx
COPY ./nginx/ssl/* /etc/ssl

WORKDIR /etc/nginx/