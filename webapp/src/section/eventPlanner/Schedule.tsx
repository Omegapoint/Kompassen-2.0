import { makeStyles, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Event, Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import ScheduleContent from './ScheduleContent';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    background: colors.white,
    padding: padding.standard,
    gridGap: padding.standard,
    gridTemplateAreas: `".    titles"
                        "time schedule"`,
    gridTemplateColumns: 'max-content 1fr',
  },
  noRooms: {
    paddingTop: padding.standard,
    gridColumn: 'span 2',
    textAlign: 'center',
  },
}));

interface ScheduleProps {
  event: Event;
  lectures: Lecture[];
}

function Schedule({ event, lectures }: ScheduleProps): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {event.rooms.length ? (
        <ScheduleContent event={event} lectures={lectures} />
      ) : (
        <Typography variant="h5" className={classes.noRooms}>
          Det finns inga rum att schemalägga pass i.
        </Typography>
      )}
    </div>
  );
}

export default Schedule;
