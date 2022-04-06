import { Box, Divider, Typography } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { colors, padding } from '../../theme/Theme';

interface ColumnProps {
  title: string;
  children: ReactNode;
}

const Column = ({ title, children }: ColumnProps): ReactElement => (
  <Box sx={{ display: 'grid', gridGap: padding.small }}>
    <Typography variant="h5" sx={{ color: colors.orange }}>
      {title}
    </Typography>
    <Divider sx={{ width: '100%' }} />
    <Box
      sx={{
        display: 'grid',
        gridGap: padding.small,
        '& >*': { width: '100%' },
      }}
    >
      {children}
    </Box>
  </Box>
);

export default Column;
