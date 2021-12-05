import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { FormEvent, ReactElement } from 'react';
import { useMutation, useQuery } from 'react-query';
import { createAttendance, deleteAttendance, isAttending } from '../../api/Api';
import SmallLoader from '../../components/loader/SmallLoader';
import useForm from '../../hooks/UseForm';
import { Event, Lecture } from '../../lib/Types';

const defaultFormValue: FormValue = {
  lectures: [],
  message: '',
  remote: false,
};

interface FormValue {
  lectures: string[];
  message: string;
  remote: boolean;
}

interface EventRegistrationProps {
  lectures: Lecture[];
  event: Event;
}

const EventRegistration = ({ event, lectures }: EventRegistrationProps): ReactElement => {
  const { values, updateValues, handleChange } = useForm(defaultFormValue);
  const onCreate = useMutation(createAttendance);
  const onDelete = useMutation(deleteAttendance);
  const { isLoading, data } = useQuery(`attending-${event.id}`, () =>
    isAttending({ id: event.id })
  );

  const handleSelectChange = (e: FormEvent<HTMLDivElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (e.target as any).value as string;
    if (values.lectures.includes(value)) {
      updateValues({ lectures: values.lectures.filter((lectureId) => lectureId !== value) });
    } else {
      updateValues({ lectures: [...values.lectures, value] });
    }
  };

  const onSubmit = () => onCreate.mutateAsync({ ...values, eventID: event.id });

  const onDeleteClick = async () => {
    await onDelete.mutateAsync({ id: event.id });
    window.location.reload();
  };

  const approvedLectures = lectures.filter((e) => e.approved);

  if (isLoading) return <SmallLoader />;
  if (data?.ok || onCreate.isSuccess) {
    return (
      <Box
        sx={{
          height: '200px',
          display: 'grid',
          alignContent: 'center',
          justifyItems: 'center',
        }}
      >
        <Typography variant="h4">
          {onCreate.isSuccess ? 'Tack för din anmälan!' : 'Du är redan anmäld till passet.'}
        </Typography>
        <Button
          sx={{ marginTop: '10px', marginLeft: '10px' }}
          color="primary"
          variant="contained"
          onClick={onDeleteClick}
        >
          Ta bort anmälan
        </Button>
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'grid', gridGap: '10px', marginTop: '40px' }}>
      <Typography variant="h4">Anmäl dig till kompetensdagen</Typography>
      <Box>
        {!!approvedLectures.length && (
          <>
            <Typography variant="h5">Välj pass</Typography>
            <FormGroup onChange={handleSelectChange}>
              {approvedLectures.map((e) => (
                <FormControlLabel key={e.id} control={<Checkbox value={e.id} />} label={e.title} />
              ))}
            </FormGroup>
          </>
        )}

        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={5}
          value={values.message}
          onChange={handleChange}
          required
          name="message"
          label="Matpreferens"
          variant="outlined"
        />

        <Box>
          <FormControlLabel
            control={<Switch checked={values.remote} onChange={handleChange} name="remote" />}
            label="Distans"
          />
        </Box>

        <Button variant="contained" color="primary" onClick={onSubmit}>
          Skicka in anmälan
        </Button>
      </Box>
    </Box>
  );
};

export default EventRegistration;
