import { Box,  ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ReactElement,  useState } from 'react';
import { padding } from '../../theme/Theme';
import HomeCompetenceDays from './HomeCompetenceDays';
import HomeOPKoKo from './HomeOpKoKo';
import SideMenuCompetenceDays from './SideMenuCompetenceDays';
import SideMenuOPKoKo from './SideMenuOPKoKo';



const Home = (): ReactElement => {
  const [alignment, setAlignment] = useState<string | null>('kompetensdag');

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
    setAlignment(newAlignment);
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
{alignment === "kompetensdag" && <HomeCompetenceDays/>}
{alignment==="opkoko" && <HomeOPKoKo/>}
      <Box
        sx={{
          display: 'grid',
          width: '320px',
          gridGap: padding.standard,
          alignContent: 'start',
        }}
      >
        <ToggleButtonGroup
          value={alignment}
          exclusive
          fullWidth
          onChange={handleAlignment}
          aria-label="Kompetensdagar eller OPKoKo"
        >
          <ToggleButton value="kompetensdag" aria-label="Kompetensdagar">
            Kompetensdagar
          </ToggleButton>
          <ToggleButton value="opkoko" aria-label="OPKoKo">
            OPKoKo
          </ToggleButton>
        </ToggleButtonGroup>

       
        {alignment === "kompetensdag" && <SideMenuCompetenceDays/>}
        {alignment === "opkoko" && <SideMenuOPKoKo/>}
      </Box>
      </Box>
    
  );
};

export default Home;
