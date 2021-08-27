import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Fragment, ReactElement } from 'react';
import { useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { approveLecture } from '../../api/Api';
import { useEvent } from '../../hooks/UseReduxState';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { formatDayTime } from '../competenceDays/DayPicker';

interface StyleProps {
  categoryColor?: string;
  isUnpublishedIdea: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(() =>
  createStyles({
    paper: {
      display: 'grid',
      padding: padding.standard,
    },
    container: {
      display: 'grid',
      borderRadius: `${borderRadius.small} ${borderRadius.small} 0 0`,
    },
    registeredBy: {
      marginBottom: padding.standard,
    },
    header: {
      display: 'grid',
      gridTemplateColumns: ({ isUnpublishedIdea }) =>
        isUnpublishedIdea ? '1fr' : 'max-content max-content 1fr',

      justifyItems: 'center',
      '& > :first-child': {
        background: colors.darkTeal,
        borderRadius: ({ isUnpublishedIdea }) =>
          isUnpublishedIdea
            ? `${borderRadius.standard} ${borderRadius.standard} 0 0`
            : `${borderRadius.standard} 0 0 0`,
      },
      '& > :nth-child(2)': {
        background: colors.blue,
      },
      '& > :last-child': {
        borderRadius: `0 ${borderRadius.standard} 0 0`,
        background: ({ categoryColor }) => categoryColor,
      },
      '& *': {
        width: '100%',
        color: colors.white,
        textAlign: 'center',
        padding: `3px ${padding.medium}`,
      },
    },
    row: {
      display: 'grid',
      gridAutoFlow: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    table: {
      display: 'grid',
      gridTemplateColumns: 'max-content 1fr max-content',
      gridGap: padding.minimal,
      '& > :nth-child(even)': {
        gridColumn: 'span 2',
      },
      '& > :nth-last-child(2)': {
        gridColumn: 'span 1',
      },
    },
    removeLinkPadding: {
      padding: 0,
      margin: 0,
    },
  })
);

interface LectureViewProps {
  lecture: Lecture;
  handleDelete?: () => Promise<void>;
  editIcon?: boolean;
  deleteIcon?: boolean;
  admin?: boolean;
  close?: () => void;
}

const LectureView = ({
  lecture,
  handleDelete,
  editIcon = false,
  deleteIcon = false,
  admin = false,
  close,
}: LectureViewProps): ReactElement => {
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID);
  const isUnpublishedIdea = lecture.idea && !lecture.eventID;
  const classes = useStyles({ categoryColor: category?.color, isUnpublishedIdea });
  const locations = useAppSelector((state) => state.locations);
  const location = locations.find((e) => e.id === lecture.locationID)?.name;
  const eventDay = useEvent(lecture.eventID!);

  const { mutateAsync } = useMutation(approveLecture);
  const table = [
    { name: 'Passhållare', value: lecture.lecturer },
    { name: 'Längd', value: ((lecture.duration || 0) / 60)?.toString().concat(' ', 'minuter') },
    { name: 'Max antal', value: lecture.maxParticipants },
    { name: 'Meddelande', value: lecture.message },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'Förkunskapskrav', value: lecture.requirements },
    { name: 'Förberedelser', value: lecture.preparations },
    { name: 'Taggar', value: lecture.tags.reduce((s, e) => `${s} ${e}`, '') },
  ].filter((e) => e.value);

  const handleApprove = async () => {
    await mutateAsync({ approved: !lecture.approved, id: lecture.id });
    if (close) close();
  };

  const time = format(lecture.createdAt, 'd LLLLLL', { locale: sv });
  return (
    <div className={classes.container}>
      {isUnpublishedIdea ? (
        <div className={classes.header}>
          <Typography>Idé</Typography>
        </div>
      ) : (
        <div className={classes.header}>
          {eventDay !== undefined && <Typography>{formatDayTime(eventDay)}</Typography>}
          <Typography>{location}</Typography>
          <Typography>{category?.name}</Typography>
        </div>
      )}
      <Paper className={classes.paper}>
        <div className={classes.row}>
          <Typography variant="h5">{lecture.title}</Typography>
          <div>
            {editIcon && (
              <IconButton component={NavLink} to={`/lecture/edit/${lecture.id}`}>
                <EditIcon />
              </IconButton>
            )}
            {deleteIcon && (
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
        <Typography
          className={classes.registeredBy}
        >{`Anmäld av ${lecture.lecturer} den ${time}`}</Typography>
        <div className={classes.table}>
          {table.map((e) => (
            <Fragment key={e.name}>
              <Typography>{e.name}:</Typography>
              <Typography>{e.value}</Typography>
            </Fragment>
          ))}
          {!isUnpublishedIdea && !admin && (
            <Typography>{lecture.approved ? 'Godkänd' : 'Väntar på godkännande'}</Typography>
          )}
          {admin && (
            <Button
              variant={lecture.approved ? undefined : 'contained'}
              color={lecture.approved ? undefined : 'primary'}
              onClick={handleApprove}
            >
              {lecture.approved ? 'Återkalla godkännande' : 'Godkänn'}
            </Button>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default LectureView;
