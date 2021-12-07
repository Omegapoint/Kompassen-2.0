import { Box, Typography } from '@mui/material';
import { differenceInDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent, useOrganisation } from '../../hooks/UseReduxState';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import RegisteredLectures from '../eventPlanner/RegisteredLectures';
import useEventLecturesWS from '../eventPlanner/UseEventLecturesWS';
import CreateEvent from '../events/CreateEvent';
import EventRegistration from './EventRegistration';

const EventViewer = (): ReactElement => {
  const { id } = useParams<'id'>();
  const event = useEvent(id!)!;
  const organisation = useOrganisation(event.organisationID)!;
  const lectures = useEventLecturesWS(id!);
  const [editEventIsOpen, editEvent] = useBoolean();
  const [onlyRemote, { toggle: toggleOnlyRemote }] = useBoolean();
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);

  const date = format(event.startAt, 'yyyy-MM-dd', { locale: sv });
  const startTime = format(event.startAt, 'HH:mm', { locale: sv });
  const endTime = format(event.endAt, 'HH:mm', { locale: sv });
  const daysLeft = differenceInDays(event.startAt, new Date());

  const canRegister = event.registrationStart < new Date() && event.registrationEnd > new Date();

  useEffect(() => {
    const filtered = onlyRemote ? lectures.filter((e) => e.remote) : lectures;
    setFilteredLectures(filtered);
  }, [lectures, onlyRemote]);

  return (
    <Box sx={{ display: 'grid', justifyItems: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          gridGap: padding.standard,
          marginTop: padding.medium,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr max-content max-content',
            alignItems: 'center',
            gridGap: padding.standard,
          }}
        >
          <Typography variant="h4">{`${date} ${organisation.name}`}</Typography>
          <Typography>{`${startTime}-${endTime} (Om ${daysLeft} dagar)`}</Typography>
        </Box>

        <RegisteredLectures lectures={filteredLectures} />
        {canRegister && (
          <EventRegistration
            lectures={filteredLectures}
            event={event}
            toggleOnlyRemote={toggleOnlyRemote}
          />
        )}
      </Box>
      <CreateEvent close={editEvent.off} open={editEventIsOpen} event={event} />
    </Box>
  );
};

export default EventViewer;