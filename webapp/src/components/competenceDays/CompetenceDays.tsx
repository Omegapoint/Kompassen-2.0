import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core';
import LectureStats from './LectureStats';
import { padding } from '../../theme/Theme';
import DaysToGo from './DaysToGo';
import DayPicker from './DayPicker';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridGap: padding.standard,
  },
}));

const CompetenceDays = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DayPicker />
      <DaysToGo />
      <LectureStats />
    </div>
  );
};

export default CompetenceDays;
