import React, { ReactElement } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { borderRadius, colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    gridGap: padding.small,
    justifyContent: 'center',
    background: colors.background,
    padding: `${padding.minimal} 0`,
    borderRadius: borderRadius.tiny,
  },
  nr: {
    background: colors.primary,
    color: colors.white,
    lineHeight: 1,
    fontSize: '1.2rem',
    padding: padding.tiny,
    borderRadius: borderRadius.tiny,
  },
  desc: {
    lineHeight: 1,
    color: colors.primary,
  },
  subContainer: {
    display: 'flex',
    alignItems: 'center',
    gridGap: padding.tiny,
  },
}));

const data = [
  { nr: 21, desc: 'dagar' },
  { nr: 3, desc: 'h' },
  { nr: 34, desc: 'min' },
];

const DaysToGo = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {data.map((e) => (
        <div key={e.desc} className={classes.subContainer}>
          <Typography className={classes.nr}>{e.nr}</Typography>
          <Typography className={classes.desc}>{e.desc}</Typography>
        </div>
      ))}
    </div>
  );
};

export default DaysToGo;
