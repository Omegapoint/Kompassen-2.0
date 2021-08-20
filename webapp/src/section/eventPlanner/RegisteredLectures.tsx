import { makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import LectureCard from './LectureCard';

interface RegisteredLecturesProps {
  lectures: Lecture[];
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
    gridTemplateColumns: '1fr 1fr 1fr',
  },
}));

const RegisteredLectures = ({ lectures }: RegisteredLecturesProps): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {lectures.map((e) => (
        <LectureCard key={e.id} lecture={e} edit />
      ))}
    </div>
  );
};

export default RegisteredLectures;
