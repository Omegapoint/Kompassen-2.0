# Stage 0 - Setup
FROM node:alpine3.14 as build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY tsconfig.json ./
COPY src ./src
COPY db ./db
RUN yarn build

CMD /bin/sh -c "yarn lint:check && yarn format:check && yarn test"

# Stage 2 - Production
FROM node:alpine3.14 as prod
ENV NODE_ENV=production
WORKDIR /app
COPY ./package.json ./yarn.lock ./
COPY --from=build /app/node_modules ./node_modules
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/build/db ./db
COPY --from=build /app/build/src ./

CMD ["sh", "-c", "yarn knex:migrate:latest; yarn start"]
