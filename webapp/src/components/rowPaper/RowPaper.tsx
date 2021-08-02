import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import { ReactElement, ReactNode } from 'react';
import { borderRadius, colors, padding } from '../../theme/Theme';

interface StyleProps {
  color: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr',
    },
    line: {
      background: ({ color }) => color,
      width: '6px',
      borderRadius: `${borderRadius.standard} 0 0 ${borderRadius.standard}`,
    },
    paper: {
      padding: padding.small,
    },
  })
);

interface RowPaperProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

const RowPaper = ({
  children,
  color = colors.blue,
  className = '',
}: RowPaperProps): ReactElement => {
  const classes = useStyles({ color });

  return (
    <div className={classes.container}>
      <div className={classes.line} />
      <Paper className={`${classes.paper} ${className}`}>{children}</Paper>
    </div>
  );
};

export default RowPaper;
