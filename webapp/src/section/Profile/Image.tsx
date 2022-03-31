import { Avatar, Box, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useAppSelector } from '../../lib/Lib';
import store from '../../reducers';

const ProfileImage = (): ReactElement => {
  const [profileImgLink, setProfileImgLink] = useState('/broken-image.jpg');
  const { azureUser } = useAppSelector((state) => state.session);

  useEffect(() => {
    const getPhoto = async () => {
      const accessToken = store.getState().session.graphToken;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const result = await fetch(
        `https://graph.microsoft.com/v1.0/users/${azureUser.id}/photo/$value`,
        options
      )
        // eslint-disable-next-line no-console
        .catch((error) => console.log(error));
      if (result instanceof Object && result.status === 200 && result.body !== null) {
        const reader = result.body.getReader();
        const stream = await reader.read();
        if (stream.value !== undefined) {
          const blob = new Blob([stream.value], { type: 'image/png' } /* (1) */);

          const url = window.URL || window.webkitURL;
          const blobUrl = url.createObjectURL(blob);
          setProfileImgLink(blobUrl);
        }
      }
    };
    getPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{marginLeft: '20px'}}>
      {profileImgLink !== '/broken-image.jpg' && (
        <Avatar src={`${profileImgLink}`} sx={{ width: 150, height: 150 }} />
      )}
      {profileImgLink === '/broken-image.jpg' && (
        <Box sx={{ flexDirection: 'column' }}>
          <Avatar src={`${profileImgLink}`} sx={{ width: 150, height: 150 }}>
            <Typography sx={{ fontWeight: 400, fontSize: 60 }}>
              {azureUser.givenName[0] + azureUser.surname[0]}
            </Typography>
          </Avatar>
          <Typography sx={{ textAlign: 'center', marginTop: 1, fontStyle: 'italic' }}>
            Ladda upp bild via Office
          </Typography>
        </Box>
      )}
    </Box>
  );
};
export default ProfileImage;
