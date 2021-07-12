import winston from 'winston';

const { POSTGRES_URL, PORT, OIDC_CLIENT_ID, OIDC_TENANT_ID } = process.env;

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const config = {
  postgresUrl: POSTGRES_URL || 'postgresql://username:password@localhost:15432/kompassen2',
  postgres: {
    host: 'localhost',
    port: 15432,
    user: 'username',
    password: 'password',
    database: 'kompassen2',
  },
  port: PORT || '8080',
  oidc: {
    azure: {
      clientID: OIDC_CLIENT_ID || '956aafda-ca44-49fd-8de7-144b7ed08054',
      tenantID: OIDC_TENANT_ID || '3b68c6c1-04d4-4e86-875f-e48fa80b9529',
      redirectUrl: 'http://localhost:3000/',
    },
  },
};

export interface AuthPath {
  path: string;
  method: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'OPTIONS';
  roles?: string[];
  open?: boolean;
}

export interface AuthConfig {
  all?: string;
  endpoints: AuthPath[];
}

export const authConfig: AuthConfig = {
  all: 'admin',
  endpoints: [
    {
      path: '/user',
      method: 'POST',
      roles: ['user'],
    },
    {
      path: '/user',
      method: 'GET',
      roles: ['user'],
    },
    {
      path: '/event',
      method: 'POST',
      roles: ['user'],
    },
    {
      path: '/event',
      method: 'PUT',
      roles: ['user'],
    },
    {
      path: '/event',
      method: 'GET',
      roles: ['user'],
    },
    {
      path: '/event/:id',
      method: 'GET',
      roles: ['user'],
    },
    {
      path: '/event',
      method: 'DELETE',
      roles: ['user'],
    },
    {
      path: '/login/config',
      method: 'GET',
      open: true,
    },
  ],
};

export default config;
