import { ReactElement } from 'react';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import SideCard from '../../components/sideCard/SideCard';
import { isAdmin } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

const SideMenuOPKoKo = (): ReactElement => {

  return (
       <>  {isAdmin() && (
        <SideCard hrefText="Planera OPKoKo" hrefBarColor={colors.blue} href="/events" />
      )}
      <SideCard
          hrefText="Anmäl pass till OpKoKo"
          hrefBarColor={colors.orange}
          href="/lecture/OpKoKo/create"
        />
        <SideCard
          title="Mina senaste pass"
          hrefText="Hantera mina anmälda pass "
          href="/lecture/user"
        >          <LatestLectures />
        </SideCard>
    </>
  );
};

export default SideMenuOPKoKo;
