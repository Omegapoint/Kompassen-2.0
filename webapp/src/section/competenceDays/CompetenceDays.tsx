import { Box, Button } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import useBoolean from '../../hooks/UseBoolean';
import { useAppSelector } from '../../lib/Lib';
import { Event } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import Column from './Column';
import CreateEvent from './CreateEvent';
import EventRow from './EventRow';
import EventTitles from './EventTitles';

const CompetenceDays = (): ReactElement => {
  // Filter out events that are not competence days
  const events = useAppSelector((state) => state.events).filter(
    (c) => c.organisationID !== 'c1a06b4b-9013-4f77-874f-438df1174a8c'
  );
  const today = new Date();
  const previous = events.filter((e) => e.endAt < today);
  const current = events.filter((e) => e.endAt >= today);
  const [open, { on, off }] = useBoolean();
  const [currentEvent, setCurrentEvent] = useState<undefined | Event>();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'start',
        gridGap: padding.xlarge,
      }}
    >
      <Column title="Kommande kompetensdagar">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentEvent(undefined);
            on();
          }}
        >
          Skapa ny kompetensdag
        </Button>
        <CreateEvent close={off} open={open} event={currentEvent} publishModal={false} />
        <EventTitles />
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
      <Column title="Genomförda kompetensdagar">
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

export default CompetenceDays;
