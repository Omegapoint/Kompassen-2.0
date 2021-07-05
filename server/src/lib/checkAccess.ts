import { authConfig, AuthPath } from '../config/config';

export const matchesPath = (uri: string, method: string, e: AuthPath): boolean => {
  const regexp = e.path
    .replace(new RegExp(/(?=:).*?(?=\/)/.source, 'g'), '((?!/).)+')
    .replace(new RegExp(/:.*/.source, 'g'), '((?!/).)+');

  const matchNoTrailingSlash = new RegExp(`^${regexp}$`).test(uri);
  const matchTrailingSlash = new RegExp(`^${regexp}/$`).test(uri);
  return (matchNoTrailingSlash || matchTrailingSlash) && e.method === method;
};

function hasAccess(uri: string, method: string, role: string | null): boolean | null {
  if (authConfig.all === role) {
    return !!authConfig.endpoints.find((e) => matchesPath(uri, method, e));
  }

  if (!authConfig.endpoints) return false;

  let matched = false;
  const access = authConfig.endpoints.find((e) => {
    try {
      const matchesp = matchesPath(uri, method, e);
      if (matchesp) {
        matched = true;
        if ((role === null && e.open) || (role && e.roles?.includes(role))) {
          return true;
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  });

  if (matched && !access) return null;
  return !!access;
}

export default hasAccess;
