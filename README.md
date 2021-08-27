# Kompassen 2.0

## Getting started

### Prerequisities
To start developing you need to install the following dependencies.
- [Docker](https://www.docker.com/get-started)
- [NodeJS](https://nodejs.org/tr/download/package-manager/#macos)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Contact
If you have any issues or anything is unclear, please feel free to contact Jonas Sjödin at [jonas.sjodin@omegapoint.se](jonas.sjodin@omegapoint.se) (2021).

### Development
To start developing, open two terminals and run the following commands.

```bash
# Terminal 1 - The server
$ cd server && docker compose up -d && yarn && yarn reseed && yarn start

# Terminal 2 - The webapp
$ cd webapp && yarn && yarn start
```

## Web App
The client is a React Typescript web application. It uses Material UI as its main component library. On login it authorizes itself with the Azure AD service. The project structure consists of larger sections in the `/src/sections` directory, that is a page which can be reached and greeted with the browser. They can also be navigated to with React Router DOM. General components which can be used in multiple sections are available in the `/src/components` directory and general hooks are available in `/src/hooks`. Application wide state is handled with Redux and its content is available in `/src/reducers`.

## Server
The server is a NodeJS based express server which communicates with a PostgreSQL backend. The database can be started with `docker compose up -d`. It can be seeded with `yarn reseed` which rollbacks the database, migrates the latest table layout and seeds it with dummy data. The server can then be started with `yarn start`. 

### Database
The database is built using `Knex` database migrations which allows for seemless database schema upgrades without requiring manual labour. Schema upgrades should be made by creating a new file (i.e. if 11_create_some_table is the newest, name next file 12_add_column_to_some_table) and not by editing the existing files. If that is done, a manual schema upgrade has to be performed on the production database which is not ideal. So remember, never edit these files if you do not know what you are doing, only create new ones. 

When developing you may sometimes want to restart with a fresh development database. This can be done with the following command. It deletes all old project containers and volumes. Then it starts the database, migrates the tables and seeds them and lastly starts the server.

```bash
docker compose rm -sf; docker volume rm server_pgdata; docker compose up -d && yarn reseed && yarn start
```

To access the development postgres database, connect your postgres client to port 15432 and the credentials available in the docker-compose.yml file. You can also use the following command. 
```bash
docker compose exec postgres psql -U username kompassen2
```

### Server
The express server is configured with a configuration file in the `/src/config` directory. It consists of a REST API and a Socket IO Websocket API for realt time updates. The `/src/handlers` directory controls the endpoint handlers and their input validation which is done by the `Joi` library. The handlers connects to the database with the database functions available in the `/src/database` directory. Data in `/lib/{contants,types.ts}` is shared between the server and webapp with the `copy_types.sh` script which is available in the project root.

## Infrastructure
The application is designed to run on Azure and is automatically setup with the Infrastructure as Code tool Terraform. The deployment should **NOT** be edited manually with az cli or in the cloud portal but by editing the terraform files. If done this way, the production environment will always be reproducible. In the `/infrastructure` directory there are two subdirectories, `/infrastructure/setup` and `/infrastructure/production`. The terraform configuration is split up in these two directories because of their separate use case. The `setup` directory handles setting up login and CICD funcitonality, such as Azure AD and Github actions secrets. This functionality requires more extensive authorization which we do not want to be available in our CICD pipelines. The `production` directory handles setting up and configuration of the production code such as the web app, server and database. 

### Setup
The `setup` directory creates a service principal, an Azure AD application, a backend storage account for the production terraform configuration and some Github Actions secrets. It can only be applied by Azure users with Owner role. It should not be used to develop the production infrastructure, just to setup a complete new production environment and to initialise the CICD pipelines.

```bash
GITHUB_TOKEN=<some_git_token>
TF_VAR_subscription=<some_azure_subscription>
```

Most developers will never need apply or edit these files. Only do this if you know what you are doing. 

If you are setting up a completely new production environment you first need to install the azure CLI az. You can then run the `initAzureStorage.sh` script which sets up a new resource group and a storage accounts which acts as a backend for the setup Terraform environment. If this script is run with the `-d` or `--delete` flag, the terraform state of the setup environment is deleted. Once again, only do this if you really want to remove all production code or know what you are doing.

### Production 
The `production` directory sets up the production infrastructure which consists of a Azure Container Registry (ACR), two Azure App Services (backend + frontend) and a Postgres database. It can be run with the Contributer role and its state is automatically applied on each merge to main in CICD pipelines.

If you want to apply the terraform state manually it can be done by running
```bash
terraform apply
```

### CICD
CICD is handled with Github Actions. Automatic linting and formatting checks are run on each commit to all branches that aren't `main`. When something is pushed to or pulled into `main`, the terraform configuration is applied and the webapp and server containers are built and pushed to production, updating the current production instances. 

## Azure AD user role assignment
In the Azure console, roles are assigned to users under `Azure Active Directory / Enterprise applications`. Then find the application "kompassen2-ad" and assign the role under `Users and Groups`.

