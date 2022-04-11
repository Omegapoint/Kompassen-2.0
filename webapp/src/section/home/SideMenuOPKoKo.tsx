import { Button } from '@mui/material';
import { ReactElement } from 'react';
import KoKoEvents from '../../components/KoKoEvents/KoKoEvents';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import OPKoKoEvents from '../../components/OPKoKoEvents/OPKoKoSidebar';
import SideCard from '../../components/sideCard/SideCard';

const SideMenuOPKoKo = (): ReactElement => (
  <>
    {' '}
    <SideCard headerText="Kommande OPKoKos">
      <KoKoEvents />
    </SideCard>
    <SideCard headerText="Mina bidrag">
      {' '}
      <SideCard headerText="Kommande OPKoKos">
        <OPKoKoEvents />
      </SideCard>
      <SideCard
        title={data === undefined || data.length > 0 ? 'Mina inskickade bidrag' : ''}
        headerText="Mina bidrag"
      >
        {' '}
      <LatestLectures />
      <Button variant="outlined" href="/lecture/user">
        Hantera inskickade bidrag
      </Button>
    </SideCard>
  </>
);
export default SideMenuOPKoKo;
