import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Fragment, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { approveLecture } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import useAzureUser from '../../hooks/UseAzureUser';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent } from '../../hooks/UseReduxState';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { formatDayTime } from '../competenceDays/DayPicker';
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
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID);
  const formats = useAppSelector((state) => state.formats);
  const formatName = formats.find((e) => e.id === lecture.formatID);
  const events = useAppSelector((state) => state.events);
  const event = events.find((e) => e.id === lecture.eventID);
  const organisations = useAppSelector((state) => state.organisations);
  const organisation = organisations.find((e) => e.id === event?.organisationID);
  const editLink = organisation?.name === 'OpKoKo' ? '/lecture/OpKoKo/edit/' : '/lecture/edit/';

  const [lecturers, setLecturers] = useState(['']);
  
  useEffect(() => {
    const lecturersName: string[] = [];

    const lecturersName = [''];
    async function fetchMyAPI(lecturer: string) {
      return getAzureUser(lecturer).then((azureUser) => azureUser.displayName);
    }

    if (lecture.lecturelecturers !== null && lecture.lecturelecturers !== undefined) {
      lecture.lecturelecturers.map((lecturer) => fetchMyAPI(lecturer).then((value) => lecturersName.push(value)));
      setLecturers(lecturersName);
    }
  }, [lecture.lecturelecturers]);

  const isUnpublishedIdea = lecture.idea && !lecture.eventID;
  const eventDay = useEvent(lecture.eventID!);
  const [open, { on, off }] = useBoolean();
  const { name: createdBy } = useAzureUser(lecture.createdBy);

  const setLocation = (location: string | null): string => {
    if (location === 'local') return 'Endast på plats';
    if (location === 'distance') return 'Endast på distans';
    if (location === 'hybrid') return 'Både på plats och distans';
    return '';
  };

  const { mutateAsync } = useMutation(approveLecture);
  const table = [
    { name: 'Passhållare', value: lecture.lecturer },
    { name: 'Längd', value: ((lecture.duration || 0) / 60)?.toString().concat(' ', 'minuter') },
    { name: 'Distans', value: setLocation(lecture.remote) },
    { name: 'Max antal', value: lecture.maxParticipants },
    { name: 'Meddelande', value: lecture.message },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'Förkunskapskrav', value: lecture.requirements },
    { name: 'Förberedelser', value: lecture.preparations },
    { name: 'Taggar', value: lecture.tags.reduce((s, e) => `${s} ${e}`, '') },
  ].map((e) => ({ ...e, value: e.value || '-' }));

  const opkokoTable = [
    { name: 'Talare', value: lecturers.join(", ") },
    { name: 'Titel', value: lecture.title },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'Intern presentation', value: lecture.internalPresentation ? 'Ja' : 'Nej' },
    { name: 'Key take away', value: lecture.keyTakeaway },
    { name: 'Format', value: formatName?.name },
    { name: 'Målgrupp', value: lecture.targetAudience },
    { name: 'Förkunskapskrav', value: lecture.requirements },
    { name: 'Meddelande', value: lecture.message },
  ].map((e) => ({ ...e, value: e.value || '-' }));

  const handleApprove = async () => {
    await mutateAsync({ approved: !lecture.approved, id: lecture.id });
    if (close) close();
  };

  const time = format(lecture.createdAt, 'd LLLLLL', { locale: sv });
  return (
    <Box
      sx={{
        display: 'grid',
        borderRadius: `${borderRadius.small} ${borderRadius.small} 0 0`,
      }}
    >
      <UpdateLectureIdea
        open={open}
        close={() => {
          if (onSuccess) onSuccess();
          off();
        }}
        lecture={lecture}
      />
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
        {isUnpublishedIdea ? (
          <>
            <Typography
              sx={{
                background: colors.darkTeal,
                borderRadius: `${borderRadius.standard} ${borderRadius.standard} 0 0`,
              }}
            >
              Idé
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
        )}
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
            {editIcon &&
              (isUnpublishedIdea ? (
                <IconButton onClick={on} size="large">
                  <EditIcon />
                </IconButton>
              ) : (
                <IconButton component={NavLink} to={`${editLink}${lecture.id}`} size="large">
                  <EditIcon />
                </IconButton>
              ))}
            {deleteIcon && (
              <IconButton onClick={handleDelete} size="large">
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </Box>
        <Typography sx={{ marginBottom: padding.standard }}>
          {lecture.lecturer
            ? `Anmäld av ${lecture.lecturer} den ${time}`
            : `Skapad av ${createdBy} den ${time}`}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr max-content',
            gridGap: padding.minimal,
          }}
        >
          {organisation?.name !== 'OpKoKo'
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
          {!isUnpublishedIdea && !admin && (
            <Typography sx={{ gridColumn: 'span 1' }}>
              {lecture.approved ? 'Godkänd' : 'Bidraget är inskickat till urval'}
            </Typography>
          )}
          {admin && (
            <Button
              sx={{ gridColumn: 'span 1' }}
              variant={lecture.approved ? undefined : 'contained'}
              color={lecture.approved ? undefined : 'primary'}
              onClick={handleApprove}
            >
              {lecture.approved ? 'Återkalla godkännande' : 'Godkänn'}
            </Button>
          )}
        </Box>
        {showAttendance && <LectureAttendanceList lecture={lecture} />}
      </Paper>
    </Box>
  );
};

export default LectureView;
