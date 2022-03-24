import { useMsal } from '@azure/msal-react';
import { ArrowDropDown, Edit, ExitToApp, Person } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  SxProps,
} from '@mui/material';
import { MouseEvent, ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAzure } from '../../api/Login';
import { useAppSelector } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

const linkStyle: SxProps = { color: colors.black };

const User = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { instance } = useMsal();
  const { logoutRequest } = useAzure();
  const { azureUser } = useAppSelector((state) => state.session);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const logout = () => instance.logoutPopup(logoutRequest);

  return (
    <>
      <IconButton
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          alignItems: 'center',
          padding: 0,
        }}
        onClick={handleClick}
        size="large"
      >
        <Avatar
          sx={{
            backgroundColor: colors.white,
            color: colors.primary,
            fontSize: '1rem',
            width: '34px',
            height: '34px',
          }}
        >
          {azureUser.givenName[0] + azureUser.surname[0]}
        </Avatar>
        <ArrowDropDown htmlColor={colors.white} />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Edit fontSize="small" />
            <ListItem sx={linkStyle} component={NavLink} to="/lecture/user">
              Hantera mina pass
            </ListItem>
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" />
            <ListItem sx={linkStyle} component={NavLink} to="/settings">
              Min profil
            </ListItem>
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon sx={linkStyle}>
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
