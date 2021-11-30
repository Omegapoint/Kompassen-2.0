import { Box, Link, SxProps, Typography } from '@mui/material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { listEventLectures } from '../../api/Api';
import RowPaper from '../../components/rowPaper/RowPaper';
import { useOrganisation } from '../../hooks/UseReduxState';
import { Event } from '../../lib/Types';
import { colors } from '../../theme/Theme';
import List from './List';

const ringNumberStyle: SxProps = {
  background: colors.primary,
  color: colors.white,
  display: 'grid',
  alignItems: 'center',
  justifyItems: 'center',
  height: '26px',
  width: '26px',
  borderRadius: '50%',
};

const cellStyle: SxProps = {
  display: 'grid',
  alignItems: 'center',
  justifyItems: 'center',
};

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
  const organisation = useOrganisation(event.organisationID)!.name;
  const { data } = useQuery(`listEventLecture-${event.id}`, () =>
    listEventLectures({ id: event.id })
  );

  const published = data?.filter((e) => e.draft).length || 0;
  const draft = (data?.length || 0) - published;

  return (
    <RowPaper
      color={color}
      sx={{
        display: 'grid',
        gridTemplateColumns: '3fr 3fr 2fr 2fr min-content',
        alignItems: 'center',
      }}
    >
      <Link
        component={NavLink}
        to={`/events/${event.id}`}
        variant="body1"
        sx={{ color: colors.black }}
      >
        {organisation}
      </Link>
      <Link
        component={NavLink}
        to={`/events/${event.id}`}
        variant="body1"
        sx={{ color: colors.black }}
      >
        {time}
      </Link>
      <Box sx={cellStyle}>{showStats && <Typography sx={ringNumberStyle}>{draft}</Typography>}</Box>
      <Box sx={cellStyle}>
        {showStats && <Typography sx={ringNumberStyle}>{published}</Typography>}
      </Box>
      <Box sx={cellStyle}>
        <List event={event} organisation={organisation} time={time} openEdit={openEdit} />
      </Box>
    </RowPaper>
  );
};

export default EventRow;
