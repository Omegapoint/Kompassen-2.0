import React, { FC, ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import Content from '../components/content/Content';
import Home from '../section/home/Home';

export interface AppRoute {
  name: string;
  path: string;
  Component: FC;
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
    name: 'Start',
    path: '/',
    Component: Home,
  },
];

const Router = (): ReactElement => (
  <Switch>
    {appRoutes.map((e) => (
      <Route path={e.path} key={e.path}>
        <Content>
          <e.Component />
        </Content>
      </Route>
    ))}
  </Switch>
);

export default Router;
