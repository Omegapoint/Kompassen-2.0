import MuiGlobalStyles from '@mui/material/GlobalStyles';
import { ReactElement } from 'react';
import { colors } from './Theme';

const GlobalStyles = (): ReactElement => (
  <MuiGlobalStyles
    styles={{
      body: {
        background: colors.background,
      },
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
    }}
  />
);

export default GlobalStyles;
