import { FC, ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import Content from '../components/content/Content';
import { isAdmin } from '../lib/Lib';
import ConfirmLecture from '../section/confirmLecture/ConfirmLecture';
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
  {
    name: 'Not Found',
    path: '/',
    Component: PageNotFound,
    notExact: true,
  },
];

const Router = (): ReactElement => (
  <Switch>
    {appRoutes.map((e) =>
      e.admin && !isAdmin() ? (
        <></>
      ) : (
        <Route path={e.path} key={e.path + e.name} exact={!e.notExact}>
          <Content>
            <e.Component />
          </Content>
        </Route>
      )
    )}
  </Switch>
);

// <<<<<<< HEAD
//   {appRoutes.map((e) => (
//     <Route path={e.path} key={e.path} exact={!e.notExact}>
//       <Content>
//         <e.Component />
//       </Content>
//     </Route>
//   ))}
// <Content>
// <Route path="/" component={PageNotFound} />
// </Content>
// =======

export default Router;
