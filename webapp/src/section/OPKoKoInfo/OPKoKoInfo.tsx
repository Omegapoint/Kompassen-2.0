import { Box, Link, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const OPKoKoInfo = (): ReactElement => (
  <Box
    sx={{
      width: '80%',
      display: 'flex',
      gridTemplateColumns: '1fr max-content',
      gridTemplateRows: 'max-content auto auto auto auto',
      gridGap: `${padding.medium} ${padding.large}`,
      padding: '0 300px 0px 100px',
    }}
  >
    <Typography variant="h6">
      OPKoKo är Omegapoints kompetenskonferens som går av stapeln två gånger per år. Den samlar och
      engagerar hela företaget. Under flera dagar delar vi med oss av kunskap och erfarenheter i
      föreläsningar, labbar och workshops. OPKoKo är också ett sätt för oss att lära känna varandra
      ännu bättre. <br />
      <br />
      <Link href="https://www.lyyti.fi/p/OPKoKo2022/se" target="_blank" rel="noopener">
        Anmäl dig som konferensdeltagare
      </Link>{' '}
      <br />
      Har du frågor?
      <br />
      Slack:{' '}
      <Link href="https://opchat.slack.com/archives/C0CFJCZ50" target="_blank" rel="noopener">
        #opkoko
      </Link>
      <br />
      Mail: <Link href="mailto:opkoko@omegapoint.se">opkoko@omegapoint.se</Link>
      <br />
      Eventyr: <Link href="mailto:omegapoint@eventyr.se">omegapoint@eventyr.se</Link>
      <br />
    </Typography>
    <Typography variant="body1">
      Vid frågor & funderingar om konferensen eller om du vill engagera dig i planeringen, ta
      kontakt med någon i arbetsgruppen eller skicka mail till{' '}
      <Link href="mailto:opkoko@omegapoint.se">opkoko@omegapoint.se</Link>.<br />
      <br />
      För praktiska- och resetekniska frågor, ta gärna kontakt med: Anders Wiström & Amanda Hörnell
      hos vår eventpartner Eventyr Nine Yards,{' '}
      <Link href="mailto:omegapoint@eventyr.se">omegapoint@eventyr.se</Link>.
    </Typography>
  </Box>
);

export default OPKoKoInfo;
