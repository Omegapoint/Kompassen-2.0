import { Box } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { constants } from '../../theme/Theme';

interface ContentProps {
  children: ReactNode;
}

const Content = ({ children }: ContentProps): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      justifyItems: 'center',
      alignContent: 'start',
      minWidth: '200px',
      minHeight: `calc(100vh - ${constants.headerHeight})`,
      padding: [0, '20px'],
      '& > div': { width: '100%' },
    }}
  >
    {children}
  </Box>
);

export default Content;
