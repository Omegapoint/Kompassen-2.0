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
import { createUser, updateUser } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { formIsInvalid, FormValidation, useFormValidation } from '../../hooks/UseFormValidation';
import { LARGE_STRING_LEN } from '../../lib/Constants';
import { useAppSelector } from '../../lib/Lib';
import { Office } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import Notifications from './Notifications';

const invalidNullableLongString = (str: string) => str.length > LARGE_STRING_LEN;

interface FormValues {
  speakerBio: string;
  officeID: string;
}
const messageText = `Meddelandet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const useValidate = (values: FormValues): FormValidation<FormValues> => {
  const validate = {
    speakerBio: useFormValidation(values.speakerBio, messageText, invalidNullableLongString),
  };
  return {
    validate,
    invalid: formIsInvalid(validate),
  };
};

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
    { id: 'cccb273a-2ae3-4551-8d2c-3fd209aec5e5', name: 'Omegapoint Group' },
    { id: '6ff57b3b-0149-45f3-9544-24c69ab65cf1', name: 'Omegapoint Stockholm' },
    { id: '652b8b34-d83b-479c-b795-fbcfc035946e', name: 'Omegapoint Umeå' },
    { id: '7dc62022-5aed-4590-9a4f-a9520fcb4efd', name: 'Omegapoint Malmö' },
    { id: '1d7214e6-1487-4e2f-980e-ea12d090c7eb', name: 'Omegapoint Göteborg' },
    { id: 'd8706225-df9b-49a8-9f97-fcc92cddc558', name: 'Omegapoint Uppsala' },
    { id: '91adb151-e047-468e-9d06-e6e37589fa2f', name: 'Omegapoint Köpenhamn' },
    { id: '35c9cd57-c909-4ab7-9aa2-78f3ba957c26', name: 'Integrationsbolaget' },
    { id: '76cc967f-35ed-4d7a-ad2e-4830d98bdf79', name: 'Molnbolaget' },
    { id: 'de3801d5-acd2-4bc8-a9fd-6953f5ebe235', name: 'Innovative Security' },
    { id: 'e4409858-3aa6-4284-a464-2beef6ea8cc9', name: 'Elicit' },
  ];
  const createUserRequest = useMutation(createUser);
  const updateUserRequest = useMutation(updateUser);
  const defaultFormValue = {
    speakerBio: user?.speakerBio || '',
    officeID: allOffices.find((office) => office.id === user?.officeID)?.id || allOffices[0].id,
  };

  const { values, handleChange } = useForm(defaultFormValue);
  const { validate } = useValidate(values);

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const office = allOffices.find((o) => o.id === values.officeID) as Office;
    const formData = {
      speakerBio: values.speakerBio || null,
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
        <Box marginTop={-20} height={115} marginBottom={5} marginLeft={70} width={250}>
          <FormControl fullWidth>
            <InputLabel id="office-selector">Organisation: </InputLabel>
            <Select
              labelId="office-selector"
              onChange={handleChange}
              required
              value={values.officeID}
              name="officeID"
              label="Office"
            >
              {allOffices.map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', paddingBottom: `${padding.small}` }}>
          <TextField
            {...validate.speakerBio}
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            onChange={handleChange}
            value={values.speakerBio}
            name="speakerBio"
            label="Talarbiografi"
            variant="outlined"
          />
        </Box>
        <Divider />
        <Typography variant="h6" sx={{ paddingTop: `${padding.small}` }}>
          Ange önskade notifikationsinställningar:
        </Typography>
        <Notifications handleChange={handleNotificationsChange} checked={notifications} />
        <Button color="primary" variant="contained" onClick={(e) => handleSubmit(e)}>
          Spara inställningarna
        </Button>
      </form>
    </Box>
  );
};

export default Settings;
