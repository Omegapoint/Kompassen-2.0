import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { getLecture } from '../../api/Api';
import FormWrapper from '../../components/formWrapper/FormWrapper';
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
      <FormWrapper fn={getLecture} name="lecture">
        <LectureForm />
      </FormWrapper>
    </div>
  );
};
export default Lecture;
