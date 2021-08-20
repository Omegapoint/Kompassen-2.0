import { createStyles, Link, makeStyles, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { listEventLectures } from '../../api/Api';
import RowPaper from '../../components/rowPaper/RowPaper';
import { useAppSelector } from '../../lib/Lib';
import { Event } from '../../lib/Types';
import { colors } from '../../theme/Theme';
import List from './List';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateColumns: '3fr 3fr 2fr 2fr min-content',
      alignItems: 'center',
    },
    cell: {
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
    },
    ringNumber: {
      background: colors.primary,
      color: colors.white,
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
      height: '26px',
      width: '26px',
      borderRadius: '50%',
    },
    menupaper: {
      borderRadius: 0,
    },
    link: {
      color: colors.black,
    },
  })
);

interface EventRowProps {
  event: Event;
  showStats?: boolean;
  color?: string;
  openEdit: () => void;
}

const EventRow = ({
  event,
  showStats = false,
  color = colors.lightGreen,
  openEdit,
}: EventRowProps): ReactElement => {
  const time = format(event.startAt, 'd MMMM', { locale: sv });
  const organisations = useAppSelector((state) => state.organisations);
  const organisation = organisations.find((e) => e.id === event.organisationID)?.name as string;
  const classes = useStyles();
  const { data } = useQuery(`listEventLecture-${event.id}`, () =>
    listEventLectures({ id: event.id })
  );

  const published = data?.filter((e) => e.draft).length || 0;
  const draft = (data?.length || 0) - published;

  return (
    <RowPaper color={color} className={classes.container}>
      <Link component={NavLink} to={`/events/${event.id}`} variant="body1" className={classes.link}>
        {organisation}
      </Link>
      <Link component={NavLink} to={`/events/${event.id}`} variant="body1" className={classes.link}>
        {time}
      </Link>
      <div className={classes.cell}>
        {showStats && <Typography className={classes.ringNumber}>{draft}</Typography>}
      </div>
      <div className={classes.cell}>
        {showStats && <Typography className={classes.ringNumber}>{published}</Typography>}
      </div>
      <div className={classes.cell}>
        <List event={event} organisation={organisation} time={time} openEdit={openEdit} />
      </div>
    </RowPaper>
  );
};

export default EventRow;
