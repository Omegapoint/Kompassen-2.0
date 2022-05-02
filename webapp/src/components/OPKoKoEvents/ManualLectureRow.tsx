import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import LectureCard from '../../section/competencedayPlanner/LectureCard';
import { padding } from '../../theme/Theme';
import ModeratorLectureCard from './ModeratorLectureCard';

interface ManualLectureRowProps {
  lectures: Lecture[];
  admin?: boolean;
  opkoko?: boolean;
  format?: string;
}

const ManualLectureRow = ({
  lectures,
  admin = false,
  opkoko = false,
  format,
}: ManualLectureRowProps): ReactElement => {
  const statuses = useAppSelector((state) => state.statuses);
  return (
    <>
      <Typography>{format}:</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: opkoko ? 'max-content' : '1fr 1fr 1fr 1fr 1fr 1fr',
          gridTemplateRows: 'max-content',
          gridGap: padding.standard,
        }}
      >
        {lectures
          .filter((lecture) =>
            statuses.some(
              (status) =>
                status.id === lecture.status?.statusID &&
                (status.name === 'Accepterad' || status.name === 'Feedback')
            )
          )
          .map((e) => (
            <LectureCard key={e.id} lecture={e} edit admin={admin} opkoko={opkoko} />
          ))}

        {lectures
          .filter(
            (lecture) =>
              !statuses.some(
                (status) =>
                  status.id === lecture.status?.statusID &&
                  (status.name === 'Accepterad' || status.name === 'Feedback')
              )
          )
          .map((e) => (
            <ModeratorLectureCard key={e.id} lecture={e} />
          ))}
      </Box>
    </>
  );
};

export default ManualLectureRow;
