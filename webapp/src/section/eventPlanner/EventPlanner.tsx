import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import { Box, Button, Typography } from '@mui/material';
import { differenceInDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { updateEvent } from '../../api/Api';
import PageNav, { INavItem } from '../../components/pageNav/PageNav';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent, useOrganisation } from '../../hooks/UseReduxState';
import { padding } from '../../theme/Theme';
import CreateEvent from '../events/CreateEvent';
import Attendance from './Attendance';
import RegisteredLectures from './RegisteredLectures';
import Schedule from './Schedule';
import useEventLecturesWS from './UseEventLecturesWS';

type INavItemKind = 'lectures' | 'schedule' | 'attendance';

const EventPlanner = (): ReactElement => {
  const { id } = useParams<'id'>();
  const [active, setActive] = useState<INavItemKind>('attendance');
  const event = useEvent(id!)!;
  const organisation = useOrganisation(event.organisationID)!;
  const lectures = useEventLecturesWS(id!);
  const [editEventIsOpen, editEvent] = useBoolean();
  const approvedLectures = lectures.filter((lecture) => lecture.approved);

  const navItems: INavItem<INavItemKind>[] = [
    {
      name: 'lectures',
      title: `Inkomna passanmälningar (${lectures.filter((e) => !e.approved)?.length})`,
    },
    {
      name: 'schedule',
      title: 'Schemalägg',
    },
    {
      name: 'attendance',
      title: 'Anmälningar',
    },
  ];

  const date = format(event.startAt, 'yyyy-MM-dd', { locale: sv });
  const startTime = format(event.startAt, 'HH:mm', { locale: sv });
  const endTime = format(event.endAt, 'HH:mm', { locale: sv });
  const daysLeft = differenceInDays(event.startAt, new Date());
  const testVal = { comment: 'test' };
  const update = useMutation(updateEvent);
  const handlePublish = async () => {
    const updatedEvent = { ...event, published: true };
    console.log(updatedEvent);
  };

  return (
    <Box sx={{ display: 'grid', justifyItems: 'center' }}>
      <PageNav active={active} setActive={setActive} navItems={navItems} />
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={editEvent.on}
          >
            Redigera
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PublishIcon />}
            onClick={(e) => {
              handlePublish();
            }}
          >
            Publicera Schema
          </Button>
        </Box>

        {active === 'lectures' && <RegisteredLectures lectures={lectures} admin />}
        {active === 'schedule' && <Schedule lectures={approvedLectures} event={event} editable />}
        {active === 'attendance' && <Attendance event={event} lectures={lectures} />}
      </Box>
      <CreateEvent close={editEvent.off} open={editEventIsOpen} event={event} />
    </Box>
  );
};

export default EventPlanner;
