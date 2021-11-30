import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Fragment, ReactElement } from 'react';
import { useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';
import { approveLecture } from '../../api/Api';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent } from '../../hooks/UseReduxState';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { formatDayTime } from '../competenceDays/DayPicker';
import UpdateLectureIdea from '../updateLectureIdea/UpdateLectureIdea';

interface LectureViewProps {
  lecture: Lecture;
  handleDelete?: () => Promise<void>;
  editIcon?: boolean;
  deleteIcon?: boolean;
  admin?: boolean;
  close?: () => void;
  onSuccess?: () => unknown;
}

const LectureView = ({
  lecture,
  handleDelete,
  editIcon = false,
  deleteIcon = false,
  admin = false,
  close,
  onSuccess,
}: LectureViewProps): ReactElement => {
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID);
  const isUnpublishedIdea = lecture.idea && !lecture.eventID;
  const locations = useAppSelector((state) => state.locations);
  const location = locations.find((e) => e.id === lecture.locationID)?.name;
  const eventDay = useEvent(lecture.eventID!);
  const [open, { on, off }] = useBoolean();

  const { mutateAsync } = useMutation(approveLecture);
  const table = [
    { name: 'Passhållare', value: lecture.lecturer },
    { name: 'Längd', value: ((lecture.duration || 0) / 60)?.toString().concat(' ', 'minuter') },
    { name: 'Distans', value: lecture.remote ? 'Ja' : 'Nej' },
    { name: 'Max antal', value: lecture.maxParticipants },
    { name: 'Meddelande', value: lecture.message },
    { name: 'Beskrivning', value: lecture.description },
    { name: 'Förkunskapskrav', value: lecture.requirements },
    { name: 'Förberedelser', value: lecture.preparations },
    { name: 'Taggar', value: lecture.tags.reduce((s, e) => `${s} ${e}`, '') },
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
            <Typography sx={{ background: colors.blue }}>{location}</Typography>
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

      <Paper sx={{ display: 'grid', padding: padding.standard }}>
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
                <IconButton component={NavLink} to={`/lecture/edit/${lecture.id}`} size="large">
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
          {`Anmäld av ${lecture.lecturer} den ${time}`}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr max-content',
            gridGap: padding.minimal,
          }}
        >
          {table.map((e) => (
            <Fragment key={e.name}>
              <Typography sx={{ gridColumn: 'span 1' }}>{e.name}:</Typography>
              <Typography sx={{ gridColumn: 'span 2' }}>{e.value}</Typography>
            </Fragment>
          ))}
          <Box sx={{ gridColumn: 'span 2' }} />
          {!isUnpublishedIdea && !admin && (
            <Typography sx={{ gridColumn: 'span 1' }}>
              {lecture.approved ? 'Godkänd' : 'Väntar på godkännande'}
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
      </Paper>
    </Box>
  );
};

export default LectureView;
