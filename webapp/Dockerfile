# Stage 0 - Building
FROM node:16.13-alpine as build
ENV GENERATE_SOURCEMAP=false
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY tsconfig.json ./
COPY public ./public
COPY src ./src
RUN yarn build

CMD /bin/sh -c "yarn lint:check && yarn format:check && yarn test"

# Stage 1 - Production
FROM nginx:1.21.1-alpine as prod

COPY nginx.conf /etc/nginx/temp/
COPY --from=build /app/build/ /var/www/html

CMD ["/bin/sh", "-c", "export PORT=${PORT:-80}; echo listening at http://localhost:$PORT; envsubst '$PORT $API_SERVER' < /etc/nginx/temp/nginx.conf > /etc/nginx/nginx.conf && cat /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
