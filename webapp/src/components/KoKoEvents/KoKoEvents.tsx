import { Box, Typography } from '@mui/material';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { listEvents } from '../../api/Api';
import { padding } from '../../theme/Theme';
import DayPicker from '../competenceDays/DayPicker';
import DaysToGo from '../competenceDays/DaysToGo';
import EventContext from '../competenceDays/EventContext';
import LectureStats from '../competenceDays/LectureStats';
import SmallLoader from '../loader/SmallLoader';

const listNewEvents = () =>
  listEvents({ filter: 'new' }).then((events) =>
    events.filter((event) => event.organisationID === 'dff5e789-b4e0-43c2-95c2-ac6c87242f34')
  );

const KoKoEvent = (): ReactElement => {
  const { data, isLoading } = useQuery('newEvents', listNewEvents);
  const [ind, setInd] = useState(0);

  if (isLoading || !data) return <SmallLoader />;
  if (!data.length) return <Typography>Finns inga planerade just nu</Typography>;

  return (
    <EventContext.Provider value={{ events: data, event: data[ind], ind, setInd }}>
      {data && (
        <Box sx={{ display: 'grid', gridGap: padding.standard }}>
          <DayPicker />
          <DaysToGo />
          <LectureStats />
        </Box>
      )}
    </EventContext.Provider>
  );
};

export default KoKoEvent;
