import { Box, Button, Stack, Typography } from '@mui/material';
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
    events.filter((event) => event.organisationID === 'c1a06b4b-9013-4f77-874f-438df1174a8c')
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
          <Stack spacing={2}>
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ width:'100%'}}
              href="/lecture/OPKoKo/create"
            >
              Skicka in bidrag
            </Button>
          </Stack>
          <LectureStats />
        </Box>
      )}
    </EventContext.Provider>
  );
};

export default KoKoEvent;
