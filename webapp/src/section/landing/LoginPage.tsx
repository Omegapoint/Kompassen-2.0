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
        minWidth: '400px',
        display: 'grid',
        padding: padding.standard,
        gridGap: padding.large,
      }}
    >
      <Typography
        color="primary"
        variant="body1"
        sx={{ fontFamily: fontFamilies.header, fontSize: '2.0rem' }}
      >
        OMEGAPOINT KOMPASSEN
      </Typography>
      <Box sx={{ display: 'grid', gridGap: padding.standard }}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          Logga in på Kompassen
        </Typography>
        <Button color="primary" variant="contained" onClick={login}>
          Logga in med Azure AD
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
