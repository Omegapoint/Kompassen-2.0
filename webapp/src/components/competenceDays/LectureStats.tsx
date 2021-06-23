import React, { ReactElement, useState, Fragment } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { DataEntry } from 'react-minimal-pie-chart/types/commonTypes';
import { colors, padding } from '../../theme/Theme';
import { getIconByKind, IconType, LectureKind } from '../latestLectures/lecture';
import ChartIcon from './ChartIcon';

export const iconColor: IconType = {
  cloud: colors.yellow,
  code: colors.teal,
  shield: colors.darkOrange,
  sun: colors.lightGreen,
  vcs: colors.purple,
};

interface DataKind extends DataEntry {
  title: LectureKind;
  desc: string;
}

const data: DataKind[] = [
  { title: 'cloud', desc: 'Molnbaserat', value: 3, color: iconColor.cloud },
  { title: 'sun', desc: 'Mjukt spår', value: 2, color: iconColor.sun },
  { title: 'vcs', desc: 'Versionshantering', value: 2, color: iconColor.vcs },
  { title: 'shield', desc: 'Säkerhet', value: 1, color: iconColor.shield },
  { title: 'code', desc: 'Utveckling', value: 0, color: iconColor.code },
];

const filteredData = data.filter((e) => e.value > 0);

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

const LectureStats = (): ReactElement => {
  const classes = useStyles();
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  const size = 6;

  return (
    <div className={classes.container}>
      <div>
        <Typography color="primary">Inskickade Pass</Typography>
        <Divider />
      </div>
      <div className={classes.subContainer}>
        <PieChart
          data={filteredData}
          radius={PieChart.defaultProps.radius - size}
          segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
          segmentsShift={(index) => (index === hovered ? size : 2)}
          animate
          onMouseOver={(_, index) => setHovered(index)}
          onMouseOut={() => setHovered(undefined)}
          startAngle={-90}
          label={(e) => (
            <ChartIcon
              key={e.dataEntry.title}
              onMouseOver={() => setHovered(e.dataIndex)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...e}
            />
          )}
        />
        <div className={classes.descContainer}>
          {data.map((e) => (
            <Fragment key={e.title}>
              <img alt="icon" width="12" height="12" src={getIconByKind(e.title)} />
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
