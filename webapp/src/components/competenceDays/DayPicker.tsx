import React, { ReactElement } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { ReactComponent as TinyArrow } from '../../assets/tinyArrow.svg';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr min-content',
    gridGap: padding.standard,
    alignItems: 'center',
    justifyItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.tiny,
  },
  button: {
    backgroundColor: colors.primary,
    padding: `${padding.minimal} ${padding.tiny}`,
    minWidth: 0,
    lineHeight: 1,
    '&:disabled': {
      '& path': {
        fill: colors.grey,
      },
    },
  },
  leftButton: {
    borderRadius: `${borderRadius.tiny} 0 0 ${borderRadius.tiny}`,
  },
  rightButton: {
    borderRadius: `0 ${borderRadius.tiny} ${borderRadius.tiny} 0`,
  },
}));

const DayPicker = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Button
        color="primary"
        variant="contained"
        disabled
        className={`${classes.button} ${classes.leftButton}`}
      >
        <TinyArrow width={10} height={10} transform="rotate(180)" />
      </Button>
      <Typography>Umeå 2021-06-14 13:00-17:00</Typography>
      <Button
        color="primary"
        variant="contained"
        className={`${classes.button} ${classes.rightButton}`}
      >
        <TinyArrow width={10} height={10} />
      </Button>
    </div>
  );
};

export default DayPicker;
