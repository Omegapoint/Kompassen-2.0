import { Button } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import LatestLectures from '../../components/latestLectures/LatestLectures';
import OPKoKoEvents from '../../components/OPKoKoEvents/OPKoKoSidebar';
import SideCard from '../../components/sideCard/SideCard';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';

const SideMenuOPKoKo = (): ReactElement => {
  const user = useAppSelector((state) => state.user);
  const { data } = useQuery(`listMyLectures`, () => listLectures());
  const [myData, setMyData] = useState<Lecture[]>();

  useEffect(() => {
    if (data) {
      setMyData(
        data.filter((lecture) => lecture.lecturers?.some((lecturer) => lecturer.userID === user.id))
      );
    }
  }, [data, user.id]);
  return (
    <>
      {' '}
      <SideCard headerText="Kommande OPKoKos">
        <OPKoKoEvents />
      </SideCard>
      <SideCard
        title={myData === undefined || myData.length > 0 ? 'Mina inskickade bidrag' : ''}
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
};
export default SideMenuOPKoKo;
