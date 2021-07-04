import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import LectureForm from '../../components/lectureForm/LectureForm';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '50vw',
    },
  })
);

const Lecture = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <LectureForm pageTitle="Anmäl pass till kompetensdag" />
    </div>
  );
};
export default Lecture;
