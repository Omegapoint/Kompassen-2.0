import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { ReactElement } from 'react';

interface DeleteDialogProps {
  open: boolean;
  close: () => void;
  success: () => void;
  text: string;
}

const DeleteDialog = ({ open, close, success, text }: DeleteDialogProps): ReactElement => (
  <div>
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Är du säker?</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Avbryt
        </Button>
        <Button onClick={success} color="primary" autoFocus>
          Ta bort
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default DeleteDialog;
