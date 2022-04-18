import { Box, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import { useAppSelector } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import SmallLoader from '../loader/SmallLoader';
import LectureInfo from './LectureInfo';

const LatestLectures = (): ReactElement => {
  const user = useAppSelector((state) => state.user);
  const { data, isLoading } = useQuery(`listMyLectures`, () => listLectures());
  const [myData, setMyData] = useState<Lecture[]>();

  useEffect(() => {
    if (data) {
      setMyData(
        data.filter((lecture) => lecture.lecturers?.some((lecturer) => lecturer.userID === user.id))
      );
    }
  }, [data, user.id]);

  if (isLoading || !data) return <SmallLoader />;

  const latestLectureList = [...(myData ?? data)].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
  const slicedLectureList = latestLectureList.slice(0, 3);

  return (
    <Box sx={{ display: 'grid', gridGap: padding.standard }}>
      {slicedLectureList.length > 0 ? (
        slicedLectureList.map((e) => <LectureInfo key={e.id} lecture={e} />)
      ) : (
        <Typography>Inga bidrag inskickade</Typography>
      )}
    </Box>
  );
};

export default LatestLectures;
