import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { getLecture } from '../../api/Api';
import FormWrapper from '../../components/formWrapper/FormWrapper';
import OpKoKoForm from '../../components/opKoKoForm/OpKoKoForm';

const OpKoKoLecture = (): ReactElement => (
  <Box sx={{ width: '50vw' }}>
    <FormWrapper fn={getLecture} name="lecture">
      <OpKoKoForm />
    </FormWrapper>
  </Box>
);
export default OpKoKoLecture;
