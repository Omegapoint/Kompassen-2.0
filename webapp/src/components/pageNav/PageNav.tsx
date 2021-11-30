import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import NavItem from './NavItem';

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
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoColumns: '1fr',
        gridAutoFlow: 'column',
        justifyItems: 'center',
      }}
    >
      {navItems.map((e) => (
        <NavItem
          key={e.name}
          active={active === e.name}
          title={e.title}
          handleClick={() => setActive(e.name)}
        />
      ))}
    </Box>
  );
}

export default PageNav;
