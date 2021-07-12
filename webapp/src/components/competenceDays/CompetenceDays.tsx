import { ReactElement, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import LectureStats from './LectureStats';
import { padding } from '../../theme/Theme';
import DaysToGo from './DaysToGo';
import DayPicker from './DayPicker';
import { useListEvents } from '../../lib/Hooks';
import SmallLoader from '../loader/SmallLoader';
import EventContext from './EventContext';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
  },
}));

const CompetenceDays = (): ReactElement => {
  const classes = useStyles();
  const [eventsState, listEventsRequest] = useListEvents();
  const [ind, setInd] = useState(0);

  useEffect(() => {
    listEventsRequest({ queryParams: { filter: 'new' } });
  }, [listEventsRequest]);

  if (eventsState.loading || !eventsState.data) return <SmallLoader />;

  return (
    <EventContext.Provider
      value={{ events: eventsState.data, event: eventsState.data[ind], ind, setInd }}
    >
      {eventsState.data && (
        <div className={classes.container}>
          <DayPicker />
          <DaysToGo />
          <LectureStats />
        </div>
      )}
    </EventContext.Provider>
  );
};

export default CompetenceDays;
