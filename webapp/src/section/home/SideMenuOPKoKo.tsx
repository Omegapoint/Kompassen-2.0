import { Button } from '@mui/material';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import KoKoEvents from '../../components/KoKoEvents/KoKoEvents';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import SideCard from '../../components/sideCard/SideCard';

const SideMenuOPKoKo = (): ReactElement => {
  const { data } = useQuery(`listMyLectures`, () => listLectures({ mine: 'true' }));
  return (
    <>
      {' '}
      <SideCard headerText="Kommande OPKoKos">
        <KoKoEvents />
      </SideCard>
      <SideCard
        title={data === undefined || data.length > 0 ? 'Mina inskickade bidrag' : ''}
        headerText="Mina bidrag"
      >
        {' '}
        <LatestLectures />
        <Button variant="contained" href="/lecture/user">
          Hantera inskickade bidrag
        </Button>
      </SideCard>
    </>
  );
};

export default SideMenuOPKoKo;
