import { Button, makeStyles, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { differenceInDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageNav, { INavItem } from '../../components/pageNav/PageNav';
import useBoolean from '../../hooks/UseBoolean';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, useAppSelector } from '../../lib/Lib';
import { Event, IDParam, Lecture, Organisation } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import CreateEvent from '../events/CreateEvent';
import RegisteredLectures from './RegisteredLectures';
import Schedule from './Schedule';

type INavItemKind = 'lectures' | 'schedule';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    justifyItems: 'center',
  },
  subContainer: {
    display: 'grid',
    gridGap: padding.standard,
    marginTop: padding.medium,
    width: '100%',
  },
  header: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr max-content max-content',
    alignItems: 'center',
    gridGap: padding.standard,
  },
}));

const useEventLecturesWS = (id: string) => {
  const socket = useAppSelector((state) => state.session.socket);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const mounted = useUnmount();

  useEffect(() => {
    if (socket) {
      socket.on(`event/${id}/lecture`, (li) => {
        if (mounted.current) {
          setLectures(formatDates(li));
        }
      });

      socket.on(`event/${id}/lecture/update`, (lecture: Lecture) => {
        if (mounted.current) {
          setLectures((ideas) =>
            ideas.map((e) => (e.id === lecture.id ? formatDates(lecture) : e))
          );
        }
      });

      socket.on(`event/${id}/lecture/create`, (lecture: Lecture) => {
        if (mounted.current) {
          setLectures((ideas) => [formatDates(lecture), ...ideas]);
        }
      });

      socket.on(`event/${id}/lecture/delete`, (lecture: Lecture) => {
        if (mounted.current) {
          setLectures((ideas) => ideas.filter((e) => e.id !== lecture.id));
        }
      });
      socket.emit('event/lecture/join', id);

      return () => {
        socket.emit('event/lecture/leave', id);
      };
    }
    return () => {};
  }, [id, mounted, socket]);

  return lectures;
};

const EventPlanner = (): ReactElement => {
  const { id } = useParams<IDParam>();
  const events = useAppSelector((state) => state.events);
  const organisations = useAppSelector((state) => state.organisations);
  const [active, setActive] = useState<INavItemKind>('lectures');
  const classes = useStyles();
  const event = events.find((e) => e.id === id) as Event;
  const lectures = useEventLecturesWS(id);
  const [editEventIsOpen, editEvent] = useBoolean();
  const organisation = organisations.find((e) => e.id === event.organisationID) as Organisation;
  const approvedLectures = lectures.filter((e) => e.approved);

  const navItems: INavItem<INavItemKind>[] = [
    {
      name: 'lectures',
      title: `Inkomna passanmälningar (${lectures.filter((e) => !e.approved)?.length})`,
    },
    {
      name: 'schedule',
      title: 'Schemalägg',
    },
  ];

  const date = format(event.startAt, 'yyyy-MM-dd', { locale: sv });
  const startTime = format(event.startAt, 'HH:mm', { locale: sv });
  const endTime = format(event.endAt, 'HH:mm', { locale: sv });
  const daysLeft = differenceInDays(event.startAt, new Date());

  return (
    <div className={classes.container}>
      <PageNav active={active} setActive={setActive} navItems={navItems} />
      <div className={classes.subContainer}>
        <div className={classes.header}>
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
        </div>

        {active === 'lectures' && <RegisteredLectures lectures={lectures} />}
        {active === 'schedule' && <Schedule lectures={approvedLectures} event={event} />}
      </div>
      <CreateEvent close={editEvent.off} open={editEventIsOpen} event={event} />
    </div>
  );
};

export default EventPlanner;
