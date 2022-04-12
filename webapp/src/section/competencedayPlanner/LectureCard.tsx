import { Box, Button, Modal, Typography } from '@mui/material';
import { addSeconds, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAzureUser } from '../../api/GraphApi';
import LectureView from '../../components/lectureView/LectureView';
import useBoolean from '../../hooks/UseBoolean';
import { useEvent } from '../../hooks/UseReduxState';
import { useAppSelector } from '../../lib/Lib';
import { Category, Format, Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';

export const cellHeight = 150;

interface LectureCardProps {
  lecture: Lecture;
  edit?: boolean;
  startAt?: Date;
  admin?: boolean;
}

const LectureCard = ({
  lecture,
  edit = false,
  startAt,
  admin = false,
}: LectureCardProps): ReactElement => {
  const { id } = useParams<'id'>();
  const event = useEvent(id!)!;
  const organisations = useAppSelector((state) => state.organisations);
  const organisation = organisations.find((e) => e.id === event.organisationID);
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID) as Category;
  const formats = useAppSelector((state) => state.formats);
  const formatType = formats.find((e) => e.id === lecture.formatID) as Format;
  const { azureUser } = useAppSelector((state) => state.session);
  const isOwner = lecture.lecturerID === azureUser.id;
  const [open, { on, off }] = useBoolean();

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

  return (
    <Box sx={{ background: `${colors.white}dd`, borderRadius: borderRadius.small }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr max-content',
          gridTemplateRows: 'max-content 1fr max-content',
          border: `${category.color} 1px solid`,
          background: `${category.color}20`,
          borderRadius: borderRadius.small,
          padding: padding.small,
          width: '100%',
          height: `${((edit ? 3600 : lecture.duration || 3600) / 3600) * cellHeight}px`,
        }}
      >
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

          <Typography>
            {organisation?.name !== 'OPKoKo' ? setLocation(lecture.remote) : formatType?.name}
          </Typography>
          {organisation?.name !== 'OPKoKo' && (
            <Typography>
              {startAt ? genTime(startAt) : `${(lecture.duration || 0) / 60} min`}
            </Typography>
          )}
          <Typography>{lecturers[0] !== '' ? lecturers.join(', ') : lecture.lecturer}</Typography>
          {lecture.approved && admin && (
            <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
              Godkänt pass
            </Typography>
          )}
        </Box>

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
      </Box>
    </Box>
  );
};

export default LectureCard;
