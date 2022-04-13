import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { addSeconds, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { likeLecture, unlikeLecture } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import LectureView from '../../components/lectureView/LectureView';
import useBoolean from '../../hooks/UseBoolean';
import { checkAccess, ROLE, useAppSelector } from '../../lib/Lib';
import { Category, Format, Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';

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
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID) as Category;
  const formats = useAppSelector((state) => state.formats);
  const formatType = formats.find((e) => e.id === lecture.formatID) as Format;
  const { azureUser } = useAppSelector((state) => state.session);
  const isOwner = lecture.lecturerID === azureUser.id;
  const [open, { on, off }] = useBoolean();
  const likes = lecture.likes?.length || 0;
  const likeMutation = useMutation(likeLecture);
  const unlikeMutation = useMutation(unlikeLecture);
  const like = () => likeMutation.mutate({ id: lecture.id });
  const unlike = () => unlikeMutation.mutate({ id: lecture.id });
  const iconStyle = { width: '60px', height: '40px' };

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
  ].map((e) => ({ ...e, value: e.value || '-' }));

  return (
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
          width: opkoko ? '1000px' : '100%',
          maxWidth: '100%',
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
                <Typography sx={{ gridColumn: 'span 2', maxWidth: '800px' }}>{e.value}</Typography>
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

            <Typography>{lecturers[0] !== '' ? lecturers.join(', ') : lecture.lecturer}</Typography>
            {lecture.approved && admin && (
              <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
                Godkänt pass
              </Typography>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content max-content',
            alignItems: 'end',
            width: opkoko ? '900px' : '100%',
            paddingTop: padding.medium,
          }}
        >
          {edit &&
            checkAccess([
              ROLE.ADMIN,
              ROLE.COMPETENCE_DAY_PLANNER,
              ROLE.OPKOKO_PROGRAM_COMMITTEE,
              ROLE.OPKOKO_PLANNER,
            ]) && (
              <Button
                variant={lecture.approved ? undefined : 'contained'}
                color={lecture.approved ? undefined : 'primary'}
                onClick={on}
                sx={{ minWidth: '880px' }}
              >
                Hantera
              </Button>
            )}
          {lecture.likes?.includes(azureUser.id) ? (
            <IconButton sx={iconStyle} onClick={unlike} size="large">
              <Favorite sx={iconStyle} color="primary" />
            </IconButton>
          ) : (
            <IconButton sx={iconStyle} onClick={like} size="large">
              <FavoriteBorder sx={iconStyle} color="primary" />
            </IconButton>
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
      </Box>
    </Box>
  );
};

export default LectureCard;
