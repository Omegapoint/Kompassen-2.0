import { Button, Paper, Typography } from '@mui/material';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { createUser } from '../../api/Api';
import { padding } from '../../theme/Theme';
import Notifications from '../settings/Notifications';
import Profile from '../settings/Profile';

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
  const { mutate, isSuccess } = useMutation(createUser);
  const [notifications, setNotifications] = useState(defaultNotifications);

  useEffect(() => {
    if (isSuccess) onFinish();
  }, [isSuccess, onFinish]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifications((old) => ({ ...old, [event.target.name]: event.target.checked }));
  };

  const handleSubmit = async () => mutate({ notifications, speakerBio: null, officeId: null });

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
      <Typography variant="h6">Kompassen är Omegapoints egna internt utvecklade verktyg för att hantera kompetensrelaterade aktiviteter. Här finns information om kompetensdagar och kompetenskonferenser (OPKoKo).</Typography>
      <Typography variant="h6">Ange kompletterande information:</Typography>
      <Profile/>
      <Typography variant="h6">Ange önskade notifikationsinställningar:</Typography>
      <Notifications handleChange={handleChange} checked={notifications} />
      <Button color="primary" variant="contained" onClick={handleSubmit}>
        Spara inställningarna
      </Button>
    </Paper>
  );
};

export default CreateUser;
