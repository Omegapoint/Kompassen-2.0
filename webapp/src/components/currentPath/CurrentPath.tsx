import { makeStyles } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { ReactElement } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { isAdmin } from '../../lib/Lib';
import { AppRoute, appRoutes, notFound } from '../../router/Router';

const sortedRoutes = [...appRoutes].sort((e, e1) => (e.path.length > e1.path.length ? 1 : -1));

const findCurrentPaths = (
  path: string,
  routes: AppRoute[],
  foundRoutes: AppRoute[]
): AppRoute[] => {
  const found = routes
    .filter((route) => (route.admin && isAdmin()) || !route.admin)
    .find((route) => {
      if (route.name === notFound.name) return false;
      const isStart = path.startsWith(route.path) || matchPath(path, route.path);
      const isRoot = route.path === '/';
      const isLongerPath = path.length > route.path.length && path[route.path.length] === '/';
      const isSamePath = path === route.path || matchPath(path, route.path);
      return isStart && (isRoot || isLongerPath || isSamePath);
    });

  if (!found) return foundRoutes;
  const routesNotFoundYet = routes.filter((route) => route !== found);
  const currentFoundRoutes = [...foundRoutes, found];
  return findCurrentPaths(path, routesNotFoundYet, currentFoundRoutes);
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    height: '25px',
    alignItems: 'center',
    '& *': {
      lineHeight: '1',
    },
  },
}));

const CurrentPath = (): ReactElement => {
  const classes = useStyles();
  const location = useLocation();
  const { pathname } = location;

  const foundRoutes = findCurrentPaths(pathname, sortedRoutes, []);

  const currentRoute =
    foundRoutes.length === 1 && !matchPath(pathname, notFound.path)?.isExact
      ? notFound
      : foundRoutes[foundRoutes.length - 1];

  const parentRoutes =
    currentRoute === notFound ? foundRoutes : foundRoutes.slice(0, foundRoutes.length - 1);

  return (
    <Breadcrumbs className={classes.container}>
      {parentRoutes.map((e) => (
        <Link variant="subtitle2" key={e.path} component={NavLink} to={e.path} color="inherit">
          {e.name}
        </Link>
      ))}
      <Typography variant="subtitle2" color="textPrimary">
        {currentRoute.name}
      </Typography>
    </Breadcrumbs>
  );
};

export default CurrentPath;
