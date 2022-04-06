import { FC, ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import Content from '../components/content/Content';
import OPKoKoPlanner from '../components/opkokoPlanner/opkokoPlanner';
import { isAdmin } from '../lib/Lib';
import ConfirmLectureCompetenceday from '../section/confirmLecture/ConfirmLectureCompetenceday';
import ConfirmLectureOPKoKo from '../section/confirmLecture/ConfirmLectureOPKoKo';
import CompetencedayPlanner from '../section/competencedayPlanner/CompetencedayPlanner';
import CompetenceDays from '../section/competenceDays/CompetenceDays';
import CompetencedayViewer from '../section/competencedayViewer/CompetencedayViewer';
import Home from '../section/home/Home';
import CompetencedayLecture from '../section/competencedayLecture/CompetencedayLecture';
import OPKoKoLecture from '../section/competencedayLecture/OPKoKoLecture';
import MyLectures from '../section/myLectures/MyLectures';
import OPKoKoInfo from '../section/OPKoKoInfo/OPKoKoInfo';
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
    name: 'Start',
    path: '/',
    Component: Home,
  },
  {
    name: 'Anmäl kompetensdagsbidrag',
    path: '/lecture/competenceday/create',
    Component: CompetencedayLecture,
  },
  {
    name: 'Anmäl OPKoKo-bidrag',
    path: '/lecture/OPKoKo/create',
    Component: OPKoKoLecture,
  },
  {
    name: 'Redigera kompetensdagsbidrag',
    path: '/lecture/competenceday/edit/:id',
    Component: CompetencedayLecture,
  },
  {
    name: 'Redigera bidrag',
    path: '/lecture/OPKoKo/edit/:id',
    Component: OPKoKoLecture,
  },
  {
    name: 'Inskickat bidrag till kompetensdag',
    path: '/lecture/competenceday/:id/confirm',
    Component: ConfirmLectureCompetenceday,
  },
  {
    name: 'Inskickat bidrag till OPKoKo',
    path: '/lecture/OPKoKo/:id/confirm',
    Component: ConfirmLectureOPKoKo,
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
    name: 'Visa Kompetensdag',
    path: '/events/competenceday/view/:id',
    Component: CompetencedayViewer,
  },
  {
    name: 'Hantera Kompetensdag',
    path: '/events/competenceday/:id',
    Component: CompetencedayPlanner,
    admin: true,
  },
  {
    name: 'Hantera Kompetensdagar',
    path: '/events/competencedays',
    Component: CompetenceDays,
    admin: true,
  },
  {
    name: 'Hantera OPKoKos',
    path: '/events/opkokos',
    Component: OPKoKoPlanner
  },
  {
    name: 'OPKoKoInfo',
    path: '/OPKoKoinfo',
    Component: OPKoKoInfo,
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
