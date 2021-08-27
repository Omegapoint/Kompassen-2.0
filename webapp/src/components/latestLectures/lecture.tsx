import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { borderRadius, padding } from '../../theme/Theme';
import { formatDate } from '../lecture/Row';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr max-content',
    padding: padding.minimal,
    gridGap: padding.minimal,
    alignItems: 'center',
    borderRadius: borderRadius.small,
  },
}));

interface LectureProps {
  title: string;
  location: string;
  date: Date;
  name: string;
  icon: string;
}
const Lecture = ({ title, location, date, name, icon: kind }: LectureProps): ReactElement => {
  const classes = useStyles();
  const formattedDate = formatDate(date);

  return (
    <Paper className={classes.container}>
      <img
        width={20}
        height={20}
        src={`data:image/svg+xml;base64,${window.btoa(kind as string)}`}
        alt={`${name} icon`}
      />
      <Typography variant="h6">{title}</Typography>
      <Typography>{`${formattedDate} • ${location}`}</Typography>
    </Paper>
  );
};

export default Lecture;
