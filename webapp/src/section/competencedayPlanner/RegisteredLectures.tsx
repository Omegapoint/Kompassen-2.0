import { Box } from '@mui/material';
import { ReactElement } from 'react';
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
}: RegisteredLecturesProps): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: opkoko ? 'max-content' : '1fr 1fr 1fr',
      gridTemplateRows: 'max-content auto auto auto auto',
      gridGap: padding.standard,
    }}
  >
    {lectures.map((e) => (
      <LectureCard key={e.id} lecture={e} edit admin={admin} opkoko={opkoko} />
    ))}
  </Box>
);

export default RegisteredLectures;
