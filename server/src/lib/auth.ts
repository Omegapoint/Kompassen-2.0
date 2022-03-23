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
  //issuer: `https://sts.windows.net/${tenantID}/`,
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
    const token = jwt.decode(accessToken) as JwtPayload;
    const issuer = token.iss;
    if (issuer !== undefined) {
      const url = issuer.split('https://sts.windows.net/');
      const id = url[1].replace('/', '');
      console.log(id);
      if (
        id === '3b68c6c1-04d4-4e86-875f-e48fa80b9529' ||
        id === 'eb7b2ab3-ac72-410a-ba09-83b026505835'
      ) {
        console.log('Weeey success');
      } else {
        throw new Error('Not valid issuer');
      }
    }

    https: return (await jwt.decode(accessToken)) as JwtPayload;
  } catch (e) {
    logger.error(e);
    return null;
  }
}
export default checkSession;
