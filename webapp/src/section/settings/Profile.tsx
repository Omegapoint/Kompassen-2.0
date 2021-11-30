import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useAppSelector } from '../../lib/Lib';
import { padding } from '../../theme/Theme';

const Profile = (): ReactElement => {
  const { azureUser } = useAppSelector((state) => state.session);

  return (
    <Box
      sx={{
        display: 'grid',
        gridGap: `${padding.minimal} ${padding.large}`,
        paddingTop: padding.standard,
        paddingBottom: padding.large,
        gridTemplateColumns: 'max-content max-content',
      }}
    >
      <Typography>Namn</Typography>
      <Typography sx={{ fontWeight: 400 }}>{azureUser.displayName}</Typography>
      <Typography>Epost</Typography>
      <Typography sx={{ fontWeight: 400 }}>{azureUser.mail}</Typography>
    </Box>
  );
};
export default Profile;
