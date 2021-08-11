import { Divider, makeStyles, Typography } from '@material-ui/core';
import { Fragment, ReactElement, useContext, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useQuery } from 'react-query';
import { listLectureCategories } from '../../api/Api';
import { useAppSelector } from '../../lib/Lib';
import { colors, padding } from '../../theme/Theme';
import { IconType } from '../latestLectures/lecture';
import SmallLoader from '../loader/SmallLoader';
import ChartIcon from './ChartIcon';
import EventContext from './EventContext';

export const iconColor: IconType = {
  cloud: colors.yellow,
  code: colors.teal,
  shield: colors.orange,
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
  emptyLabel: {
    display: 'grid',
    gridColumn: 'span 3',
    justifyItems: 'center',
  },
}));

const size = 6;

const LectureStats = (): ReactElement => {
  const classes = useStyles();
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const { event } = useContext(EventContext);
  const { data, isLoading } = useQuery(`lectureCategories-${event.id}`, () =>
    listLectureCategories({ id: event.id })
  );

  const categories = useAppSelector((state) => state.categories);
  const mapped = data?.map((e) => {
    const category = categories?.find((e1) => e1.id === e.categoryID);

    return {
      title: category?.icon,
      desc: category?.name,
      value: e.count,
      color: category?.color || '',
    };
  });

  return (
    <div className={classes.container}>
      <div>
        <Typography color="primary">Inskickade Pass</Typography>
        <Divider />
      </div>
      {isLoading ? (
        <SmallLoader />
      ) : (
        <div className={classes.subContainer}>
          {mapped?.length ? (
            <>
              <PieChart
                data={mapped}
                radius={PieChart.defaultProps.radius - size}
                segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                segmentsShift={(index) => (index === hovered ? size : 2)}
                animate
                onMouseOver={(_, index) => setHovered(index)}
                onMouseOut={() => setHovered(undefined)}
                startAngle={-90}
                label={(e) => (
                  <ChartIcon
                    one={mapped?.length === 1}
                    key={e.dataEntry.title}
                    onMouseOver={() => setHovered(e.dataIndex)}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...e}
                  />
                )}
              />
              <div className={classes.descContainer}>
                {mapped?.map((e) => (
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
            </>
          ) : (
            <Typography className={classes.emptyLabel}>Här var det tomt</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default LectureStats;
