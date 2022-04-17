import { Box, Button, Divider, Link, Stack, Typography } from '@mui/material';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { listEvents } from '../../api/Api';
import { useAppSelector } from '../../lib/Lib';
import { colors, padding } from '../../theme/Theme';
import DayPicker from '../competenceDays/DayPicker';
import EventContext from '../competenceDays/EventContext';
import LectureStats from '../competenceDays/LectureStats';
import SmallLoader from '../loader/SmallLoader';

const OPKoKoEvent = (): ReactElement => {
  const organisations = useAppSelector((state) => state.organisations);
  const listNewEvents = () =>
    listEvents({ filter: 'new' }).then((events) =>
      events.filter((event) =>
        organisations.some((org) => org.id === event.organisationID && org.name === 'OPKoKo')
      )
    );
  const { data, isLoading } = useQuery('newEvents', listNewEvents);
  const [ind, setInd] = useState(0);

  if (isLoading || !data) return <SmallLoader />;
  if (!data.length) return <Typography>Finns inga planerade just nu</Typography>;

  return (
    <EventContext.Provider value={{ events: data, event: data[ind], ind, setInd }}>
      {data && (
        <Box sx={{ display: 'grid', gridGap: padding.standard }}>
          <DayPicker />
          {/* <Typography
            variant="body1"
            sx={{ textAlign: 'center', fontSize: '8pt', color: colors.orange }}
          >
            DEADLINE FÖR ATT SKICKA IN BIDRAG:
          </Typography>
          <DaysToGo eventTime /> */}
          <Stack spacing={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.orange,
                borderColor: colors.orange,
              }}
              href="/lecture/OPKoKo/create"
              disabled={data[ind].registrationEnd < new Date()}
            >
              Skicka in bidrag
            </Button>
          </Stack>
          <LectureStats />
          <div>
            <Typography color="primary">Information om OPKoKo</Typography>
            <Divider />
          </div>
          <Typography variant="body1">
            <Link href="https://www.lyyti.fi/p/OPKoKo2022/se" target="_blank" rel="noopener">
              Anmäl dig som konferensdeltagare
            </Link>{' '}
            <br />
            Har du frågor?
            <br />
            Slack:{' '}
            <Link href="https://opchat.slack.com/archives/C0CFJCZ50" target="_blank" rel="noopener">
              #opkoko
            </Link>
            <br />
            Mail: <Link href="mailto:opkoko@omegapoint.se">opkoko@omegapoint.se</Link>
            <br />
            Eventyr: <Link href="mailto:omegapoint@eventyr.se">omegapoint@eventyr.se</Link>
            <br />
          </Typography>
          <Button size="small" variant="outlined" href="OPKokoInfo">
            Mer info
          </Button>
        </Box>
      )}
    </EventContext.Provider>
  );
};

export default OPKoKoEvent;
