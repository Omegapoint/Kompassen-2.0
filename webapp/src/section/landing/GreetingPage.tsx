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
      height: ['100vh', '100vh'],
    }}
  >
    <Box
      sx={{
        background: `url(${loginBg})`,
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
        position: ['relative', 'static'],
        width: [window.innerWidth, 'auto'],
      }}
    >
      <Typography
        color="secondary"
        variant="body1"
        sx={{
          fontFamily: fontFamilies.header,
          fontSize: ['3rem', '4rem'],
          textAlign: ['center', 'start'],
        }}
      >
        KomPass 2.0
      </Typography>
      <Typography color="secondary" variant="h2" sx={{ textAlign: ['center', 'start'] }}>
        Skapa bättre kompetensdagar
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
        position: ['absolute', 'static'],
        bottom: [0, 'auto'],
      }}
    >
      {children}
    </Box>
  </Box>
);

export default GreetingPage;
