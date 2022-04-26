import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ReactElement } from 'react';
import { useMutation } from 'react-query/types/react/useMutation';
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
  const defaultFormValue = { id: lecture.id, videoLink: '' };
  const { values, handleChange, appendChange } = useForm(defaultFormValue);
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
      <DialogContent sx={{ display: 'grid', minWidth: '400px', gridGap: padding.standard }}>
        <TextField
          fullWidth
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
