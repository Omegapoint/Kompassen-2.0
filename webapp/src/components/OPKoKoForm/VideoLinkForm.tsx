import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { ReactElement } from 'react';
import { useMutation } from 'react-query';
import { setLectureVideoLink } from '../../api/Api';
import useForm from '../../hooks/UseForm';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';

interface VideoLinkProps {
  open: boolean;
  close: () => void;
  lecture: Lecture;
}

export const VideoLinkForm = ({ lecture, open, close }: VideoLinkProps): ReactElement => {
  const defaultFormValue = { id: lecture.id, videoLink: lecture?.videoLink || '' };
  const { values, handleChange } = useForm(defaultFormValue);
  const { mutateAsync } = useMutation(setLectureVideoLink);
  const handleSubmit = async () => {
    await mutateAsync({
      lectureID: lecture.id,
      lectureLink: values.videoLink,
    });
    close();
  };

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{lecture.title}</DialogTitle>
      <DialogContent sx={{ display: 'grid', minWidth: '400px', gridGap: padding.small }}>
        <Typography>
          Ladda upp din video på din OneDrive eller lämpligt ställe och dela länken här.
        </Typography>
        <TextField
          fullWidth
          defaultValue={lecture?.videoLink}
          onChange={handleChange}
          required
          value={values.videoLink}
          name="videoLink"
          label="Pitch (videolänk)"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Avbryt
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Lägg till pitch till ditt bidrag
        </Button>
      </DialogActions>
    </Dialog>
  );
};
