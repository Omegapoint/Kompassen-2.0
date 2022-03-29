import winston from 'winston';

const {
  PG_USERNAME,
  PG_PASSWORD,
  PG_HOST,
  PG_PORT,
  PG_DATABASE,
  PG_SSL,
  PORT,
  OIDC_CLIENT_ID,
  OIDC_TENANT_ID_OP,
  OIDC_TENANT_ID_IBMB,
  OIDC_REDIRECT_URL,
} = process.env;

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const config = {
  postgres: {
    user: PG_USERNAME || 'username',
    password: PG_PASSWORD || 'password',
    host: PG_HOST || 'localhost',
    port: parseInt(PG_PORT || '0', 10) || 15432,
    database: PG_DATABASE || 'kompassen2',
    ssl: !!parseInt(PG_SSL || '0', 10),
  },
  port: PORT || '8080',
  oidc: {
    azure: {
      clientID: OIDC_CLIENT_ID || '7dbe946a-2e34-4739-9734-84768447312f',
      tenantIDOP: OIDC_TENANT_ID_OP || '3b68c6c1-04d4-4e86-875f-e48fa80b9529',
      tenantIDIBMB: OIDC_TENANT_ID_IBMB || '2db9b5b0-add1-47fc-a0ca-147745edf2f9',
      redirectUrl: OIDC_REDIRECT_URL || 'http://localhost:3000/',
    },
  },
};

export default config;
