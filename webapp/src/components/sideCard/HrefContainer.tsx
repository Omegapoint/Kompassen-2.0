import { Link, Paper } from '@mui/material';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LongArrowCircled } from '../../assets/longArrowCircled.svg';
import { borderRadius, padding } from '../../theme/Theme';

interface LinkContainerProps {
  href: string;
  hrefText: string;
  hrefBarColor: string;
}

const HrefContainer = ({ href, hrefText, hrefBarColor }: LinkContainerProps): ReactElement => (
  <Paper
    sx={{
      display: 'grid',
      gridAutoFlow: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: `${borderRadius.small} ${borderRadius.small} 0 0`,
      padding: `${padding.small} ${padding.small}`,
      background: hrefBarColor,
    }}
  >
    <Link component={NavLink} to={href} color="secondary" variant="subtitle1">
      {hrefText}
    </Link>
    <Link component={NavLink} to={href} sx={{ height: '20px' }}>
      <LongArrowCircled width="20px" height="20px" />
    </Link>
  </Paper>
);

export default HrefContainer;
