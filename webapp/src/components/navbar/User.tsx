import { MouseEvent, ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Settings, ExitToApp, Edit, ArrowDropDown } from '@material-ui/icons';
import { useMsal } from '@azure/msal-react';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { instance } = useMsal();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/',
    });
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
          <ListItem component={NavLink} to="/settings">
            Inställningar
          </ListItem>
        </MenuItem>
        <Divider variant="middle" />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItem button onClick={logout}>
            Logga ut
          </ListItem>
        </MenuItem>
      </Menu>
    </>
  );
};

export default User;
