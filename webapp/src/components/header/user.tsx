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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { FC, MouseEvent } from 'react';
import { colors } from '../../theme/theme';

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
    borderRadius: '0px',
  },
}));

const User: FC<UserProps> = ({ firstName, lastName }: UserProps) => {
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
        <ArrowDropDownIcon htmlColor={colors.white} />
      </IconButton>
      <Menu
        PaperProps={{ className: classes.menupaper }}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hantera mina pass</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Inställningar</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logga ut</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default User;
