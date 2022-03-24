import { Box, Divider, Typography } from '@mui/material';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { updateUser } from '../../api/Api';
import useInvalidateOnSuccess from '../../hooks/UseInvalidateOnSuccess';
import { useAppSelector } from '../../lib/Lib';
import { padding } from '../../theme/Theme';
import Notifications from './Notifications';
import Profile from './Profile';

const Settings = (): ReactElement => {
  const user = useAppSelector((state) => state.user);
  const { mutate, isSuccess } = useMutation(updateUser);
  useInvalidateOnSuccess(isSuccess, 'user');

  const [checked, setChecked] = useState(user.notifications);

  useEffect(() => {
    mutate({
      id: user.id,
      notifications: checked,
      speakerBio: user.speakerBio || null,
      officeId: user.officeId || null,
    });
  }, [checked, user.id, user.speakerBio, user.officeId, mutate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateRows: 'max-content auto auto auto auto',
        gridGap: `${padding.medium} ${padding.large}`,
        padding: '0 20px',
      }}
    >
      <Typography variant="h1">Min profil</Typography>
      <Box sx={{ display: 'grid', gridGap: `${padding.small}` }}>
        <Profile />
        <Typography variant="h2">Hantera Notiser</Typography>
        <Divider />
        <Notifications handleChange={handleChange} checked={checked} />
      </Box>
    </Box>
  );
};

export default Settings;
