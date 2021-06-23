import { ReactElement } from 'react';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { colors, fontFamilies } from '../../theme/Theme';

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

const differentColors = [
  colors.lightGreen,
  colors.darkOrange,
  colors.teal,
  colors.yellow,
  colors.purple,
];

interface WordProps {
  name: string;
  size: number;
}

const Word = ({ name, size }: WordProps): ReactElement => {
  const classes = useStyles({
    size,
    color: differentColors[Math.floor(Math.random() * differentColors.length)],
  });
  return <Typography className={classes.container}>{name}</Typography>;
};

export default Word;
