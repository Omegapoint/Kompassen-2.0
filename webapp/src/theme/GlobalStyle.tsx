import { createStyles, makeStyles } from '@material-ui/core';
import { ReactElement } from 'react';
import { colors } from './Theme';

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

const GlobalStyles = (): ReactElement => {
  useStyles();
  return <></>;
};

export default GlobalStyles;
