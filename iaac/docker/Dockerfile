FROM node:alpine AS builder
ARG env=test

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . /app
RUN npm run build

FROM nginx:alpine
# COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/* /usr/share/nginx/html

EXPOSE 4010
