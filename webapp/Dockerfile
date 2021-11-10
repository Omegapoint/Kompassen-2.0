# Stage 0 - Building
FROM node:16.13-alpine as build-stage
ENV GENERATE_SOURCEMAP=false
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY tsconfig.json ./
COPY public ./public
COPY src ./src

RUN ["yarn", "lint:check"]
RUN ["yarn", "format:check"]

RUN yarn build

# Stage 1 - Production
FROM nginx:1.21.1-alpine as prod-stage

COPY --from=build-stage /app/build/ /var/www/html
COPY nginx.conf /etc/nginx/temp/

CMD ["/bin/sh", "-c", "export PORT=${PORT:-80}; echo listening at http://localhost:$PORT; envsubst '$PORT $API_SERVER' < /etc/nginx/temp/nginx.conf > /etc/nginx/nginx.conf && cat /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]

