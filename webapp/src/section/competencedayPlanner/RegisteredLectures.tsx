import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import LectureCard from './LectureCard';

interface RegisteredLecturesProps {
  lectures: Lecture[];
  admin?: boolean;
}

const RegisteredLectures = ({ lectures, admin = false }: RegisteredLecturesProps): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      gridGap: padding.standard,
      gridTemplateColumns: '1fr 1fr 1fr',
    }}
  >
    {lectures.map((e) => (
      <LectureCard key={e.id} lecture={e} edit admin={admin} />
    ))}
  </Box>
);

export default RegisteredLectures;
