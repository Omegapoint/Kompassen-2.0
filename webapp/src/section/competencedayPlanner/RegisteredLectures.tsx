import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import LectureCard from './LectureCard';

interface RegisteredLecturesProps {
  lectures: Lecture[];
  admin?: boolean;
  opkoko?: boolean;
}

const RegisteredLectures = ({
  lectures,
  admin = false,
  opkoko = false,
}: RegisteredLecturesProps): ReactElement => {
  const statuses = useAppSelector((state) => state.statuses);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: opkoko ? 'max-content' : '1fr 1fr 1fr',
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
          <LectureCard key={e.id} lecture={e} edit admin={admin} opkoko={opkoko} />
        ))}
    </Box>
  );
};

export default RegisteredLectures;
