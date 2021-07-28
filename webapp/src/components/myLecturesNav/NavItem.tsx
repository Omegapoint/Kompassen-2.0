import { ButtonBase, makeStyles, Theme, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { colors, padding } from '../../theme/Theme';

interface StyleProps {
  active: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  navItem: {
    width: '100%',
    display: 'grid',
    justifyItems: 'center',
    justifyContent: 'normal',
    alignItems: 'normal',
    gridGap: padding.standard,
  },
  bar: {
    display: 'grid',
    background: colors.primary,
    height: ({ active }) => (active ? '5px' : '1px'),
    width: '100%',
  },
}));

interface NavItemProps {
  active: boolean;
  title: string;
  nrOfItems: number;
  handleClick: () => void;
}

const NavItem = ({ active, title, nrOfItems, handleClick }: NavItemProps): ReactElement => {
  const classes = useStyles({ active });

  return (
    <ButtonBase className={classes.navItem} onClick={handleClick}>
      <Typography variant="h2">{`${title} (${nrOfItems})`}</Typography>
      <div className={classes.bar} />
    </ButtonBase>
  );
};

export default NavItem;
