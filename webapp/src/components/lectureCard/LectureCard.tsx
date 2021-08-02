import { createStyles, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Fragment, ReactElement } from 'react';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';

interface StyleProps {
  categoryColor?: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() =>
  createStyles({
    paper: {
      display: 'grid',
      padding: padding.standard,
    },
    container: {
      display: 'grid',
      borderRadius: `${borderRadius.standard} ${borderRadius.standard} 0 0`,
    },
    registeredBy: {
      marginBottom: padding.standard,
    },
    header: {
      display: 'grid',
      gridTemplateColumns: 'max-content max-content 1fr',

      justifyItems: 'center',
      '& > :first-child': {
        background: colors.darkTeal,
        borderRadius: `${borderRadius.standard} 0 0 0`,
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
  })
);

interface LectureCardProps {
  lecture: Lecture;
}

const LectureCard = ({ lecture }: LectureCardProps): ReactElement => {
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID);
  const classes = useStyles({ categoryColor: category?.color });
  const locations = useAppSelector((state) => state.locations);
  const location = locations.find((e) => e.id === lecture.locationID)?.name;

  const table = [
    { name: 'Passhållare', value: lecture.lecturer },
    { name: 'Längd', value: '60 minuter' },
    { name: 'Max antal', value: lecture.maxParticipants },
    { name: 'Meddelande', value: lecture.message },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'Förkunskapskrav', value: lecture.requirements },
    { name: 'Förberedelser', value: lecture.preparations },
    { name: 'Taggar', value: lecture.tags.reduce((s, e) => `${s} ${e}`, '') },
  ];

  const time = format(lecture.createdAt, 'd LLLLLL', { locale: sv });

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography>7 maj</Typography>
        <Typography>{location}</Typography>
        <Typography>{category?.name}</Typography>
      </div>
      <Paper className={classes.paper}>
        <Typography variant="h5">Agil Filosofi</Typography>
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
          <Typography>{lecture.approved ? 'Godkänd' : 'Väntar på godkännande'}</Typography>
        </div>
      </Paper>
    </div>
  );
};

export default LectureCard;
