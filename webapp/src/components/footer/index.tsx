import { ReactElement } from 'react';
import { createStyles, makeStyles, Typography } from '@material-ui/core';
import { padding } from '../../theme/theme';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      justifyItems: 'center',
      padding: padding.standard,
    },
  })
);

const Footer = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>© Copyright 2021 Omegapoint Group AB</Typography>
    </div>
  );
};

export default Footer;
