import { makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { listLectures } from '../../api/Api';
import { useAppSelector } from '../../lib/Lib';
import { padding } from '../../theme/Theme';
import SmallLoader from '../loader/SmallLoader';
import Lecture from './lecture';

const date1 = new Date();
date1.setDate(date1.getDate() - 1);

const date2 = new Date();
date2.setDate(date2.getDate() - 120);

const date3 = new Date();
date3.setDate(date3.getDate() - 50);

interface MappableClass {
  title: string;
  location: string;
  date: Date;
  icon: string;
  name: string;
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
  },
}));

const LatestLectures = (): ReactElement => {
  const classes = useStyles();
  const locations = useAppSelector((state) => state.locations);
  const categories = useAppSelector((state) => state.categories);
  const { data, isLoading } = useQuery(`listMyLectures`, () => listLectures({ mine: 'true' }));

  if (isLoading || !data) return <SmallLoader />;

  const latestlectureList = [...data].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
  const slicedlectureList = latestlectureList.slice(0, 3);

  const mappableClasses = slicedlectureList.map((lecture) => {
    const lastLectureItem: MappableClass = {
      title: lecture.title,
      location: locations.find((loc) => loc.id === lecture.locationID)?.name || '-',
      date: lecture.updatedAt,
      icon: categories?.find((cat) => cat.id === lecture.categoryID)?.icon as string,
      name: (categories?.find((cat) => cat.id === lecture.categoryID)?.name as string) || '',
    };
    return lastLectureItem;
  });

  return (
    <div className={classes.container}>
      {mappableClasses.map((e) => (
        <Lecture
          key={e.title + e.icon + e.date.toString()}
          title={e.title}
          location={e.location}
          date={e.date}
          name={e.name}
          icon={e.icon}
        />
      ))}
    </div>
  );
};

export default LatestLectures;
