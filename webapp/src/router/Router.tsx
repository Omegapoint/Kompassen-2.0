import { FC, ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import Content from '../components/content/Content';
import ConfirmLecture from '../section/confirmLecture/ConfirmLecture';
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
}

export const appRoutes: AppRoute[] = [
  {
    name: 'Anmäl pass',
    path: '/lecture/create',
    Component: Lecture,
  },
  {
    name: 'Anmäl pass',
    path: '/lecture/edit/:id',
    Component: Lecture,
  },
  {
    name: 'Anmäl pass',
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
    <Content>
      <Route path="/" component={PageNotFound} />
    </Content>
  </Switch>
);

export default Router;
