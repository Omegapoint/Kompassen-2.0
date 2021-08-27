import { Button, makeStyles, Modal, Theme, Typography } from '@material-ui/core';
import { addSeconds, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement } from 'react';
import LectureView from '../../components/lectureView/LectureView';
import useBoolean from '../../hooks/UseBoolean';
import { useAppSelector } from '../../lib/Lib';
import { Category, Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';

interface StyleProps {
  color: string;
  time: number;
}

export const cellHeight = 150;

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  container: {
    background: `${colors.white}dd`,
    borderRadius: borderRadius.small,
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '1fr max-content',
    gridTemplateRows: 'max-content 1fr max-content',
    border: ({ color }) => `${color} 1px solid`,
    background: ({ color }) => `${color}20`,
    borderRadius: borderRadius.small,
    padding: padding.small,
    width: '100%',
    height: ({ time }) => `${(time / 3600) * cellHeight}px`,
  },
  icon: {
    width: '20px',
    height: '20px',
    '& path': {
      fill: colors.black,
    },
  },
  left: {
    display: 'grid',
    gridGap: padding.tiny,
  },
  right: {
    display: 'grid',
    alignItems: 'end',
  },
  header: {
    display: 'grid',
    gridGap: padding.minimal,
    gridTemplateColumns: 'max-content 1fr',
  },
  information: {
    display: 'grid',
    gridTemplateColumns: '1fr max-content',
  },
  modalContainer: {
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
  },
  modalSubcontainer: {
    width: '800px',
  },
}));

interface LectureCardProps {
  lecture: Lecture;
  edit?: boolean;
  startAt?: Date;
}

const LectureCard = ({ lecture, edit = false, startAt }: LectureCardProps): ReactElement => {
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID) as Category;
  const classes = useStyles({
    color: category.color,
    time: edit ? 3600 : lecture.duration || 3600,
  });
  const [open, { on, off }] = useBoolean();

  const genTime = (time: Date) => {
    const s = format(time, 'HH:mm', { locale: sv });
    const e = format(addSeconds(time, lecture.duration || 0), 'HH:mm', { locale: sv });
    return `${s} - ${e}`;
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.left}>
          <div className={classes.header}>
            {/* eslint-disable-next-line react/no-danger */}
            <div className={classes.icon} dangerouslySetInnerHTML={{ __html: category.icon }} />
            <Typography variant="h6">{lecture.title}</Typography>
            {startAt && <Typography>{genTime(startAt)}</Typography>}
          </div>

          <Typography>{lecture.lecturer}</Typography>
          {!startAt && <Typography>{(lecture.duration || 0) / 60} min</Typography>}
        </div>

        <div className={classes.right}>
          {edit && (
            <Button
              variant={lecture.approved ? undefined : 'contained'}
              color={lecture.approved ? undefined : 'primary'}
              onClick={on}
            >
              Hantera
            </Button>
          )}
        </div>
        <Modal open={open} onClose={off} className={classes.modalContainer}>
          <div className={classes.modalSubcontainer}>
            <LectureView lecture={lecture} admin close={off} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LectureCard;
