import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useAppSelector } from '../../lib/Lib';
import { padding } from '../../theme/Theme';
import ProfileImage from './Image';
import Settings from './Settings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Profile = ({ createOrUpdateUserStatus }: any): ReactElement => {
  const { azureUser } = useAppSelector((state) => state.session);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gridGap: `${padding.minimal} ${padding.large}`,
          paddingTop: padding.standard,
          paddingBottom: padding.large,
          gridTemplateColumns: 'max-content max-content',
        }}
      >
        <ProfileImage />
        <Box sx={{ flexDirection: 'column', marginTop: '40px' }}>
          <Typography>NAMN</Typography>
          <Typography sx={{ fontWeight: 400 }}>{azureUser.displayName}</Typography>
          <Typography>EPOST</Typography>
          <Typography sx={{ fontWeight: 400 }}>{azureUser.mail}</Typography>
        </Box>
      </Box>
      <Settings createOrUpdateUserStatus={createOrUpdateUserStatus} />
    </>
  );
};
export default Profile;
