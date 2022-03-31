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
  Typography,
} from '@mui/material';
import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAzure } from '../../api/Login';
import { useAppSelector } from '../../lib/Lib';
import store from '../../reducers';
import { colors } from '../../theme/Theme';

const linkStyle: SxProps = { color: colors.black };

export async function getAzureGraphImage(): Promise<string> {
  const accessToken = store.getState().session.graphToken;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const result = await fetch(
    `https://graph.microsoft.com/v1.0/users/33ff501d-fd05-4e18-a318-12ad6608ef0b/photo/$value`,
    options
  )
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
  if (result instanceof Object && result.body !== null) {
    const reader = result.body.getReader();
    const test2 = await reader.read();
    if (test2.value !== undefined) {
      return URL.createObjectURL(new Blob([test2.value], { type: 'image/png' } /* (1) */));
    }
    throw new Error();
  }
  throw new Error();
}

const User = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { instance } = useMsal();
  const { logoutRequest } = useAzure();
  const { azureUser } = useAppSelector((state) => state.session);
  const user = useAppSelector((state) => state.user);
  const [profileImgLink, setProfileImgLink] = useState('/broken-image.jpg');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const logout = () => instance.logoutPopup(logoutRequest);

  useEffect(() => {
    const getPhoto = async () => {
      const accessToken = store.getState().session.graphToken;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const result = await fetch(
        `https://graph.microsoft.com/v1.0/users/${user.id}/photo/$value`,
        options
      )
        // eslint-disable-next-line no-console
        .catch((error) => console.log(error));

      if (result instanceof Object && result.status === 200 && result.body !== null) {
        const reader = result.body.getReader();
        const test2 = await reader.read();
        if (test2.value !== undefined) {
          const test3 = new Blob([test2.value], { type: 'image/png' } /* (1) */);

          const url = window.URL || window.webkitURL;
          const blobUrl = url.createObjectURL(test3);
          setProfileImgLink(blobUrl);
        }
      }
    };
    getPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {profileImgLink !== '/broken-image.jpg' && <Avatar src={`${profileImgLink}`} />}
          {profileImgLink === '/broken-image.jpg' && (
            <Avatar src={`${profileImgLink}`}>
              <Typography>{azureUser.givenName[0] + azureUser.surname[0]}</Typography>
            </Avatar>
          )}
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
            <ListItem sx={linkStyle} component={NavLink} to="/profile">
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
