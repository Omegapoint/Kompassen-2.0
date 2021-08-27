import { Button, makeStyles, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { differenceInDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageNav, { INavItem } from '../../components/pageNav/PageNav';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent, useOrganisation } from '../../hooks/UseReduxState';
import { IDParam } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import CreateEvent from '../events/CreateEvent';
import RegisteredLectures from './RegisteredLectures';
import Schedule from './Schedule';
import useEventLecturesWS from './UseEventLecturesWS';

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

const EventPlanner = (): ReactElement => {
  const { id } = useParams<IDParam>();
  const [active, setActive] = useState<INavItemKind>('lectures');
  const classes = useStyles();
  const event = useEvent(id)!;
  const organisation = useOrganisation(event.organisationID)!;
  const lectures = useEventLecturesWS(id);
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
