import { FC, ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import Content from '../components/content/Content';
import { isAdmin } from '../lib/Lib';
import ConfirmLecture from '../section/confirmLecture/ConfirmLecture';
import EventPlanner from '../section/eventPlanner/EventPlanner';
import Events from '../section/events/Events';
import Home from '../section/home/Home';
import Lecture from '../section/lecture/Lecture';
import MyLectures from '../section/myLectures/MyLectures';
import PageNotFound from '../section/pageNotFound/PageNotFound';
import Settings from '../section/settings/Settings';

export interface AppRoute {
  name: string;
  path: string;
  Component: FC;
  notExact?: boolean;
  admin?: boolean;
}

export const notFound: AppRoute = {
  name: 'Sidan kunde inte hittas',
  path: '/',
  Component: PageNotFound,
  notExact: true,
};

export const appRoutes: AppRoute[] = [
  {
    name: 'Anmäl pass',
    path: '/lecture/create',
    Component: Lecture,
  },
  {
    name: 'Redigera pass',
    path: '/lecture/edit/:id',
    Component: Lecture,
  },
  {
    name: 'Passbekräftelse',
    path: '/lecture/:id/confirm',
    Component: ConfirmLecture,
  },
  {
    name: 'Mina pass',
    path: '/lecture/user',
    Component: MyLectures,
  },
  {
    name: 'Inställningar',
    path: '/settings',
    Component: Settings,
  },
  {
    name: 'Planera event',
    path: '/events/:id',
    Component: EventPlanner,
    admin: true,
  },
  {
    name: 'Planering',
    path: '/events',
    Component: Events,
    admin: true,
  },
  {
    name: 'Start',
    path: '/',
    Component: Home,
  },
  notFound,
];

const Router = (): ReactElement => (
  <Switch>
    {appRoutes
      .filter((route) => (route.admin && isAdmin()) || !route.admin)
      .map((route) => (
        <Route path={route.path} key={route.path + route.name} exact={!route.notExact}>
          <Content>
            <route.Component />
          </Content>
        </Route>
      ))}
  </Switch>
);

export default Router;
