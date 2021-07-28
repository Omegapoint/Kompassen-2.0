# Kompassen 2.0

## Getting started

### Prerequisities
To start developing you need to install the following dependencies.
- [Docker](https://www.docker.com/get-started)
- [NodeJS](https://nodejs.org/tr/download/package-manager/#macos)
- [Yarn](https://yarnpkg.com/getting-started/install)
  
## Web App
The client is a React Typescript web application. It uses Material UI as its main component library.

## Server
The server is a NodeJS based express server which communicates with a PostgreSQL backend. The database can be started with `docker compose up -d`. It can be seeded with `yarn reseed` which rollbacks the database, migrates the latest table layout and seeds it with dummy data. The server can then be started with `yarn start`.

## Infrastructure
The application is designed to run on Azure and is automatically setup with Terraform. The deployment should **NOT** be edited manually with az cli or the cloud portal. In the `/infrastructure` directory there are two subdirectories, `setup` and `production`.

### Setup
The `setup` directory creates a service principal and some Github Actions secrets. It can only be applied by the Owner role. It should not be used to develop the production infrastructure, just to setup the required remote development environments. It requires that the following environment variables are set: 

```bash
GITHUB_TOKEN=<some_git_token>
TF_VAR_subscription=<some_azure_subscription>
```

### Production
The `production` directory sets up the production infrastructure which consists of an App Service for the backend, a Static Site for the frontend and a Cosmos DB backend. It can be run with the Contributer role and its state is automatically applied on each merge to master.

## User assignment
In the Azure console, roles are assigned to users under `Azure Active Directory / Enterprise applications`. The find your application and assign the role under `Users and Groups`.
  