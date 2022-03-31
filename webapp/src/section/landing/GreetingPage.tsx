import { Box, Typography } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import loginBg from '../../assets/loginBg.svg';
import { fontFamilies } from '../../theme/Theme';

interface GreetingPageProps {
  children: ReactNode;
}

const GreetingPage = ({ children }: GreetingPageProps): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      height: '100vh',
    }}
  >
    <Box
      sx={{
        background: `url(${loginBg})`,
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        color="secondary"
        variant="body1"
        sx={{ fontFamily: fontFamilies.header, fontSize: '2.0rem' }}
      >
        OMEGAPOINT KOMPASSEN
      </Typography>
      <Typography color="secondary" variant="h2">
        Skapa bättre kompetensutveckling
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      {children}
    </Box>
  </Box>
);

export default GreetingPage;
