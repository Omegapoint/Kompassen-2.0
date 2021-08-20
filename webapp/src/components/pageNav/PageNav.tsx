import { makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import NavItem from './NavItem';

const useStyles = makeStyles(() => ({
  nav: {
    display: 'grid',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    justifyItems: 'center',
  },
}));

export interface INavItem<T> {
  name: T;
  title: string;
}

export type ILectureItems<T extends string> = {
  [key in T]: Lecture[];
};

interface IMyLecturesNav<T extends string> {
  active: T;
  setActive: (active: T) => void;
  navItems: INavItem<T>[];
}

function PageNav<T extends string>({
  active,
  setActive,
  navItems,
}: IMyLecturesNav<T>): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.nav}>
      {navItems.map((e) => (
        <NavItem
          key={e.name}
          active={active === e.name}
          title={e.title}
          handleClick={() => setActive(e.name)}
        />
      ))}
    </div>
  );
}

export default PageNav;
