import { ReactElement } from 'react';
import CompetenceDays from '../../components/competenceDays/CompetenceDays';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import SideCard from '../../components/sideCard/SideCard';
import { checkAccess, ROLE } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

const SideMenuCompetenceDays = (): ReactElement => (
  <>
    {checkAccess([ROLE.ADMIN, ROLE.COMPETENCE_DAY_PLANNER]) && (
      <SideCard
        hrefText="Planera kompetensdagar"
        hrefBarColor={colors.blue}
        href="/events/competencedays"
      />
    )}
    <SideCard
      title="Nästa kompetensdag"
      hrefText="Anmäl pass till kompetensdagar"
      hrefBarColor={colors.orange}
      href="/lecture/competenceday/create"
    >
      <CompetenceDays />
    </SideCard>
    <SideCard title="Mina senaste pass" hrefText="Hantera mina anmälda pass " href="/lecture/user">
      <LatestLectures />
    </SideCard>

    {/* <SideCard title="Trendar just nu">
        <WordCloud />
      </SideCard> */}

    {/* TODO: Add some content to this */}
    {/* <SideCard title="Funderar på att hålla i ett pass?"> */}
    {/*  <Interested /> */}
    {/* </SideCard> */}
    {/* <SideCard title="Snabbguide för Omegapoint Kompassen> */}
    {/*  <QuickGuide /> */}
    {/* </SideCard> */}
    {/* <SideCard title="Nuvarande planerare"> */}
    {/*  <CurrentPlanner /> */}
    {/* </SideCard> */}
  </>
);

export default SideMenuCompetenceDays;
