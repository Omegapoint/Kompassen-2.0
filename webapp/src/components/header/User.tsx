import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Settings, ExitToApp, Edit, ArrowDropDown } from '@material-ui/icons';
import React, { MouseEvent, ReactElement } from 'react';
import { colors } from '../../theme/Theme';

interface UserProps {
  firstName: string;
  lastName: string;
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    padding: 0,
  },
  avatar: {
    backgroundColor: colors.white,
    color: colors.primary,
    fontSize: '1rem',
    width: '34px',
    height: '34px',
  },
  menupaper: {
    borderRadius: 0,
  },
}));

const User = ({ firstName, lastName }: UserProps): ReactElement => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton className={classes.container} onClick={handleClick}>
        <Avatar className={classes.avatar}>{firstName[0] + lastName[0]}</Avatar>
        <ArrowDropDown htmlColor={colors.white} />
      </IconButton>
      <Menu
        PaperProps={{ className: classes.menupaper }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hantera mina pass</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Inställningar</ListItemText>
        </MenuItem>
        <Divider variant="middle" />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logga ut</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default User;
