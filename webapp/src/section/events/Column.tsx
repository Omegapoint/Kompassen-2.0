import { createStyles, Divider, makeStyles, Typography } from '@material-ui/core';
import { ReactElement, ReactNode } from 'react';
import { colors, padding } from '../../theme/Theme';

interface ColumnProps {
  title: string;
  children: ReactNode;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      gridGap: padding.small,
    },
    header: {
      color: colors.orange,
    },
    divider: {
      width: '100%',
    },
    children: {
      display: 'grid',
      gridGap: padding.small,
      '& >*': {
        width: '100%',
      },
    },
  })
);

const Column = ({ title, children }: ColumnProps): ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.header}>
        {title}
      </Typography>
      <Divider className={classes.divider} />
      <div className={classes.children}>{children}</div>
    </div>
  );
};

export default Column;
