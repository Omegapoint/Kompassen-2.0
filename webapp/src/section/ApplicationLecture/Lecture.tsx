import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import LectureForm from '../../components/lectureForm/LectureForm';
import FormWrapper from '../../components/formWrapper/FormWrapper';
import { useGetLecture } from '../../lib/Hooks';

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
      <FormWrapper useHook={useGetLecture}>
        <LectureForm />
      </FormWrapper>
    </div>
  );
};
export default Lecture;
