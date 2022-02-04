import { Box, Button, Modal, Typography } from '@mui/material';
import { addSeconds, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import React, { ReactElement } from 'react';
import LectureView from '../../components/lectureView/LectureView';
import useBoolean from '../../hooks/UseBoolean';
import { useAppSelector } from '../../lib/Lib';
import { Category, Lecture } from '../../lib/Types';
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
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find((e) => e.id === lecture.categoryID) as Category;
  const { azureUser } = useAppSelector((state) => state.session);
  const isOwner = lecture.lecturerID === azureUser.id;
  const [open, { on, off }] = useBoolean();

  const genTime = (time: Date) => {
    const s = format(time, 'HH:mm', { locale: sv });
    const e = format(addSeconds(time, lecture.duration || 0), 'HH:mm', { locale: sv });
    return `${s} - ${e}`;
  };

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
            {startAt ? genTime(startAt) : `${(lecture.duration || 0) / 60} min`}
          </Typography>

          <Typography>{lecture.lecturer}</Typography>
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
          {!edit ||
            (!admin && (
              <Button variant="contained" color="primary" onClick={on}>
                Visa
              </Button>
            ))}
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
