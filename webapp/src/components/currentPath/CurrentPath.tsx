import { ReactElement } from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { NavLink, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { AppRoute, appRoutes } from '../../router/Router';

const sortedRoutes = [...appRoutes].sort((e, e1) => (e.path.length > e1.path.length ? 1 : -1));

const findCurrentPaths = (
  path: string,
  routes: AppRoute[],
  foundRoutes: AppRoute[]
): AppRoute[] => {
  const found = routes.find((route) => {
    const isStart = path.startsWith(route.path);
    const isRoot = route.path === '/';
    const isLongerPath = path.length > route.path.length && path[route.path.length] === '/';
    const isSamePath = path === route.path;
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
  const parentRoutes = foundRoutes.slice(0, foundRoutes.length - 1);
  const currentRoute = foundRoutes[foundRoutes.length - 1];

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
