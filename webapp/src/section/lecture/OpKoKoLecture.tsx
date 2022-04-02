import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { getLecture } from '../../api/Api';
import FormWrapper from '../../components/formWrapper/FormWrapper';
import OPKoKoForm from '../../components/OPKoKoForm/OPKoKoForm';

const OPKoKoLecture = (): ReactElement => (
  <Box sx={{ width: '50vw' }}>
    <FormWrapper fn={getLecture} name="lecture">
      <OPKoKoForm />
    </FormWrapper>
  </Box>
);
export default OPKoKoLecture;
