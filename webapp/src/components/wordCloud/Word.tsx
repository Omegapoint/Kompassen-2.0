import { ReactElement } from 'react';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { fontFamilies } from '../../theme/Theme';

interface StyleProps {
  size: number;
  color: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() =>
  createStyles({
    container: {
      fontSize: ({ size }) => `${size}rem`,
      color: ({ color }) => color,
      fontFamily: fontFamilies.header,
      lineHeight: 1,
    },
  })
);

interface WordProps {
  name: string;
  color: string;
  size: number;
}

const Word = ({ color, name, size }: WordProps): ReactElement => {
  const classes = useStyles({
    size,
    color,
  });
  return <Typography className={classes.container}>{name}</Typography>;
};

export default Word;
