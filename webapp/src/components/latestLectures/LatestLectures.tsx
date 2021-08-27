import { makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import { padding } from '../../theme/Theme';
import SmallLoader from '../loader/SmallLoader';
import LectureInfo from './LectureInfo';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
  },
}));

const LatestLectures = (): ReactElement => {
  const classes = useStyles();
  const { data, isLoading } = useQuery(`listMyLectures`, () => listLectures({ mine: 'true' }));

  if (isLoading || !data) return <SmallLoader />;

  const latestLectureList = [...data].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
  const slicedLectureList = latestLectureList.slice(0, 3);

  return (
    <div className={classes.container}>
      {slicedLectureList.map((e) => (
        <LectureInfo key={e.id} lecture={e} />
      ))}
    </div>
  );
};

export default LatestLectures;
