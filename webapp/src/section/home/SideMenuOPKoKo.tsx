import { Button } from '@mui/material';
import { ReactElement } from 'react';
import KoKoEvents from '../../components/KoKoEvents/KoKoEvents';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import SideCard from '../../components/sideCard/SideCard';

const SideMenuOPKoKo = (): ReactElement => (
  <>
    {' '}
    <SideCard headerText="Kommande OPKoKos">
      <KoKoEvents />
    </SideCard>
    <SideCard headerText="Mina bidrag">
      {' '}
      <LatestLectures />
      <Button variant="outlined" href="/lecture/user">
        Hantera inskickade bidrag
      </Button>
    </SideCard>
  </>
);
export default SideMenuOPKoKo;
