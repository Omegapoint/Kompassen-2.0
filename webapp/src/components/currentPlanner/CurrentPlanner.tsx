import React, { ReactElement } from 'react';
import { Link, makeStyles, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'max-content max-content',
    gridGap: `${padding.tiny} ${padding.standard}`,
  },
  link: {
    color: colors.black,
    textDecoration: 'underline',
  },
}));

const CurrentPlanner = (): ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography>Stockholm</Typography>
      <Link className={classes.link} component={NavLink} to="/" variant="body1">
        Jan Bananberg
      </Link>
      <Typography>Umeå</Typography>
      <Link className={classes.link} component={NavLink} to="/" variant="body1">
        Jannica Apelsinskog
      </Link>
    </div>
  );
};

export default CurrentPlanner;
