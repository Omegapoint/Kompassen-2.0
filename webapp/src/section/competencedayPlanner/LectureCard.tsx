import { Box, Button, Modal, Typography } from '@mui/material';
import { addSeconds, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { Fragment, ReactElement, useCallback, useEffect, useState } from 'react';
import { getAzureUser } from '../../api/GraphApi';
import Discussion from '../../components/lecture/Discussion';
import LectureContext from '../../components/lecture/LectureContext';
import LectureView from '../../components/lectureView/LectureView';
import useBoolean from '../../hooks/UseBoolean';
import useUnmount from '../../hooks/UseUnmount';
import { checkAccess, formatDates, ROLE, useAppSelector } from '../../lib/Lib';
import {
  Category,
  Format,
  Lecture,
  LectureMessage,
  Status,
  UpdatedLectureMessage,
} from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import StatusChanger from './StatusChanger';

export const cellHeight = 150;

interface LectureCardProps {
  lecture: Lecture;
  edit?: boolean;
  startAt?: Date;
  admin?: boolean;
  opkoko?: boolean;
}

const LectureCard = ({
  lecture,
  edit = false,
  startAt,
  admin = false,
  opkoko = false,
}: LectureCardProps): ReactElement => {
  const useLectureWS = (lectureID: string) => {
    const socket = useAppSelector((state) => state.session.socket);
    const [chat, setChat] = useState<LectureMessage[]>([]);
    const mounted = useUnmount();

    useEffect(() => {
      if (socket) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on(`lectureChat/${lectureID}/initial`, (messages) => {
          if (mounted.current) {
            setChat(formatDates(messages));
          }
        });
        socket.on(
          `lectureChat/${lectureID}/message`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (message) => {
            if (mounted.current) {
              setChat((m) => [...m, formatDates(message)]);
            }
          }
        );
        socket.emit('lectureChat/join', lectureID);

        return () => {
          socket.emit('lectureChat/leave', lectureID);
        };
      }
      return () => {};
    }, [lectureID, mounted, socket]);

    const sendWSMessage = useCallback(
      (message: string) => socket.emit('lectureChat/message', lectureID, message),
      [lectureID, socket]
    );

    const updateWSMessage = useCallback(
      (msg: UpdatedLectureMessage) =>
        socket.emit('lectureChat/message/update', msg.id, msg.message),
      [socket]
    );

    const deleteWSMessage = useCallback(
      (msg: UpdatedLectureMessage) => {
        socket.emit('lectureChat/message/delete', msg);
      },
      [socket]
    );

    return { chat, sendWSMessage, updateWSMessage, deleteWSMessage };
  };
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find(
    (e: { id: string | null }) => e.id === lecture.categoryID
  ) as Category;
  const formats = useAppSelector((state) => state.formats);
  const formatType = formats.find(
    (e: { id: string | null }) => e.id === lecture.formatID
  ) as Format;
  const statuses = useAppSelector((state) => state.statuses);
  const status = statuses.find(
    (e: { id: string | undefined }) => e.id === lecture.status?.statusID
  ) as Status;
  const { azureUser } = useAppSelector((state) => state.session);
  const isOwner = lecture.lecturerID === azureUser.id;
  const [open, { on, off }] = useBoolean();
  const { chat, sendWSMessage, updateWSMessage, deleteWSMessage } = useLectureWS(lecture.id);

  const genTime = (time: Date) => {
    const s = format(time, 'HH:mm', { locale: sv });
    const e = format(addSeconds(time, lecture.duration || 0), 'HH:mm', { locale: sv });
    return `${s} - ${e}`;
  };

  const setLocation = (location: string | null): string | null => {
    if (location === 'local') return 'Endast på plats';
    if (location === 'distance') return 'Endast på distans';
    if (location === 'hybrid') return 'Både på plats och distans';
    return '';
  };

  const [lecturers, setLecturers] = useState(['']);
  useEffect(() => {
    const lecturersName: string[] = [];

    async function fetchMyAPI(userID: string) {
      return getAzureUser(userID).then((azureU) => azureU.displayName);
    }

    if (lecture.lecturers) {
      lecture.lecturers.map((lecturer) =>
        fetchMyAPI(lecturer.userID).then((value) => lecturersName.push(value))
      );
      setLecturers(lecturersName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opkokoTable = [
    { name: 'Talare', value: lecturers.join(', ') },
    { name: 'Titel', value: lecture.title },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'Kategori', value: category.name },
    { name: 'Intern presentation', value: lecture.internalPresentation ? 'Ja' : 'Nej' },
    { name: 'Key take away', value: lecture.keyTakeaway },
    { name: 'Format', value: formatType?.name },
    { name: 'Målgrupp', value: lecture.targetAudience },
    { name: 'Förkunskapskrav', value: lecture.requirements },
    { name: 'Meddelande', value: lecture.message },
    { name: 'Status', value: status?.name },
    { name: 'Pitch', value: lecture.videoLink },
  ].map((e) => ({ ...e, value: e.value || '-' }));

  return (
    <LectureContext.Provider
      value={{ lecture, chat, sendWSMessage, updateWSMessage, deleteWSMessage }}
    >
      <Box sx={{ background: `${colors.white}dd`, borderRadius: borderRadius.small }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: opkoko ? 'max-content' : '1fr max-content',
            gridTemplateRows: opkoko ? 'max-content' : 'max-content 1fr max-content',
            border: `${category.color} 1px solid`,
            background: `${category.color}20`,
            borderRadius: borderRadius.small,
            padding: padding.small,
            width: '100%',
            height: opkoko
              ? '100%'
              : `${((edit ? 3600 : lecture.duration || 3600) / 3600) * cellHeight}px`,
          }}
        >
          {opkoko ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'max-content 1fr max-content',
                gridGap: padding.minimal,
              }}
            >
              {opkokoTable.map((e) => (
                <Fragment key={e.name}>
                  <Typography sx={{ gridColumn: 'span 1' }}>{e.name}:</Typography>
                  <Typography sx={{ gridColumn: 'span 2', minWidth: '800px', maxWidth: '800px' }}>
                    {e.value}
                  </Typography>
                </Fragment>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridGap: padding.tiny }}>
              <Box
                sx={{
                  display: 'grid',
                  gridGap: padding.minimal,
                  gridTemplateColumns: 'max-content 1fr',
                }}
              >
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    '& path': { fill: colors.black },
                  }}
                  dangerouslySetInnerHTML={{ __html: category.icon }}
                />
                <Typography variant="h6">{lecture.title}</Typography>
              </Box>

              <Typography>{setLocation(lecture.remote)}</Typography>

              <Typography>
                {startAt ? genTime(startAt) : `${(lecture.duration || 0) / 60} min`}
              </Typography>

              <Typography>
                {lecturers[0] !== '' ? lecturers.join(', ') : lecture.lecturer}
              </Typography>
              {lecture.approved && admin && (
                <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
                  Godkänt pass
                </Typography>
              )}
            </Box>
          )}
          {opkoko ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'max-content max-content max-content',
                  alignItems: 'center',
                  width: '100%',
                  minWidth: '850px',
                  maxWidth: '850px',
                  paddingX: padding.small,
                }}
              >
                {edit &&
                  checkAccess([
                    ROLE.ADMIN,
                    ROLE.COMPETENCE_DAY_PLANNER,
                    ROLE.OPKOKO_PROGRAM_COMMITTEE,
                    ROLE.OPKOKO_PLANNER,
                  ]) && (
                    <Box sx={{ minWidth: '100px', display: 'grid', gridGap: padding.small }}>
                      <Button
                        variant={lecture.approved ? undefined : 'contained'}
                        color={lecture.approved ? undefined : 'primary'}
                        onClick={on}
                      >
                        Hantera
                      </Button>
                      <StatusChanger lectureID={lecture.id} />
                    </Box>
                  )}
                {!edit && (
                  <Button variant="contained" color="primary" onClick={on}>
                    Visa
                  </Button>
                )}
                <Box
                  sx={{
                    display: 'grid',
                    minWidth: '840px',
                    maxWidth: '840px',
                    gridTemplateColumns: 'max-content max-content 1fr max-content',
                    gridTemplateAreas: `"title icon . info"
                            "content content content content"`,
                    padding: padding.small,
                    paddingLeft: padding.xlarge,
                    gridGap: `${padding.minimal}`,
                  }}
                >
                  <Discussion opkoko={opkoko} />
                </Box>
              </Box>

              <Modal
                open={open}
                onClose={off}
                sx={{ display: 'grid', alignItems: 'center', justifyItems: 'center' }}
                style={{ overflow: 'scroll' }}
              >
                <Box sx={{ width: '800px' }}>
                  <LectureView
                    lecture={lecture}
                    admin={admin}
                    close={off}
                    editIcon={isOwner || admin}
                    showAttendance={isOwner || admin}
                  />
                </Box>
              </Modal>
            </>
          ) : (
            <>
              <Box sx={{ display: 'grid', alignItems: 'end' }}>
                {edit && admin && (
                  <Button
                    variant={lecture.approved ? undefined : 'contained'}
                    color={lecture.approved ? undefined : 'primary'}
                    onClick={on}
                  >
                    Hantera
                  </Button>
                )}
                {!edit && (
                  <Button variant="contained" color="primary" onClick={on}>
                    Visa
                  </Button>
                )}
              </Box>
              <Modal
                open={open}
                onClose={off}
                sx={{ display: 'grid', alignItems: 'center', justifyItems: 'center' }}
              >
                <Box sx={{ width: '800px' }}>
                  <LectureView
                    lecture={lecture}
                    admin={admin}
                    close={off}
                    editIcon={isOwner || admin}
                    showAttendance={isOwner || admin}
                  />
                </Box>
              </Modal>
            </>
          )}
        </Box>
      </Box>
    </LectureContext.Provider>
  );
};

export default LectureCard;
