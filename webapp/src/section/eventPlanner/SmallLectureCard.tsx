import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';

interface LectureCardProps {
  lecture: Lecture;
  color: string;
  icon: string;
}

const SmallLectureCard = ({ lecture, color, icon }: LectureCardProps): ReactElement => (
  <Box
    display="flex"
    sx={{
      border: `1px solid ${color}`,
      borderRadius: '4px',
      padding: '10px',
      backgroundColor: `${color}20`,
    }}
  >
    <Box marginRight="10px" width="20px" height="20px" dangerouslySetInnerHTML={{ __html: icon }} />
    <Typography>{lecture.title}</Typography>
  </Box>
);

export default SmallLectureCard;
