import React, { ReactElement, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import { constants } from '../../theme/Theme';

interface ContentProps {
  children: ReactNode;
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    justifyItems: 'center',
    maxWidth: '1800px',
    minWidth: '200px',
    minHeight: `calc(100vh - ${constants.headerHeight})`,
    padding: '20px',
  },
}));

const Content = ({ children }: ContentProps): ReactElement => {
  const classes = useStyles();
  return <div className={classes.container}>{children}</div>;
};

export default Content;
