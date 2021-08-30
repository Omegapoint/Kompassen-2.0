# Stage 0 - Setup
FROM node:alpine3.14 as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY tsconfig.json ./
COPY src ./src
COPY db ./db
RUN yarn lint:check
RUN yarn format:check

RUN yarn build

## Stage 1 - Migration
#FROM node:alpine3.14 as migration-stage
#ENV NODE_ENV=production
#WORKDIR /app
#COPY --from=build-stage /app/ ./
#COPY db ./db
#CMD ["sh", "-c", "yarn knex:migrate:latest"]

# Stage 2 - Production
FROM node:alpine3.14 as prod-stage
ENV NODE_ENV=production
WORKDIR /app
COPY ./package.json ./yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=build-stage /app/build/db ./db
COPY --from=build-stage /app/build/src ./

CMD ["sh", "-c", "yarn knex:migrate:latest; yarn start"]
