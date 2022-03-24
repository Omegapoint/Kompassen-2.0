import { ReactElement } from 'react';
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
    </>
  );
};

export default SideMenuOPKoKo;
