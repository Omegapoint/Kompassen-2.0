import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import Content from '../components/content';

const routes = [
  {
    name: 'Anmäl pass',
    path: '/class/create',
  },
  {
    name: 'Mina pass',
    path: '/class',
  },
  {
    name: 'Home',
    path: '/',
  },
];

const Router = (): ReactElement => (
  <Switch>
    {routes.map((e) => (
      <Route path={e.path} key={e.path}>
        <Content>{e.name}</Content>
      </Route>
    ))}
  </Switch>
);

export default Router;
