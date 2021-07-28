import { makeStyles } from '@material-ui/core';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { listEvents } from '../../api/Api';
import { padding } from '../../theme/Theme';
import SmallLoader from '../loader/SmallLoader';
import DayPicker from './DayPicker';
import DaysToGo from './DaysToGo';
import EventContext from './EventContext';
import LectureStats from './LectureStats';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
  },
}));

const listNewEvents = () => listEvents({ filter: 'new' });

const CompetenceDays = (): ReactElement => {
  const classes = useStyles();
  const { data, isLoading } = useQuery('newEvents', listNewEvents);

  const [ind, setInd] = useState(0);

  if (isLoading || !data) return <SmallLoader />;

  return (
    <EventContext.Provider value={{ events: data, event: data[ind], ind, setInd }}>
      {data && (
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
