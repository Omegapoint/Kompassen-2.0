import React, { ChangeEvent, ReactElement, useEffect } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Button, createStyles, makeStyles, Modal, Paper, Typography } from '@material-ui/core';
import LoginPage from './LoginPage';
import Navbar from './components/navbar/Navbar';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';
import useAccessToken from './hooks/UseAccessToken';
import { useCreateUser, useGetUser } from './lib/hooks';
import Notifications from './section/settings/Notifications';
import { padding } from './theme/Theme';
import Loader from './components/loader/Loader';

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

const Content = (): ReactElement => {
  const [getState, getUser] = useGetUser();
  const [, createUser] = useCreateUser();
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (getState.error?.code === 404) {
      handleOpen();
    }
  }, [createUser, getState]);

  const [checked, setChecked] = React.useState({
    newPosts: true,
    commentedPost: true,
    adminReadPost: true,
    responsibleClass: true,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async () => {
    await createUser({
      body: {
        notifications: {
          newLecture: true,
          newComment: true,
          adminRead: true,
          lectureTaken: true,
        },
      },
    });
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <Body />
      <Footer />
      <Modal open={open} onClose={handleClose}>
        <div className={classes.modal}>
          <Paper className={classes.paper}>
            <Typography variant="h2">Välkommen till Kompass 2.0</Typography>
            <Typography variant="h6">Ställ in dina notifikationsinställningar</Typography>
            <Notifications handleChange={handleChange} checked={checked} />
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Spara inställningarna
            </Button>
          </Paper>
        </div>
      </Modal>
    </>
  );
};

const App = (): ReactElement => {
  const { loading } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (loading || inProgress !== 'none') {
    return <Loader />;
  }

  return <Content />;
};

export default App;
