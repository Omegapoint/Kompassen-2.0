import { ReactElement } from 'react';
import CompetenceDays from '../../components/competenceDays/CompetenceDays';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import SideCard from '../../components/sideCard/SideCard';

const SideMenuCompetenceDays = (): ReactElement => (
  <>
    <SideCard headerText="Kommande Kompetensdagar">
      <CompetenceDays />
    </SideCard>
    <SideCard title="Mina senaste pass" headerText="Hantera mina anmälda pass ">
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
