import { Box, Button, Typography } from '@mui/material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ReactElement, useContext } from 'react';
import { ReactComponent as TinyArrow } from '../../assets/tinyArrow.svg';
import { useOrganisation } from '../../hooks/UseReduxState';
import { Event } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import EventContext from './EventContext';

const buttonStyle = {
  backgroundColor: colors.primary,
  padding: `${padding.minimal} ${padding.tiny}`,
  minWidth: 0,
  lineHeight: 1,
  '&:disabled': {
    '& path': {
      fill: colors.grey,
    },
  },
};

export const formatEventTime = (event: Event): string => {
  const startTime = format(event.startAt, 'dd MMM HH:mm', { locale: sv });
  const endTime = format(event.endAt, 'HH:mm', { locale: sv });
  return `${startTime}-${endTime}`;
};

export const formatDayTime = (event: Event): string => {
  const startTime = format(event.startAt, 'dd MMMM', { locale: sv });
  return `${startTime}`;
};

const DayPicker = (): ReactElement => {
  const { events, ind, setInd } = useContext(EventContext);
  const event = events[ind];
  const organisation = useOrganisation(event.organisationID)?.name;

  const previousEvent = () => setInd((i) => (i > 0 ? i - 1 : i));
  const nextEvent = () => setInd((i) => (i <= events.length - 1 ? i + 1 : i));

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr min-content',
        gridGap: padding.standard,
        alignItems: 'center',
        justifyItems: 'center',
        backgroundColor: colors.background,
        borderRadius: borderRadius.tiny,
      }}
    >
      <Button
        color="primary"
        variant="contained"
        disabled={ind === 0}
        sx={{ ...buttonStyle, borderRadius: `${borderRadius.tiny} 0 0 ${borderRadius.tiny}` }}
        onClick={previousEvent}
      >
        <TinyArrow width={10} height={10} transform="rotate(180)" />
      </Button>
      {organisation === 'OPKoKo' ? (
        <Typography>{`${event.comment}`}</Typography>
      ) : (
        <Typography>{`${organisation} ${formatEventTime(event)}`}</Typography>
      )}
      <Button
        color="primary"
        variant="contained"
        disabled={ind >= events.length - 1}
        sx={{ ...buttonStyle, borderRadius: `0 ${borderRadius.tiny} ${borderRadius.tiny} 0` }}
        onClick={nextEvent}
      >
        <TinyArrow width={10} height={10} />
      </Button>
    </Box>
  );
};

export default DayPicker;
