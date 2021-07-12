import { FC, ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import Content from '../components/content/Content';
import Home from '../section/home/Home';
import Settings from '../section/settings/Settings';

export interface AppRoute {
  name: string;
  path: string;
  Component: FC;
  notExact?: boolean;
}

export const appRoutes: AppRoute[] = [
  {
    name: 'Anmäl pass',
    path: '/class/create',
    Component: Home,
  },
  {
    name: 'Mina pass',
    path: '/class',
    Component: Home,
  },
  {
    name: 'Inställningar',
    path: '/settings',
    Component: Settings,
  },
  {
    name: 'Start',
    path: '/',
    Component: Home,
  },
];

const Router = (): ReactElement => (
  <Switch>
    {appRoutes.map((e) => (
      <Route path={e.path} key={e.path} exact={!e.notExact}>
        <Content>
          <e.Component />
        </Content>
      </Route>
    ))}
  </Switch>
);

export default Router;
