import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { createLectureInformation } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { useAppSelector } from '../../lib/Lib';
import { Event } from '../../lib/Types';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  dialog: {
    display: 'grid',
    gridGap: padding.standard,
    gridTemplateColumns: '1fr',
    minWidth: '500px',
  },
  dialogActions: {
    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'space-between',
  },
}));

interface FormValues {
  duration: string;
  title: string;
  description: string;
}

interface CreateElementProps {
  close: () => void;
  open: boolean;
  event: Event;
}

const CreateEvent = ({ close, open, event }: CreateElementProps): ReactElement => {
  const classes = useStyles();
  const create = useMutation(createLectureInformation);
  const categories = useAppSelector((state) => state.categories);
  const session = useAppSelector((state) => state.session);

  const informationCategory = categories.find((e) => e.name === 'Information')!;

  const [defaultFormValue] = useState<FormValues>({
    title: '',
    description: '',
    duration: '',
  });
  const { values, handleChange, resetValues } = useForm(defaultFormValue);

  useEffect(() => {
    if (open) {
      resetValues(defaultFormValue);
    }
  }, [defaultFormValue, open, resetValues]);

  const handleSubmit = async () => {
    await create.mutateAsync({
      eventID: event.id,
      ...values,
      duration: parseInt(values.duration, 10) * 60,
      lecturer: session.azureUser.displayName,
      categoryID: informationCategory?.id,
    });

    close();
  };

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Skapa informationspass</DialogTitle>
      <DialogContent className={classes.dialog}>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={5}
          value={values.title}
          onChange={handleChange}
          required
          name="title"
          label="Titel"
          variant="outlined"
        />
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={5}
          value={values.description}
          onChange={handleChange}
          required
          name="description"
          label="Beskrivning"
          variant="outlined"
        />
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={5}
          value={values.duration}
          onChange={handleChange}
          required
          name="duration"
          label="Längd (min)"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={close} color="primary">
          Avbryt
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Skapa informationspass
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEvent;
