import {
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
import { padding } from '../../theme/Theme';

const Profile = (): ReactElement => {
  const offices = useAppSelector((state) => state.offices);
  const { azureUser } = useAppSelector((state) => state.session);
  const user = useAppSelector((state) => state.user);
  const { mutate, isSuccess } = useMutation(updateUser);
  useInvalidateOnSuccess(isSuccess, 'user');

  const [selected, setSelected] = useState(user.officeId);

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
    <><Box
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
      <Typography sx={{ fontWeight: 400 }}>{azureUser.mail}</Typography></Box>
    <Box marginTop={0}>
      <TextField fullWidth multiline minRows={7} required name="Speaker bio" label="Talarbio: (visas upp på dina kompetensbidrag, var tydlig med din roll och din kompetens!)" variant="outlined" />
      </Box>
    <Box marginTop={0} marginBottom={5}><FormControl fullWidth>
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
      </Box></>
  );
};
export default Profile;
