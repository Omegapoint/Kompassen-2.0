import { Box, Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ReactElement, useState } from 'react';
import { checkAccess, ROLE } from '../../lib/Lib';
import { padding } from '../../theme/Theme';
import HomeCompetenceDays from './HomeCompetenceDays';
import HomeOPKoKo from './HomeOPKoKo';
import SideMenuCompetenceDays from './SideMenuCompetenceDays';
import SideMenuOPKoKo from './SideMenuOPKoKo';

const Home = (): ReactElement => {
  const [alignment, setAlignment] = useState<string>('opkoko');

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr max-content',
        gridTemplateRows: 'max-content auto auto auto auto',
        gridGap: `${padding.medium} ${padding.large}`,
        padding: '0 20px',
      }}
    >
      {alignment === 'kompetensdag' && <HomeCompetenceDays />}
      {alignment === 'opkoko' && <HomeOPKoKo />}
      <Box
        sx={{
          display: 'grid',
          width: '320px',
          gridGap: padding.standard,
          alignContent: 'start',
        }}
      >
        { checkAccess([ROLE.ADMIN, ROLE.COMPETENCE_DAY_PLANNER, ROLE.OPKOKO_PROGRAM_COMMITTEE]) && (
          <ButtonGroup
            fullWidth
            variant="outlined"
          >
            { checkAccess([ROLE.ADMIN, ROLE.OPKOKO_PROGRAM_COMMITTEE]) && (
              <Button href="/events/opkokos" >Planera OPKoKo</Button>
            )}
            { checkAccess([ROLE.ADMIN, ROLE.COMPETENCE_DAY_PLANNER]) && (
              <Button href="/events/competencedays" sx={{textAlign:'center'}}>Planera Kompetensdag</Button>
            )}
          </ButtonGroup>
        )}
        <ToggleButtonGroup
          value={alignment}
          color="warning"
          exclusive
          fullWidth
          onChange={handleAlignment}
          aria-label="Kompetensdagar eller OPKoKo"
        >
          <ToggleButton value="opkoko" aria-label="OPKoKo">
            OPKoKo
          </ToggleButton>
          <ToggleButton value="kompetensdag" aria-label="Kompetensdagar">
            Kompetensdagar
          </ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ width: '320px', gridGap: padding.standard }}>
          {alignment === 'kompetensdag' && <SideMenuCompetenceDays />}
          {alignment === 'opkoko' && <SideMenuOPKoKo />}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
