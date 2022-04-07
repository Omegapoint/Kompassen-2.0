import { Button } from '@mui/material';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import KoKoEvents from '../../components/KoKoEvents/KoKoEvents';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import SideCard from '../../components/sideCard/SideCard';
import { checkAccess, ROLE } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

const SideMenuOPKoKo = (): ReactElement => {
  const { data } = useQuery(`listMyLectures`, () => listLectures({ mine: 'true' }));
  return (
    <>
      {' '}
      <SideCard
        headerText="Kommande OPKoKos"
        bgColor={colors.blue}
      >
        <KoKoEvents />
      </SideCard>
      <SideCard
        title={data === undefined || data.length > 0 ? 'Mina inskickade bidrag' : ''}
        headerText="Mina senaste inskickade bidrag"
        bgColor={colors.blue}
      >
        {' '}
        <LatestLectures />
      </SideCard>
    </>
  );
};

export default SideMenuOPKoKo;
