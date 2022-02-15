import { useMsal } from '@azure/msal-react';
import { Box, Button, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useAzure } from '../../api/Login';
import { colors, fontFamilies, padding } from '../../theme/Theme';

const LoginPage = (): ReactElement => {
  const { instance } = useMsal();
  const { loginRequest } = useAzure();
  const login = async () => instance.loginPopup(loginRequest);

  return (
    <Box
      sx={{
        background: colors.background,
        width: window.innerWidth,
        display: 'grid',
        padding: ['none', padding.standard],
        gridGap: ['none', padding.large],
        // minWidth: '400px', any particular reason for this?
      }}
    >
      <Typography
        color="primary"
        variant="body1"
        sx={{ display: ['none', 'inline'], fontFamily: fontFamilies.header, fontSize: '2.5rem' }}
      >
        KomPass 2.0
      </Typography>
      <Box sx={{ display: 'grid', gridGap: padding.standard }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', display: ['none', 'inline'] }}>
          Logga in på Kompassen2
        </Typography>
        <Button
          variant="contained"
          onClick={login}
          sx={{
            borderRadius: [0, 1],
            height: ['10vh', 'auto'],
            fontSize: ['large', 'medium'],
            backgroundColor: [colors.lightGreen, colors.primary],
          }}
        >
          Logga in med Azure AD
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
