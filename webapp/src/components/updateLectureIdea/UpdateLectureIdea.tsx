import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { IEmojiData } from 'emoji-picker-react';
import React, { MouseEvent, ReactElement } from 'react';
import { useMutation } from 'react-query';
import { updateLectureIdea } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import TextPanel from '../textPanel/TextPanel';

interface UpdateLectureIdeaProps {
  open: boolean;
  close: () => void;
  lecture: Lecture;
}

const useStyles = makeStyles(() => ({
  dialog: {
    display: 'grid',
    minWidth: '400px',
    gridGap: padding.standard,
  },
  dialogActions: {},
  status: {},
  title: {},
  content: {},
  tags: {},
  radioButtons: {},
}));

const UpdateLectureIdea = ({ open, close, lecture }: UpdateLectureIdeaProps): ReactElement => {
  const classes = useStyles();

  const defaultFormValue = {
    title: lecture.title,
    description: lecture.description,
    tags: lecture.tags.join(' '),
  };

  const { values, handleChange, appendChange } = useForm(defaultFormValue);

  const { mutateAsync } = useMutation(updateLectureIdea);

  const handleSubmit = async () => {
    await mutateAsync({
      id: lecture.id,
      title: values.title,
      description: values.description,
      tags: values.tags.split(' ').filter((e) => e),
    });
    close();
  };

  const handleSmiley = (_: MouseEvent, data: IEmojiData) => {
    appendChange('description', data.emoji);
  };

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Redigera Idé</DialogTitle>
      <DialogContent className={classes.dialog}>
        <TextField
          // {...validate.title}
          className={classes.title}
          fullWidth
          onChange={handleChange}
          required
          value={values.title}
          name="title"
          label="Titel"
          variant="outlined"
        />
        <div className={classes.content}>
          <TextField
            // {...validate.description}
            fullWidth
            multiline
            minRows={3}
            maxRows={5}
            value={values.description}
            onChange={handleChange}
            required
            name="description"
            label="Innehåll"
            variant="outlined"
          />
          <TextPanel handleEmojiClick={handleSmiley} />
        </div>

        <TextField
          // {...validate.tags}
          className={classes.tags}
          fullWidth
          onChange={handleChange}
          name="tags"
          value={values.tags}
          label="Taggar"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={close} color="primary">
          Avbryt
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Spara ändringar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateLectureIdea;
