import { useMsal } from '@azure/msal-react';
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { ArrowDropDown, Edit, ExitToApp, Settings } from '@material-ui/icons';
import { MouseEvent, ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAzure } from '../../api/Login';
import { useAppSelector } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

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
  link: {
    color: colors.black,
  },
}));

const User = (): ReactElement => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { instance } = useMsal();
  const { logoutRequest } = useAzure();
  const { azureUser } = useAppSelector((state) => state.session);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => instance.logoutPopup(logoutRequest);

  return (
    <>
      <IconButton className={classes.container} onClick={handleClick}>
        <Avatar className={classes.avatar}>{azureUser.givenName[0] + azureUser.surname[0]}</Avatar>
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
            <ListItem className={classes.link} component={NavLink} to="/lecture/user">
              Hantera mina pass
            </ListItem>
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
            <ListItem className={classes.link} component={NavLink} to="/settings">
              Inställningar
            </ListItem>
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon className={classes.link}>
            <ExitToApp fontSize="small" />
            <ListItem button onClick={logout}>
              Logga ut
            </ListItem>
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </>
  );
};

export default User;
