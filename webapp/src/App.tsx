import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Button, createStyles, makeStyles, Paper, Typography } from '@material-ui/core';
import io from 'socket.io-client';
import GreetingPage from './GreetingPage';
import Navbar from './components/navbar/Navbar';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';
import useAccessToken from './hooks/UseAccessToken';
import {
  useCreateUser,
  UseFetchResult,
  useGetUser,
  useListCategories,
  useListEvents,
  useListLocations,
} from './lib/Hooks';
import Notifications from './section/settings/Notifications';
import { padding } from './theme/Theme';
import BigLoader from './components/loader/BigLoader';
import LoginPage from './LoginPage';
import { setUser } from './reducers/user/actions';
import { useAppDispatch, useAppSelector } from './lib/Lib';
import { setSocket } from './reducers/session/actions';
import { setCategories } from './reducers/categories/actions';
import { setLocations } from './reducers/locations/actions';
import { setEvents } from './reducers/events/actions';

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

const useFetchDispatch = <Res, Req>(
  useHook: () => UseFetchResult<Res, Req>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (payload: Res) => any
) => {
  const [ret, request] = useHook();
  const [finished, setFinished] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const resp = await request();
      if (!resp.error) {
        dispatch(fn(resp.data as Res));
      }
      setFinished(true);
    })();
  }, [dispatch, fn, request]);
  return { ...ret, finished };
};

const useInit = () => {
  const locations = useFetchDispatch(useListLocations, setLocations);
  const categories = useFetchDispatch(useListCategories, setCategories);
  const events = useFetchDispatch(useListEvents, setEvents);

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.session);

  useEffect(() => {
    (async () => {
      const sock = io('ws://localhost:8080/', {
        reconnectionDelayMax: 10000,
        auth: { token },
      });
      dispatch(setSocket(sock));
    })();
  }, [dispatch, token]);

  const error = locations.error || categories.error || events.error;
  const finished = locations.finished && categories.finished && events.finished;

  return { error, loading: !finished };
};

const Content = (): ReactElement => {
  const user = useFetchDispatch(useGetUser, setUser);
  const { loading } = useInit();
  const [, createUser] = useCreateUser();
  const [notifications, setNotifications] = useState(defaultNotifications);
  const { inProgress } = useMsal();
  const classes = useStyles();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async () => {
    await createUser({ body: { notifications } });
    window.location.reload();
  };

  if (inProgress !== 'none' || loading) {
    return <BigLoader />;
  }

  if (user.error?.code === 404) {
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

  return (
    <>
      <Navbar />
      <div style={{ display: 'grid', justifyItems: 'center' }}>
        <Body />
      </div>
      <Footer />
    </>
  );
};

const App = (): ReactElement => {
  const isAuthenticated = useIsAuthenticated();
  const { loading } = useAccessToken(isAuthenticated);
  const { token } = useAppSelector((state) => state.session);

  if (!isAuthenticated) {
    return (
      <GreetingPage>
        <LoginPage />
      </GreetingPage>
    );
  }

  if (loading || !token) {
    return <BigLoader />;
  }

  return <Content />;
};

export default App;
