import { ReactElement, useState, Fragment, useEffect, useContext } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { colors, padding } from '../../theme/Theme';
import { IconType } from '../latestLectures/lecture';
import ChartIcon from './ChartIcon';
import { useListLectureCategories } from '../../lib/Hooks';
import EventContext from './EventContext';
import SmallLoader from '../loader/SmallLoader';
import { useAppSelector } from '../../lib/Lib';

export const iconColor: IconType = {
  cloud: colors.yellow,
  code: colors.teal,
  shield: colors.darkOrange,
  sun: colors.lightGreen,
  vcs: colors.purple,
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.small,
  },
  subContainer: {
    display: 'grid',
    gridTemplateColumns: '25% 1fr',
    gridGap: padding.small,
  },
  descContainer: {
    display: 'grid',
    gridGap: padding.minimal,
    gridTemplateColumns: 'max-content 1fr max-content',
    alignItems: 'center',
    '& p': {
      lineHeight: '1',
    },
  },
  title: {},
  line: {},
}));

const size = 6;

const LectureStats = (): ReactElement => {
  const classes = useStyles();
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const [lectureCategories, lectureCategoriesRequest] = useListLectureCategories();
  const { event } = useContext(EventContext);
  const categories = useAppSelector((state) => state.categories);

  const data = lectureCategories.data?.map((e) => ({
    title: categories?.find((e1) => e1.name === e.category)?.icon,
    desc: e.category,
    value: e.count,
    color: iconColor.cloud,
  }));

  useEffect(() => {
    lectureCategoriesRequest({ urlParams: { id: event.id } });
  }, [lectureCategoriesRequest, event.id]);

  if (lectureCategories.loading) return <SmallLoader />;

  return (
    <div className={classes.container}>
      <div>
        <Typography color="primary">Inskickade Pass</Typography>
        <Divider />
      </div>
      <div className={classes.subContainer}>
        <PieChart
          data={data}
          radius={PieChart.defaultProps.radius - size}
          segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
          segmentsShift={(index) => (index === hovered ? size : 2)}
          animate
          onMouseOver={(_, index) => setHovered(index)}
          onMouseOut={() => setHovered(undefined)}
          startAngle={-90}
          label={(e) => (
            <ChartIcon
              one={data?.length === 1}
              key={e.dataEntry.title}
              onMouseOver={() => setHovered(e.dataIndex)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...e}
            />
          )}
        />
        <div className={classes.descContainer}>
          {data?.map((e) => (
            <Fragment key={e.title}>
              <img
                alt="icon"
                width="12"
                height="12"
                src={`data:image/svg+xml;base64,${window.btoa(e.title as string)}`}
              />
              <Typography>{e.desc}</Typography>
              <Typography>{e.value}</Typography>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureStats;
