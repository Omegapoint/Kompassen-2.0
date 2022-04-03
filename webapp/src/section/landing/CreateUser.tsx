import { Paper, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { padding } from '../../theme/Theme';
import Profile from '../Profile/Profile';

interface CreateUserProps {
  onFinish: () => void;
}

const CreateUser = ({ onFinish }: CreateUserProps): ReactElement => {
  const [userUpdated, setUserUpdated] = useState(false);

  useEffect(() => {
    if (userUpdated) onFinish();
  }, [userUpdated, onFinish]);

  return (
    <Paper
      sx={{
        display: 'grid',
        padding: padding.medium,
        gridGap: padding.standard,
        '& > button': {
          justifySelf: 'center',
        },
      }}
    >
      <Typography variant="h2">Välkommen till Omegapoint Kompassen!</Typography>
      <Typography variant="body1">
        Kompassen är Omegapoints egna internt utvecklade verktyg för att hantera kompetensrelaterade
        aktiviteter. Här finns information och anmälan för kompetensdagar och kompetenskonferenser
        (OPKoKo).
      </Typography>
      <Profile setUserUpdated={setUserUpdated} />
    </Paper>
  );
};

export default CreateUser;
