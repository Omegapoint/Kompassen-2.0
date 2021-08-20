import { createStyles, makeStyles, Modal } from '@material-ui/core';
import React, { ReactElement } from 'react';
import LectureView from '../../components/lectureView/LectureView';
import { Lecture } from '../../lib/Types';

interface ConfirmLectureProps {
  lecture: Lecture;
  close: () => void;
  open: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
    },
    subContainer: {
      width: '800px',
    },
  })
);

const HandleLecture = ({ lecture, open, close }: ConfirmLectureProps): ReactElement => {
  const classes = useStyles();
  return (
    <Modal
      open={open}
      onClose={close}
      className={classes.container}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.subContainer}>
        <LectureView lecture={lecture} admin close={close} />
      </div>
    </Modal>
  );
};

export default HandleLecture;
