import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Button, createStyles, makeStyles, Paper, Typography } from '@material-ui/core';
import io, { Socket } from 'socket.io-client';
import GreetingPage from './GreetingPage';
import Navbar from './components/navbar/Navbar';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';
import useAccessToken from './hooks/UseAccessToken';
import { useCreateUser, useGetUser } from './lib/Hooks';
import Notifications from './section/settings/Notifications';
import { padding } from './theme/Theme';
import BigLoader from './components/loader/BigLoader';
import LoginPage from './LoginPage';
import UserContext from './UserContext';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'grid',
      height: '100vh',
      width: '100vw',
      alignContent: 'center',
      justifyContent: 'center',
    },
    paper: {
      display: 'grid',
      padding: padding.medium,
      gridGap: padding.standard,
      '& > button': {
        justifySelf: 'center',
      },
    },
  })
);

const defaultNotifications = {
  newLecture: true,
  newComment: true,
  adminRead: true,
  lectureTaken: true,
};

const Content = (): ReactElement => {
  const [getState, getUser] = useGetUser();
  const [, createUser] = useCreateUser();
  const { loading, token } = useAccessToken();
  const [socket, setSocket] = useState<null | Socket>(null);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const { inProgress } = useMsal();
  const classes = useStyles();

  useEffect(() => {
    if (token) {
      const sock = io('ws://localhost:8080/', {
        reconnectionDelayMax: 10000,
        auth: { token },
      });
      setSocket(sock);
    }
  }, [token]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleSubmit = async () => {
    await createUser({ body: { notifications } });
    window.location.reload();
  };

  if (loading || inProgress !== 'none' || getState.loading) {
    return <BigLoader />;
  }

  if (getState.error?.code === 404) {
    return (
      <GreetingPage>
        <Paper className={classes.paper}>
          <Typography variant="h2">Välkommen till Kompass 2.0</Typography>
          <Typography variant="h6">Ställ in dina notifikationsinställningar</Typography>
          <Notifications handleChange={handleChange} checked={notifications} />
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Spara inställningarna
          </Button>
        </Paper>
      </GreetingPage>
    );
  }

  if (!getState.data || !socket) {
    return <BigLoader />;
  }

  return (
    <UserContext.Provider value={{ user: getState.data, socket }}>
      <Navbar />
      <div style={{ display: 'grid', justifyItems: 'center' }}>
        <Body />
      </div>
      <Footer />
    </UserContext.Provider>
  );
};

const App = (): ReactElement => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <GreetingPage>
        <LoginPage />
      </GreetingPage>
    );
  }
  return <Content />;
};

export default App;
