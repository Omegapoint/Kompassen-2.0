import { FC, ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import Content from '../components/content/Content';
import { isAdmin } from '../lib/Lib';
import ConfirmLecture from '../section/confirmLecture/ConfirmLecture';
import ConfirmLectureOpKoKo from '../section/confirmLecture/ConfirmLectureOpKoKo';
import EventPlanner from '../section/eventPlanner/EventPlanner';
import Events from '../section/events/Events';
import EventViewer from '../section/eventViewer/EventViewer';
import Home from '../section/home/Home';
import HomeOpKoKo from '../section/home/HomeOpKoKo';
import Lecture from '../section/lecture/Lecture';
import OpKoKoLecture from '../section/lecture/OpKoKoLecture';
import MyLectures from '../section/myLectures/MyLectures';
import OpKoKoInfo from '../section/opkokoinfo/OpKoKoInfo';
import PageNotFound from '../section/pageNotFound/PageNotFound';
import ProfileWrapper from '../section/Profile/ProfileWrapper';

export interface AppRoute {
  name: string;
  path: string;
  Component: FC;
  admin?: boolean;
}

export const notFound: AppRoute = {
  name: 'Sidan kunde inte hittas',
  path: '/*',
  Component: PageNotFound,
};

export const appRoutes: AppRoute[] = [
  {
    name: 'Anmäl kompetensdagsbidrag',
    path: '/lecture/create',
    Component: Lecture,
  },
  {
    name: 'Anmäl OPKoKo-bidrag',
    path: '/lecture/OpKoKo/create',
    Component: OpKoKoLecture,
  },
  {
    name: 'Redigera kompetensdagsbidrag',
    path: '/lecture/edit/:id',
    Component: Lecture,
  },
  {
    name: 'Redigera bidrag',
    path: '/lecture/OpKoKo/edit/:id',
    Component: OpKoKoLecture,
  },
  {
    name: 'Inskickat bidrag till kompetensdag',
    path: '/lecture/:id/confirm',
    Component: ConfirmLecture,
  },
  {
    name: 'Inskickat bidrag till OPKoKo',
    path: '/lecture/OpKoKo/:id/confirm',
    Component: ConfirmLectureOpKoKo,
  },
  {
    name: 'Mina inskickade bidrag',
    path: '/lecture/user',
    Component: MyLectures,
  },
  {
    name: 'Min profil',
    path: '/profile',
    Component: ProfileWrapper,
  },
  {
    name: 'Planera event',
    path: '/events/view/:id',
    Component: EventViewer,
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
  {
    name: 'OPKoKo',
    path: '/OpKoKo',
    Component: HomeOpKoKo,
  },
  {
    name: 'OPKoKoInfo',
    path: '/opkokoinfo',
    Component: OpKoKoInfo,
  },
  notFound,
];

const Router = (): ReactElement => (
  <Routes>
    {appRoutes
      .filter((route) => (route.admin && isAdmin()) || !route.admin)
      .map((route) => (
        <Route
          path={route.path}
          key={route.path + route.name}
          element={
            <Content>
              <route.Component />
            </Content>
          }
        />
      ))}
  </Routes>
);

export default Router;
