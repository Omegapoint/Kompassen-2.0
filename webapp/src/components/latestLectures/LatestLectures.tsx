import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import { padding } from '../../theme/Theme';
import SmallLoader from '../loader/SmallLoader';
import LectureInfo from './LectureInfo';

const LatestLectures = (): ReactElement => {
  const { data, isLoading } = useQuery(`listMyLectures`, () => listLectures({ mine: 'true' }));

  if (isLoading || !data) return <SmallLoader />;

  const latestLectureList = [...data].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
  const slicedLectureList = latestLectureList.slice(0, 3);

  return (
    <Box sx={{ display: 'grid', gridGap: padding.standard }}>
      {slicedLectureList.map((e) => (
        <LectureInfo key={e.id} lecture={e} />
      ))}
    </Box>
  );
};

export default LatestLectures;
