import { Button, createStyles, makeStyles, Paper, Typography } from '@material-ui/core';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import io from 'socket.io-client';
import {
  createUser,
  getUser,
  listCategories,
  listEvents,
  listLocations,
  userExists,
} from './api/Api';
import { BASE_WS_URL } from './api/Fetch';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';
import BigLoader from './components/loader/BigLoader';
import Navbar from './components/navbar/Navbar';
import { useAppDispatch, useAppSelector } from './lib/Lib';
import { setCategories } from './reducers/categories/actions';
import { setEvents } from './reducers/events/actions';
import { setLocations } from './reducers/locations/actions';
import { setSocket } from './reducers/session/actions';
import { setUser } from './reducers/user/actions';
import GreetingPage from './section/landing/GreetingPage';
import Notifications from './section/settings/Notifications';
import { padding } from './theme/Theme';

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

function useFetchDispatch<Res>(
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn1: () => any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn2: (payload: Res) => any
) {
  const result = useQuery(key, fn1);
  const [finished, setFinished] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (result.data) {
      dispatch(fn2(result.data));
      setFinished(true);
    }
  }, [dispatch, fn2, result.data]);
  return { ...result, finished };
}

const useInit = () => {
  const user = useFetchDispatch('user', getUser, setUser);
  const locations = useFetchDispatch('locations', listLocations, setLocations);
  const categories = useFetchDispatch('categories', listCategories, setCategories);
  const events = useFetchDispatch('events', () => listEvents(), setEvents);

  const dispatch = useAppDispatch();
  const { apiToken } = useAppSelector((state) => state.session);

  useEffect(() => {
    (async () => {
      const sock = io(BASE_WS_URL, {
        reconnectionDelayMax: 10000,
        auth: { token: apiToken },
      });
      dispatch(setSocket(sock));
    })();
  }, [dispatch, apiToken]);

  const error = user.error || locations.error || categories.error || events.error;
  const finished = user.finished && locations.finished && categories.finished && events.finished;
  return { error, loading: !finished };
};

const Content = (): ReactElement => {
  const { loading } = useInit();

  if (loading) {
    return <BigLoader />;
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

const ContentWrapper = (): ReactElement => {
  const exists = useQuery('', () => userExists());
  const classes = useStyles();
  const [notifications, setNotifications] = useState(defaultNotifications);
  const { mutate, isSuccess } = useMutation(createUser);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async () => {
    mutate({ notifications });
  };

  useEffect(() => {
    if (isSuccess) window.location.reload();
  }, [isSuccess]);

  if (exists.isLoading) {
    return <BigLoader />;
  }

  if (!exists.data?.ok) {
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
  return <Content />;
};

export default ContentWrapper;
