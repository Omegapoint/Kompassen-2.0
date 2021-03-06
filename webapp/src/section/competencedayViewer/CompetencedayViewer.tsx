import { Box, Typography } from '@mui/material';
import { differenceInDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent, useOrganisation } from '../../hooks/UseReduxState';
import { checkAccess, ROLE } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import RegisteredLectures from '../competencedayPlanner/RegisteredLectures';
import Schedule from '../competencedayPlanner/Schedule';
import useEventLecturesWS from '../competencedayPlanner/UseEventLecturesWS';
import CreateEvent from '../competenceDays/CreateEvent';
import EventRegistration from './EventRegistration';
import EventRegistrationNotification from './EventRegistrationNotification';

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

  const registrationStart = format(event.registrationStart, 'yyyy-MM-dd HH:mm', { locale: sv });
  const isBeforeRegistrationStart = event.registrationStart > new Date();
  const isAfterRegistrationEnd = event.registrationEnd < new Date();
  const canRegister = !isBeforeRegistrationStart && !isAfterRegistrationEnd;
  const approvedLectures = lectures.filter((e) => e.approved);

  useEffect(() => {
    const filtered = onlyRemote
      ? lectures.filter((e) => e.remote === 'hybrid' || e.remote === 'distance')
      : lectures;
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

        {!event.published && (
          <RegisteredLectures
            lectures={filteredLectures}
            admin={checkAccess([ROLE.ADMIN, ROLE.COMPETENCE_DAY_PLANNER])}
          />
        )}

        {event.published ? (
          <Schedule lectures={approvedLectures} event={event} editable={false} />
        ) : (
          <Typography variant="h5" align="center">
            Schemat har inte publicerats ??nnu!
          </Typography>
        )}

        {canRegister && event.published && (
          <EventRegistration
            lectures={filteredLectures}
            event={event}
            toggleOnlyRemote={toggleOnlyRemote}
          />
        )}

        {isBeforeRegistrationStart && (
          <EventRegistrationNotification title={`Anm??lan ??ppnar ${registrationStart}`} />
        )}

        {isAfterRegistrationEnd && (
          <EventRegistrationNotification
            title="Anm??lan ??r st??ngd"
            message="Du kan alltid h??ra med kompetensdagsmadame om du kan hoppa in n??gonstans, men vi g??r inga extra matbest??llningar"
          />
        )}
      </Box>
      <CreateEvent
        close={editEvent.off}
        open={editEventIsOpen}
        event={event}
        publishModal={false}
      />
    </Box>
  );
};

export default EventViewer;
