import { Box, ButtonBase, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { colors, padding } from '../../theme/Theme';

interface NavItemProps {
  active: boolean;
  title: string;
  handleClick: () => void;
}

const NavItem = ({ active, title, handleClick }: NavItemProps): ReactElement => (
  <ButtonBase
    sx={{
      width: '100%',
      display: 'grid',
      justifyItems: 'center',
      justifyContent: 'normal',
      alignItems: 'normal',
      gridGap: padding.standard,
    }}
    onClick={handleClick}
  >
    <Typography sx={{ padding: `0 ${padding.standard}` }} variant="h2">
      {title}
    </Typography>
    <Box
      sx={{
        display: 'grid',
        background: colors.primary,
        height: active ? '5px' : '1px',
        width: '100%',
      }}
    />
  </ButtonBase>
);

export default NavItem;
