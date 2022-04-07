import { Paper, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { borderRadius, colors, padding } from '../../theme/Theme';

interface LinkContainerProps {
  headerText: string;
  bgColor: string;
}

const SideCardHeader = ({ headerText, bgColor }: LinkContainerProps): ReactElement => (
  <Paper
    sx={{
      display: 'grid',
      gridAutoFlow: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      borderRadius: `${borderRadius.small} ${borderRadius.small} 0 0`,
      padding: `${padding.small} ${padding.small}`,
      background: bgColor,
    }}
  >
    <Typography sx={{color: colors.white}} variant="subtitle1">
      {headerText}
    </Typography>
  </Paper>
);

export default SideCardHeader;
