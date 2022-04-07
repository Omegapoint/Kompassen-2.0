import { Box, Button } from '@mui/material';
import React, { ReactElement, useEffect, useState } from 'react';
import useBoolean from '../../hooks/UseBoolean';
import { useAppSelector } from '../../lib/Lib';
import { Event } from '../../lib/Types';
import Column from '../../section/competenceDays/Column';
import CreateEvent from '../../section/competenceDays/CreateEvent';
import EventRow from '../../section/competenceDays/EventRow';
import EventTitles from '../../section/competenceDays/EventTitles';
import { colors, padding } from '../../theme/Theme';

const OPKoKoPlanner = (): ReactElement => {
  // Filter out events that are not opkokos
  const events = useAppSelector((state) => state.events).filter(
    (c) => c.organisationID === 'c1a06b4b-9013-4f77-874f-438df1174a8c'
  );
  const today = new Date();
  const previous = events.filter((e) => e.endAt < today);
  const current = events.filter((e) => e.endAt >= today);
  const [open, { on, off }] = useBoolean();
  const [currentEvent, setCurrentEvent] = useState<undefined | Event>();

  useEffect(() => {
    console.log(events);
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'start',
        gridGap: padding.xlarge,
      }}
    >
      <Column title="Kommande OPKoKos">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentEvent(undefined);
            on();
          }}
        >
          Skapa ny OPKoKo
        </Button>
        <CreateEvent close={off} open={open} event={currentEvent} publishModal={false} />
        <EventTitles />
        {/* filter by org.id, this removes opkoko events from the list  */}
        {current.map((e) => (
          <EventRow
            key={e.id}
            event={e}
            showStats
            openEdit={() => {
              setCurrentEvent(e);
              on();
            }}
          />
        ))}
      </Column>
      <Column title="Genomförda OPKoKos">
        {previous.map((e) => (
          <EventRow
            key={e.id}
            event={e}
            color={colors.primary}
            openEdit={() => {
              setCurrentEvent(e);
              on();
            }}
          />
        ))}
      </Column>
    </Box>
  );
};

export default OPKoKoPlanner;
