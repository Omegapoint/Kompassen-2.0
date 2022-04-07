import { Link, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import KoKoEvents from '../../components/KoKoEvents/KoKoEvents';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import SideCard from '../../components/sideCard/SideCard';
import { colors } from '../../theme/Theme';

const SideMenuOPKoKo = (): ReactElement => {
  const { data } = useQuery(`listMyLectures`, () => listLectures({ mine: 'true' }));
  return (
    <>
      {' '}
      {/* {isAdmin() && (
        <SideCard headerText="Planera OPKoKo" bgColor={colors.blue} href="/events/opkokos" />
      )} */}
      {/* <SideCard
        headerText="Skicka in bidrag till OPKoKo"
        bgColor={colors.orange}
        // href="/lecture/OPKoKo/create"
        title="Nästa OPKoKo"
      >
        <KoKoEvents />
      </SideCard>
      <SideCard headerText="Information om OPKoKo" /* href="/opkokoinfo" */ title="Information">
        <Typography variant="body1">
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
      </SideCard>
      <SideCard
        title={data === undefined || data.length > 0 ? 'Mina inskickade bidrag' : ''}
        headerText="Hantera mina inskickade bidrag"
        // href="/lecture/user"
      >
        {' '}
        <LatestLectures />
      </SideCard>
    </>
  );
};

export default SideMenuOPKoKo;
