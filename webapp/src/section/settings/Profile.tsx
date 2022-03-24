import {
  Avatar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { updateUser } from '../../api/Api';
import useInvalidateOnSuccess from '../../hooks/UseInvalidateOnSuccess';
import { useAppSelector } from '../../lib/Lib';
import { Office } from '../../lib/Types';
import store from '../../reducers';
import { padding } from '../../theme/Theme';

export async function getAzureGraphImage(): Promise<string> {
  const accessToken = store.getState().session.graphToken;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const result = await fetch(
    `https://graph.microsoft.com/v1.0/users/33ff501d-fd05-4e18-a318-12ad6608ef0b/photo/$value`,
    options
  )
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
  if (result instanceof Object && result.body !== null) {
    const reader = result.body.getReader();
    const test2 = await reader.read();
    if (test2.value !== undefined) {
      return URL.createObjectURL(new Blob([test2.value], { type: 'image/png' } /* (1) */));
    }
    throw new Error();
  }
  throw new Error();
}

const Profile = (): ReactElement => {
  const [test, setTest] = useState('');
  const offices = useAppSelector((state) => state.offices);
  const { azureUser } = useAppSelector((state) => state.session);
  const user = useAppSelector((state) => state.user);
  const { mutate, isSuccess } = useMutation(updateUser);
  useInvalidateOnSuccess(isSuccess, 'user');

  const [selected, setSelected] = useState(user.officeId);

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
        `https://graph.microsoft.com/v1.0/users/${user.id}/photo/$value`,
        options
      )
        // eslint-disable-next-line no-console
        .catch((error) => console.log(error));
      if (result instanceof Object && result.body !== null) {
        const reader = result.body.getReader();
        const test2 = await reader.read();
        if (test2.value !== undefined) {
          const test3 = new Blob([test2.value], { type: 'image/png' } /* (1) */);

          const url = window.URL || window.webkitURL;
          const blobUrl = url.createObjectURL(test3);
          setTest(blobUrl);
        }
      }
    };
    getPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mutate({
      id: user.id,
      notifications: user.notifications,
      speakerBio: null,
      officeId: null,
    });
  }, [user.id, user.notifications, mutate]);

  const handleChange = (event: SelectChangeEvent<Office>) => {};

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
        <Avatar src={`${test}`} sx={{ width: 210, height: 210 }} />
        <Box sx={{ flexDirection: 'column', marginTop: '50px' }}>
          <Typography>Namn</Typography>
          <Typography sx={{ fontWeight: 400 }}>{azureUser.displayName}</Typography>
          <Typography>Epost</Typography>
          <Typography sx={{ fontWeight: 400 }}>{azureUser.mail}</Typography>
        </Box>
      </Box>

      <Box marginTop={0}>
        <TextField
          fullWidth
          multiline
          minRows={7}
          required
          name="Speaker bio"
          label="Talarbio: (visas upp på dina kompetensbidrag, var tydlig med din roll och din kompetens!)"
          variant="outlined"
        />
      </Box>
      <Box marginTop={0} marginBottom={5}>
        <FormControl fullWidth>
          <InputLabel id="office-selector">Organisation:</InputLabel>
          <Select
            labelId="office-selector"
            value={offices.find((o) => user.officeId === o.id)}
            label="Office"
          >
            {offices.map((office) => (
              <MenuItem value={office.id}>{office.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};
export default Profile;
