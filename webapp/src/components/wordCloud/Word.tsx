import { Typography } from '@mui/material';
import { ReactElement } from 'react';
import { fontFamilies } from '../../theme/Theme';

interface WordProps {
  name: string;
  color: string;
  size: number;
}

const Word = ({ color, name, size }: WordProps): ReactElement => (
  <Typography
    sx={{
      fontSize: `${size}rem`,
      color,
      fontFamily: fontFamilies.header,
      lineHeight: 1,
    }}
  >
    {name}
  </Typography>
);

export default Word;
