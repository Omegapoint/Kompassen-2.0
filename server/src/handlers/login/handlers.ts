import { Request, Response } from 'express';
import config from '../../config/config';

const loginInfoHandler = (req: Request, res: Response): void => {
  res.send({
    clientId: config.oidc.azure.clientID,
    authority: `https://login.microsoftonline.com/${config.oidc.azure.tenantID}`,
    redirectUri: config.oidc.azure.redirectUrl,
  });
};

const login = {
  loginInfoHandler,
};

export default login;
