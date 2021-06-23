import { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core';
import { padding } from '../../theme/Theme';
import Lecture, { LectureKind } from './lecture';

const date1 = new Date();
date1.setDate(date1.getDate() - 1);

const date2 = new Date();
date2.setDate(date2.getDate() - 120);

const date3 = new Date();
date3.setDate(date3.getDate() - 50);

interface MappableClass {
  name: string;
  location: string;
  date: Date;
  kind: LectureKind;
}

const mappableClasses: MappableClass[] = [
  {
    name: 'Agil Filosofi 101',
    location: 'Stockholm',
    date: date1,
    kind: 'cloud',
  },
  {
    name: 'Agil Filosofi 101',
    location: 'Stockholm',
    date: date2,
    kind: 'sun',
  },
  {
    name: 'Agil Filosofi 101',
    location: 'Stockholm',
    date: date3,
    kind: 'cloud',
  },
];

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
  },
}));

const LatestLectures = (): ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {mappableClasses.map((e) => (
        <Lecture
          key={e.name + e.kind + e.date.toString()}
          name={e.name}
          location={e.location}
          date={e.date}
          kind={e.kind}
        />
      ))}
    </div>
  );
};

export default LatestLectures;
