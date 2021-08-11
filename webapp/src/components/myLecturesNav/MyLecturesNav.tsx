import { makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import NavItem from './NavItem';

const useStyles = makeStyles(() => ({
  nav: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    justifyItems: 'center',
  },
}));

export type INavItemKind = 'future' | 'draft' | 'past';

interface INavItem {
  name: INavItemKind;
  title: string;
}

export interface ILectureItems {
  draft: Lecture[];
  future: Lecture[];
  past: Lecture[];
}

interface IMyLecturesNav {
  active: INavItemKind;
  setActive: (active: INavItemKind) => void;
  items: ILectureItems;
}

const MyLecturesNav = ({ active, setActive, items }: IMyLecturesNav): ReactElement => {
  const classes = useStyles();

  const navItems: INavItem[] = [
    { name: 'future', title: 'Kommande' },
    { name: 'draft', title: 'Utkast' },
    { name: 'past', title: 'Genomförda' },
  ];

  return (
    <div className={classes.nav}>
      {navItems.map((e) => (
        <NavItem
          key={e.name}
          active={active === e.name}
          title={e.title}
          handleClick={() => setActive(e.name)}
          nrOfItems={items[e.name].length}
        />
      ))}
    </div>
  );
};

export default MyLecturesNav;
