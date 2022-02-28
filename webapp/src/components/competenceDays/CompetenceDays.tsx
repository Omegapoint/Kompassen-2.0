import { Box, Button, Typography } from '@mui/material';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { listEvents } from '../../api/Api';
import useDeviceDetect from '../../hooks/UseDeviceDetect';
import { padding } from '../../theme/Theme';
import SmallLoader from '../loader/SmallLoader';
import DayPicker from './DayPicker';
import DaysToGo from './DaysToGo';
import EventContext from './EventContext';
import LectureStats from './LectureStats';

const listNewEvents = () => listEvents({ filter: 'new' });

const CompetenceDays = (): ReactElement => {
  const { data, isLoading } = useQuery('newEvents', listNewEvents);
  const navigate = useNavigate();
  const [ind, setInd] = useState(0);
  const { mobile } = useDeviceDetect();

  if (isLoading || !data) return <SmallLoader />;
  if (!data.length) return <Typography>Här var det tomt</Typography>;

  return (
    <EventContext.Provider value={{ events: data, event: data[ind], ind, setInd }}>
      {data && (
        <Box sx={{ display: 'grid', gridGap: padding.standard }}>
          <DayPicker />
          {!mobile && <DaysToGo />}
          <Button
            type="button"
            color="success"
            variant="contained"
            size="large"
            onClick={() => navigate(`/events/view/${data[ind].id}`)}
          >
            Schema och anmälan
          </Button>
          {!mobile && <LectureStats />}
        </Box>
      )}
    </EventContext.Provider>
  );
};

export default CompetenceDays;
