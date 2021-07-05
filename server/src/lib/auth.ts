import jwt, {
  JwtHeader,
  JwtPayload,
  SigningKeyCallback,
  VerifyErrors,
  VerifyOptions,
} from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import config, { logger } from '../config/config';

const { clientID, tenantID } = config.oidc.azure;

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenantID}/discovery/keys?appid=${clientID}`,
});

function getKey(header: JwtHeader, cb: SigningKeyCallback) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.getSigningKey(header.kid as string, (err: Error | null, key: any) => {
    cb(null, key.publicKey || key.rsaPublicKey);
  });
}

const options: VerifyOptions = {
  audience: clientID,
  issuer: `https://sts.windows.net/${tenantID}/`,
  algorithms: ['RS256'],
};

async function checkSession(accessToken: string): Promise<JwtPayload | null> {
  try {
    await new Promise((resolve, reject) => {
      jwt.verify(
        accessToken,
        getKey,
        options,
        (err: VerifyErrors | null, decoded: JwtPayload | undefined) =>
          err ? reject(err) : resolve(decoded?.email)
      );
    });

    return (await jwt.decode(accessToken)) as JwtPayload;
  } catch (e) {
    logger.error(e);
    return null;
  }
}
export default checkSession;
