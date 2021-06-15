import { createStyles, makeStyles } from '@material-ui/core';
import { FC } from 'react';
import { colors } from './theme';

const useStyles = makeStyles(() =>
  createStyles({
    '@global': {
      body: {
        background: colors.background,
      },
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
    },
  })
);

const GlobalStyles: FC = () => {
  useStyles();
  return null;
};

export default GlobalStyles;
