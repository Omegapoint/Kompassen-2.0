import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { createUser, updateUser } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { formIsInvalid, FormValidation, useFormValidation } from '../../hooks/UseFormValidation';
import { LARGE_STRING_LEN, SHORT_STRING_LEN } from '../../lib/Constants';
import { useAppSelector } from '../../lib/Lib';
import { Office } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import Notifications from './Notifications';

const invalidShortString = (str: string) => str.length < 1 || str.length > SHORT_STRING_LEN;
const invalidLongString = (str: string) => str.length < 1 || str.length > LARGE_STRING_LEN;
const invalidNullableLongString = (str: string) => str.length > LARGE_STRING_LEN;

interface FormValues {
  speakerBio: string;
  officeID: string;
}
const messageText = `Meddelandet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const useValidate = (values: FormValues): FormValidation<FormValues> => {
  const validate = {
    speakerBio: useFormValidation(values.speakerBio, messageText, invalidLongString),
  };
  return {
    validate,
    invalid: formIsInvalid(validate),
  };
};

interface SetUserUpdated {
  setUserUpdated: (status: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Settings = ({
  setUserUpdated,
}: {
  setUserUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactElement => {
  const user = useAppSelector((state) => state.user);

  const defaultNotifications = {
    newLecture: true,
    newComment: true,
    adminRead: true,
    lectureTaken: true,
  };
  const [notifications, setNotifications] = useState(user.notifications ?? defaultNotifications);

  const handleNotificationsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifications((old) => ({ ...old, [event.target.name]: event.target.checked }));
  };

  const allOffices = [
    { id: 'ea399f36-1c38-4fd7-b838-c89fb663f818', name: 'Stockholm OP' },
    { id: 'd55d094a-f582-467d-bc83-9da6f891343b', name: 'Uppsala OP' },
    { id: '3e0be5ad-1768-48a3-b2b9-b6b10a079be1', name: 'Malmö OP' },
    { id: 'a249f431-5e4a-4a9a-a97c-a846f4ff61d2', name: 'Umeå OP' },
    { id: '192cf114-0279-4eba-b969-b15e32d2475f', name: 'Göteborg OP' },
    { id: '06bc8d77-8e73-4803-9465-cfb461e6cf5c', name: 'Integrationsbolaget' },
    { id: '6a9812cb-57ec-4053-88d9-6e709a9460cf', name: 'Molnbolaget' },
  ];
  const createUserRequest = useMutation(createUser);
  const updateUserRequest = useMutation(updateUser);
  const navigate = useNavigate();

  const defaultFormValue = {
    speakerBio: user?.speakerBio || '',
    officeID: allOffices.find((office) => office.id === user?.officeID)?.id || allOffices[0].id,
  };

  const { values, handleChange } = useForm(defaultFormValue);
  const { validate, invalid } = useValidate(values);

  const handleSubmit = (evt: FormEvent, draft: boolean) => {
    evt.preventDefault();
    const office = allOffices.find((o) => o.id === values.officeID) as Office;
    const formData = {
      speakerBio: values.speakerBio,
      officeID: office.id,
    };
    if (user.id !== undefined) {
      updateUserRequest.mutate({ id: user.id, ...formData, notifications });
    } else {
      createUserRequest.mutate({ ...formData, notifications });
    }
  };

  useEffect(() => {
    if (createUserRequest.isSuccess) {
      setUserUpdated(true);
    } else if (updateUserRequest.isSuccess) {
      setUserUpdated(true);
    }
  }, [createUserRequest.isSuccess, updateUserRequest.isSuccess, setUserUpdated]);

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
      <form>
        {user.id !== undefined && <Typography variant="h1">Min profil</Typography>}
        <Box sx={{ display: 'grid', gridGap: `${padding.small}` }}>
          <Box marginTop={0}>
            <TextField
              {...validate.speakerBio}
              fullWidth
              multiline
              minRows={10}
              maxRows={20}
              onChange={handleChange}
              required
              value={values.speakerBio}
              name="speakerBio"
              label="Innehåll"
              variant="outlined"
            />
          </Box>
          <Box marginTop={0} marginBottom={5}>
            <FormControl fullWidth>
              <InputLabel id="office-selector">Organisation:</InputLabel>
              <Select
                labelId="office-selector"
                onChange={handleChange}
                value={allOffices.find((o) => user.officeID === o.id)}
                name="officeID"
                label="Office"
              >
                {allOffices.map((office) => (
                  <MenuItem value={office.id}>{office.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {user.id !== undefined && <Typography variant="h2">Hantera Notiser</Typography>}
          <Divider />
          <Typography variant="h6">Ange önskade notifikationsinställningar:</Typography>
          <Notifications handleChange={handleNotificationsChange} checked={notifications} />
          <Typography variant="h6">Ange önskade notifikationsinställningar:</Typography>
          <Button color="primary" variant="contained" onClick={(e) => handleSubmit(e, false)}>
            Spara inställningarna
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Settings;
