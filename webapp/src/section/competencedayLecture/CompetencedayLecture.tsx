import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { getLecture } from '../../api/Api';
import FormWrapper from '../../components/formWrapper/FormWrapper';
import LectureForm from '../../components/lectureForm/LectureForm';

const Lecture = (): ReactElement => (
  <Box sx={{ width: '50vw' }}>
    <FormWrapper fn={getLecture} name="lecture">
      <LectureForm />
    </FormWrapper>
  </Box>
);
export default Lecture;
