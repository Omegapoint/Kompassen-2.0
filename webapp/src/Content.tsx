import { Box } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import io from 'socket.io-client';
import { getUser } from './api/Api';
import { BASE_WS_URL } from './api/Fetch';
import CurrentPath from './components/currentPath/CurrentPath';
import Footer from './components/footer/Footer';
import BigLoader from './components/loader/BigLoader';
import Navbar from './components/navbar/Navbar';
import { useAppDispatch, useAppSelector } from './lib/Lib';
import { setSocket } from './reducers/session/actions';
import { setUser } from './reducers/user/actions';
import Router from './router/Router';
import { padding } from './theme/Theme';
import {
  useCategoriesWS,
  useEventsWS,
  useFormatsWS,
  useOfficesWS,
  useOrganisationsWS,
} from './ws/ReduxWS';

function useFetchDispatch<Res>(
  key: string,
  fn1: () => Promise<Res>,
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
  const categoriesReady = useCategoriesWS();
  const eventsReady = useEventsWS();
  const organisationsReady = useOrganisationsWS();
  const officesReady = useOfficesWS();
  const formatsReady = useFormatsWS();
  const user = useFetchDispatch('user', getUser, setUser);

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

  const finished =
    user.finished &&
    categoriesReady &&
    eventsReady &&
    organisationsReady &&
    officesReady &&
    formatsReady;

  return { error: user.error, loading: !finished };
};

const Content = (): ReactElement => {
  const { loading } = useInit();

  if (loading) {
    return <BigLoader />;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'grid', justifyItems: 'center' }}>
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            padding: padding.standard,
            maxWidth: '1500px',
            justifySelf: 'center',
          }}
        >
          <CurrentPath />
          <Router />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Content;
