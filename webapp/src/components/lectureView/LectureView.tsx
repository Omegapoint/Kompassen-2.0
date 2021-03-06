import { VideoCameraFront } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Fragment, ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { approveLecture } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import useAzureUser from '../../hooks/UseAzureUser';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent } from '../../hooks/UseReduxState';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, useAppSelector } from '../../lib/Lib';
import { Lecture, LectureMessage, Status } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { formatDayTime } from '../competenceDays/DayPicker';
import Discussion from '../lecture/Discussion';
import LectureContext from '../lecture/LectureContext';
import { VideoLinkForm } from '../OPKoKoForm/VideoLinkForm';
import UpdateLectureIdea from '../updateLectureIdea/UpdateLectureIdea';
import LectureAttendanceList from './LectureAttendanceList';

interface LectureViewProps {
  lecture: Lecture;
  handleDelete?: () => Promise<void>;
  editIcon?: boolean;
  deleteIcon?: boolean;
  admin?: boolean;
  close?: () => void;
  onSuccess?: () => unknown;
  showAttendance?: boolean;
}

const LectureView = ({
  lecture,
  handleDelete,
  editIcon = false,
  deleteIcon = false,
  admin = false,
  showAttendance = false,
  close,
  onSuccess,
}: LectureViewProps): ReactElement => {
  const useLectureWS = (lectureID: string) => {
    const socket = useAppSelector((state) => state.session.socket);
    const [chat, setChat] = useState<LectureMessage[]>([]);
    const mounted = useUnmount();

    useEffect(() => {
      if (socket) {
        socket.on(
          `lectureChat/${lectureID}/initial`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (messages) => {
            if (mounted.current) {
              setChat(formatDates(messages));
            }
          }
        );
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

    return { chat, sendWSMessage };
  };
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e: { id: string | null }) => e.id === lecture.categoryID);
  const formats = useAppSelector((state) => state.formats);
  const formatName = formats.find((e: { id: string | null }) => e.id === lecture.formatID);
  const events = useAppSelector((state) => state.events);
  const event = events.find((e: { id: string | null }) => e.id === lecture.eventID);
  const statuses = useAppSelector((state) => state.statuses);
  const status = statuses.find(
    (e: { id: string | undefined }) => e.id === lecture.status?.statusID
  ) as Status;
  const organisations = useAppSelector((state) => state.organisations);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organisation = organisations.find((e) => e.id === event?.organisationID);
  const editLink =
    organisation?.name === 'OPKoKo' ? '/lecture/OPKoKo/edit/' : '/lecture/competenceday/edit/';
  const { chat, sendWSMessage } = useLectureWS(lecture.id);

  const [lecturers, setLecturers] = useState(['']);
  useEffect(() => {
    const lecturersName: string[] = [];

    async function fetchMyAPI(userID: string) {
      return getAzureUser(userID).then((azureUser) => azureUser.displayName);
    }

    if (lecture.lecturers) {
      lecture.lecturers.map((lecturer) =>
        fetchMyAPI(lecturer.userID).then((value) => lecturersName.push(value))
      );
      setLecturers(lecturersName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isUnpublishedIdea = lecture.idea && !lecture.eventID;
  const eventDay = useEvent(lecture.eventID!);
  const [open, { on, off }] = useBoolean();
  const [openVideoLinkForm, setOpenVideoLinkForm] = useState(false);
  const { name: createdBy } = useAzureUser(lecture.createdBy);

  const setLocation = (location: string | null): string => {
    if (location === 'local') return 'Endast p?? plats';
    if (location === 'distance') return 'Endast p?? distans';
    if (location === 'hybrid') return 'B??de p?? plats och distans';
    return '';
  };

  const { mutateAsync } = useMutation(approveLecture);
  const table = [
    { name: 'Passh??llare', value: lecture.lecturer },
    { name: 'L??ngd', value: ((lecture.duration || 0) / 60)?.toString().concat(' ', 'minuter') },
    { name: 'Distans', value: setLocation(lecture.remote) },
    { name: 'Max antal', value: lecture.maxParticipants },
    { name: 'Meddelande', value: lecture.message },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'F??rkunskapskrav', value: lecture.requirements },
    { name: 'F??rberedelser', value: lecture.preparations },
    { name: 'Taggar', value: lecture.tags.reduce((s, e) => `${s} ${e}`, '') },
  ].map((e) => ({ ...e, value: e.value || '-' }));

  const opkokoTable = [
    { name: 'Talare', value: lecturers.join(', ') },
    { name: 'Titel', value: lecture.title },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'Intern presentation', value: lecture.internalPresentation ? 'Ja' : 'Nej' },
    { name: 'Key take away', value: lecture.keyTakeaway },
    { name: 'Format', value: formatName?.name },
    { name: 'M??lgrupp', value: lecture.targetAudience },
    { name: 'F??rkunskapskrav', value: lecture.requirements },
    { name: 'Meddelande', value: lecture.message },
    { name: 'Status', value: status?.name },
    { name: 'Pitch', value: lecture.videoLink },
  ].map((e) => ({ ...e, value: e.value || '-' }));

  const handleApprove = async () => {
    await mutateAsync({ approved: !lecture.approved, id: lecture.id });
    if (close) close();
  };

  const time = format(lecture.createdAt, 'd LLLLLL', { locale: sv });
  return (
    <LectureContext.Provider value={{ lecture, chat, sendWSMessage }}>
      <Box
        sx={{
          display: 'grid',
          borderRadius: `${borderRadius.small} ${borderRadius.small} 0 0`,
        }}
      >
        {!admin ? (
          <VideoLinkForm
            open={openVideoLinkForm}
            close={() => {
              setOpenVideoLinkForm(false);
            }}
            lecture={lecture}
          />
        ) : (
          <UpdateLectureIdea
            open={open}
            close={() => {
              if (onSuccess) onSuccess();
              off();
            }}
            lecture={lecture}
          />
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isUnpublishedIdea ? '1fr' : 'max-content max-content 1fr',
            justifyItems: 'center',
            '& *': {
              width: '100%',
              color: colors.white,
              textAlign: 'center',
              padding: `3px ${padding.medium}`,
            },
          }}
        >
          {
            // eslint-disable-next-line
            isUnpublishedIdea ? (
              <>
                <Typography
                  sx={{
                    background: colors.darkTeal,
                    borderRadius: `${borderRadius.standard} ${borderRadius.standard} 0 0`,
                  }}
                >
                  Id??
                </Typography>
              </>
            ) : organisation?.name !== 'OPKoKo' ? (
              <>
                {eventDay !== undefined && (
                  <Typography
                    sx={{
                      background: colors.darkTeal,
                      borderRadius: `${borderRadius.standard} 0 0 0`,
                    }}
                  >
                    {formatDayTime(eventDay)}
                  </Typography>
                )}
                <Typography sx={{ background: colors.blue }}>{organisation?.name}</Typography>
                <Typography
                  sx={{
                    borderRadius: `0 ${borderRadius.standard} 0 0`,
                    background: category?.color,
                  }}
                >
                  {category?.name}
                </Typography>
              </>
            ) : (
              <>
                {eventDay !== undefined && (
                  <Typography
                    sx={{
                      background: colors.darkTeal,
                      borderRadius: `${borderRadius.standard} 0 0 0`,
                    }}
                  >
                    {organisation?.name}
                  </Typography>
                )}
                <Typography sx={{ background: colors.blue }}>{event?.comment}</Typography>
                <Typography
                  sx={{
                    borderRadius: `0 ${borderRadius.standard} 0 0`,
                    background: category?.color,
                  }}
                >
                  {category?.name}
                </Typography>
              </>
            )
          }
        </Box>
        <Paper sx={{ display: 'grid', padding: padding.standard, height: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5">{lecture.title}</Typography>
            <div>
              {organisation?.name === 'OPKoKo' ? (
                <Button
                  onClick={() => {
                    setOpenVideoLinkForm(true);
                  }}
                  variant="contained"
                  size="large"
                  disabled={status?.name === 'Nekad'}
                  sx={{ display: 'row', gridGap: padding.tiny }}
                >
                  <Typography>SKICKA IN VIDEOPITCH </Typography>
                  <VideoCameraFront />
                </Button>
              ) : (
                editIcon &&
                (isUnpublishedIdea ? (
                  <IconButton onClick={on} size="large">
                    <EditIcon />
                  </IconButton>
                ) : (
                  <IconButton component={NavLink} to={`${editLink}${lecture.id}`} size="large">
                    <EditIcon />
                  </IconButton>
                ))
              )}
              {deleteIcon && (
                <IconButton onClick={handleDelete} size="large">
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </Box>
          <Typography sx={{ marginBottom: padding.standard }}>
            {lecture.lecturer
              ? `Anm??ld av ${lecture.lecturer} den ${time}`
              : `Skapad av ${createdBy} den ${time}`}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'max-content 1fr max-content',
              gridGap: padding.minimal,
            }}
          >
            {organisation?.name !== 'OPKoKo'
              ? table.map((e) => (
                  <Fragment key={e.name}>
                    <Typography sx={{ gridColumn: 'span 1' }}>{e.name}:</Typography>
                    <Typography sx={{ gridColumn: 'span 2' }}>{e.value}</Typography>
                  </Fragment>
                ))
              : opkokoTable.map((e) => (
                  <Fragment key={e.name}>
                    <Typography sx={{ gridColumn: 'span 1' }}>{e.name}:</Typography>
                    <Typography sx={{ gridColumn: 'span 2' }}>{e.value}</Typography>
                  </Fragment>
                ))}

            <Box sx={{ gridColumn: 'span 2' }} />
            {!isUnpublishedIdea && !admin && organisation?.name !== 'OPKoKo' && (
              <Typography sx={{ gridColumn: 'span 1' }}>
                {lecture.approved ? 'Godk??nd' : 'Bidraget ??r inskickat till urval'}
              </Typography>
            )}
            {admin && organisation?.name !== 'OPKoKo' && (
              <Button
                sx={{ gridColumn: 'span 1' }}
                variant={lecture.approved ? undefined : 'contained'}
                color={lecture.approved ? undefined : 'primary'}
                onClick={handleApprove}
              >
                {lecture.approved ? '??terkalla godk??nnande' : 'Godk??nn'}
              </Button>
            )}
          </Box>
          {organisation?.name === 'OPKoKo' && (
            <Box
              sx={{
                display: 'grid',
                minWidth: '100%',
                maxWidth: '100%',
                gridTemplateColumns: 'max-content max-content 1fr max-content',
                gridTemplateAreas: `"title icon . info"
                            "content content content content"`,
                padding: padding.small,
                paddingLeft: padding.xlarge,
                gridGap: `${padding.minimal}`,
              }}
            >
              <Discussion opkoko={organisation?.name === 'OPKoKo'} />
            </Box>
          )}
          {showAttendance && <LectureAttendanceList lecture={lecture} />}
        </Paper>
      </Box>
    </LectureContext.Provider>
  );
};

export default LectureView;
