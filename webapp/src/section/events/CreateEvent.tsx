import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
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

const useStyles = makeStyles(() => ({
  dialog: {
    display: 'grid',
    gridGap: padding.standard,
    gridTemplateColumns: '1fr 1fr 1fr',
    '& > *': {
      gridColumn: 'span 3',
    },
    '& > :nth-child(-n+3)': {
      gridColumn: 'span 1',
    },
  },
  dialogActions: {
    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'space-between',
  },
}));

const defaultTime = { minutes: 0, seconds: 0, milliseconds: 0 };

interface FormValues {
  comment: string;
  organisationID: string;
  rooms: string[];
  date: Date | null;
  start: Date | null;
  end: Date | null;
}

interface CreateElementProps {
  close: () => void;
  open: boolean;
  event?: Event;
}

const CreateEvent = ({ close, open, event }: CreateElementProps): ReactElement => {
  const classes = useStyles();
  const organisations = useAppSelector((state) => state.organisations);
  const create = useMutation(createEvent);
  const update = useMutation(updateEvent);

  const [defaultFormValue, setDefaultFormValue] = useState<FormValues>({
    comment: event?.comment || '',
    organisationID: event?.organisationID || organisations[0].id,
    rooms: [],
    date: new Date(),
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
  });
  const { values, handleChange, updateValues, resetValues } = useForm(defaultFormValue);

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
      <DialogContent className={classes.dialog}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={sv}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            label="Datum"
            value={values.date}
            onChange={(date) => updateValues({ date })}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            label="Starttid"
            value={values.start}
            onChange={(start) => updateValues({ start })}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            ampm={false}
          />
          <KeyboardTimePicker
            margin="normal"
            label="Sluttid"
            value={values.end}
            onChange={(end) => updateValues({ end })}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            ampm={false}
          />
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
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
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
