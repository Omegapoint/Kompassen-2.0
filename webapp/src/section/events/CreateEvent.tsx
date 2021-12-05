import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { set } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { createEvent, updateEvent } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { useAppSelector } from '../../lib/Lib';
import { Event } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import RoomPicker from './RoomPicker';

const defaultTime = { minutes: 0, seconds: 0, milliseconds: 0 };

interface FormValues {
  comment: string;
  organisationID: string;
  rooms: string[];
  date: Date | null;
  start: Date | null;
  end: Date | null;
  registrationStart: Date;
  registrationEnd: Date;
}

interface CreateElementProps {
  close: () => void;
  open: boolean;
  event?: Event;
}

const defaultValue = (event: Event | undefined, orgId: string) => ({
  comment: event?.comment || '',
  organisationID: event?.organisationID || orgId,
  rooms: [],
  date: event?.startAt || new Date(),
  start: set(new Date(), {
    ...defaultTime,
    hours: event?.startAt.getHours() || 13,
    minutes: event?.startAt.getMinutes() || 0,
  }),
  end: set(new Date(), {
    ...defaultTime,
    hours: event?.endAt.getHours() || 17,
    minutes: event?.endAt.getMinutes() || 0,
  }),
  registrationStart: event?.registrationStart || new Date(),
  registrationEnd: event?.registrationEnd || new Date(),
});

const CreateEvent = ({ close, open, event }: CreateElementProps): ReactElement => {
  const organisations = useAppSelector((state) => state.organisations);
  const create = useMutation(createEvent);
  const update = useMutation(updateEvent);
  const orgId = organisations[0].id;
  const [defaultFormValue, setDefaultFormValue] = useState<FormValues>(defaultValue(event, orgId));
  const { values, handleChange, updateValues, resetValues } = useForm(defaultFormValue);

  useEffect(() => {
    setDefaultFormValue(defaultValue(event, orgId));
  }, [event, orgId]);

  useEffect(() => {
    setDefaultFormValue((e) => ({
      ...e,
      organisationID: event?.organisationID || organisations[0].id,
      comment: event?.comment || '',
      rooms: (event?.rooms || []).map((room) => room.name),
    }));
  }, [event?.comment, event?.organisationID, event?.rooms, organisations]);

  useEffect(() => {
    if (open) {
      resetValues(defaultFormValue);
    }
  }, [defaultFormValue, open, resetValues]);

  const handleSubmit = async () => {
    if (values.date) {
      const formValues = {
        organisationID: values.organisationID,
        comment: values.comment,
        rooms: values.rooms,
        startAt: set(values.date, {
          ...defaultTime,
          hours: values.start?.getHours(),
          minutes: values.start?.getMinutes(),
        }),
        endAt: set(values.date, {
          ...defaultTime,
          hours: values.end?.getHours(),
          minutes: values.end?.getMinutes(),
        }),
        registrationStart: values.registrationStart,
        registrationEnd: values.registrationEnd,
      };

      if (event) {
        await update.mutateAsync({
          id: event.id,
          ...formValues,
        });
      } else {
        await create.mutateAsync({
          ...formValues,
        });
      }

      close();
    }
  };

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {event ? 'Redigera kompetensdag' : 'Skapa ny kompetensdag'}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'grid',
          gridGap: padding.standard,
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          '& > *': { gridColumn: 'span 6' },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={sv}>
          <Box sx={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <DatePicker
              label="Datum"
              value={values.date}
              onChange={(date) => updateValues({ date })}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <Box sx={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <TimePicker
              label="Starttid"
              value={values.start}
              onChange={(start) => updateValues({ start })}
              ampm={false}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <Box sx={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <TimePicker
              label="Sluttid"
              value={values.end}
              onChange={(end) => updateValues({ end })}
              ampm={false}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <Box sx={{ gridColumn: 'span 3', marginTop: '10px' }}>
            <DateTimePicker
              label="Registreringsstart"
              value={values.registrationStart}
              onChange={(registrationStart) => updateValues({ registrationStart })}
              ampm={false}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <Box sx={{ gridColumn: 'span 3', marginTop: '10px' }}>
            <DateTimePicker
              label="Registreringsstopp"
              value={values.registrationEnd}
              onChange={(registrationEnd) => updateValues({ registrationEnd })}
              ampm={false}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          <Select
            value={values.organisationID}
            onChange={(e) => handleChange(e)}
            inputProps={{ name: 'organisationID' }}
          >
            {organisations.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            onChange={handleChange}
            required
            value={values.comment}
            name="comment"
            label="Kommentar"
            variant="outlined"
          />
          <RoomPicker updateValues={updateValues} values={values} />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={close} color="primary">
          Avbryt
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {event ? 'Redigera kompetensdag' : 'Skapa kompetensdag'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEvent;
