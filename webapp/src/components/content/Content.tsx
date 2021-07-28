import { makeStyles } from '@material-ui/core';
import { ReactElement, ReactNode } from 'react';
import { constants } from '../../theme/Theme';

interface ContentProps {
  children: ReactNode;
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    justifyItems: 'center',
    alignContent: 'start',

    minWidth: '200px',
    minHeight: `calc(100vh - ${constants.headerHeight})`,
    padding: '20px',
    '& > div': {
      width: '100%',
    },
  },
}));

const Content = ({ children }: ContentProps): ReactElement => {
  const classes = useStyles();
  return <div className={classes.container}>{children}</div>;
};

export default Content;
