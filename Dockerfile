FROM node:16.18-alpine AS builder

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app

COPY . /app
RUN npm install --force -prefer-offline \
    && npm run build:qa

EXPOSE 8080

FROM nginx:alpine
# COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/* /usr/share/nginx/html


