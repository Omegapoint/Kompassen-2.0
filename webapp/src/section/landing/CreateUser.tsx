import { Paper, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { padding } from '../../theme/Theme';
import Profile from '../Profile/Profile';

const defaultNotifications = {
  newLecture: true,
  newComment: true,
  adminRead: true,
  lectureTaken: true,
};

interface CreateUserProps {
  onFinish: () => void;
}

const CreateUser = ({ onFinish }: CreateUserProps): ReactElement => {
  const [createOrUpdateUserStatus, setState] = useState(false);

  useEffect(() => {
    if (createOrUpdateUserStatus) onFinish();
  }, [createOrUpdateUserStatus, onFinish]);

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
      <Typography variant="h6">
        Kompassen är Omegapoints egna internt utvecklade verktyg för att hantera kompetensrelaterade
        aktiviteter. Här finns information om kompetensdagar och kompetenskonferenser (OPKoKo).
      </Typography>
      <Profile createOrUpdateUserStatus={setState} />
    </Paper>
  );
};

export default CreateUser;
